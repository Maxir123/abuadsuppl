// app/api/paystack/init/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Order from '@/lib/db/models/order.model'
import type { IOrder } from '@/lib/db/models/order.model'


export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json()
    if (!orderId) {
      return NextResponse.json({ error: 'missing orderId' }, { status: 400 })
    }

    // 🔑 IMPORTANT: findById + typed lean
    const order = await Order
      .findById(orderId)
      .populate('user')
      .lean<IOrder | null>()

    if (!order) {
      return NextResponse.json({ error: 'order not found' }, { status: 404 })
    }

    // Now TS KNOWS this is a single order
    const email =
      typeof order.user === 'string'
        ? '' // or fallback email
        : order.user?.email

    if (!email) {
      return NextResponse.json({ error: 'user email not found' }, { status: 400 })
    }
    

    // ✅ No TS error here anymore
    const amount = Math.round(order.totalPrice * 100)

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        metadata: { orderId: order._id.toString() },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/redirect`

      }),
    })

    const data = await res.json()
    if (!data?.status) {
      console.error('Paystack init failed', data)
      return NextResponse.json({ error: 'Paystack init failed', data }, { status: 500 })
    }

    // Save reference
    await Order.findByIdAndUpdate(order._id, {
      paystackReference: data.data.reference,
    })

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || 'internal error' },
      { status: 500 }
    )
  }
}
