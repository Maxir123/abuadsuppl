// app/api/paystack/redirect/route.ts
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Order from '@/lib/db/models/order.model'
import { SENDER_NAME } from '@/lib/constants' // optional, used to ensure email from name is 'abuadsupply'
import { sendPurchaseReceipt } from '@/emails'

async function connectIfNeeded() {
  if (mongoose.connection.readyState === 1) return
  await mongoose.connect(process.env.MONGODB_URI || '')
}

export async function GET(req: NextRequest) {
  try {
    const reference = req.nextUrl.searchParams.get('reference')
    if (!reference) {
      return NextResponse.redirect(new URL('/?payment=failed', req.url))
    }

    // Verify with Paystack using your secret key
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const data = await verifyRes.json()

    if (!data?.status || data.data?.status !== 'success') {
      console.error('Paystack verification failed', data)
      return NextResponse.redirect(new URL('/?payment=failed', req.url))
    }

    const metadataOrderId = data.data?.metadata?.orderId
    if (!metadataOrderId) {
      console.error('Paystack verify: missing metadata.orderId', data)
      return NextResponse.redirect(new URL('/?payment=failed', req.url))
    }

    // Connect and load order
    await connectIfNeeded()
    const order = await Order.findById(metadataOrderId).populate('user')
    console.log('🧾 Order ID:', order._id)
    console.log('👤 User object:', order.user)
    console.log('📧 User email:', order.user?.email)


    if (!order) {
      console.error('Order not found for metadata.orderId', metadataOrderId)
      return NextResponse.redirect(new URL('/?payment=failed', req.url))
    }

    // Verify amounts (Paystack returns amount in kobo)
    const paidAmount = Number(data.data.amount)
    const expectedAmount = Math.round(Number(order.totalPrice) * 100)
    if (paidAmount !== expectedAmount) {
      console.error('Amount mismatch', { paidAmount, expectedAmount, orderId: order._id })
      return NextResponse.redirect(new URL('/?payment=failed', req.url))
    }

    // Update order if not already paid
    if (!order.isPaid) {
      order.isPaid = true
      order.paidAt = new Date()
      order.paymentResult = {
        reference: data.data.reference,
        gateway_response: data.data.gateway_response,
        channel: data.data.channel,
        amount: data.data.amount,
      }
      await order.save()
    }

    // Send purchase receipt email (best-effort; we don't fail the redirect if email fails)
    try {
      // If you want the "from" name to read "abuadsupply", ensure SENDER_NAME in your constants is 'abuadsupply'
      await sendPurchaseReceipt({ order })
    } catch (emailErr) {
      console.error('Failed to send purchase receipt email', emailErr)
      // continue — we still want to redirect the user even if email fails
    }

    // Redirect to home with success query param (adjust target as you want)
    return NextResponse.redirect(new URL('/?payment=success', req.url))
  } catch (err: any) {
    console.error('Paystack redirect/verify error', err)
    return NextResponse.redirect(new URL('/?payment=failed', req.url))
  }
}
