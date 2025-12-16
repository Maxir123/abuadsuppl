// app/api/paystack/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import Order from '@/lib/db/models/order.model'
import mongoose from 'mongoose'

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text()
    const signature = req.headers.get('x-paystack-signature') || ''
    const expected = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '').update(raw).digest('hex')
    if (signature !== expected) {
      return NextResponse.json({ success: false, message: 'invalid signature' }, { status: 401 })
    }

    const body = JSON.parse(raw)
    const event = body?.event
    const eventData = body?.data

    if (event === 'charge.success') {
      const metadataOrderId = eventData?.metadata?.orderId
      if (metadataOrderId) {
        await mongoose.connect(process.env.MONGODB_URI || '')
        const order = await Order.findById(metadataOrderId)
        if (order && !order.isPaid) {
          // double-check amount if you want
          order.isPaid = true
          order.paidAt = new Date()
          order.paymentResult = {
            reference: eventData.reference,
            gateway_response: eventData.gateway_response,
            channel: eventData.channel,
            amount: eventData.amount,
          }
          await order.save()
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('webhook error', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
