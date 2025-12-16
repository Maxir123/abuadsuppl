// app/api/paystack/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Order from '@/lib/db/models/order.model'
import { sendPurchaseReceipt } from '@/emails'


export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference')
  if (!reference) return NextResponse.json({ error: 'missing reference' }, { status: 400 })

  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
  })
  const data = await res.json()
  if (!data.status) return NextResponse.json({ error: 'verification failed', details: data }, { status: 400 })

  const tx = data.data
  // find order by metadata or by saved reference
  const orderId = tx.metadata?.orderId
  let order = null
  if (orderId) order = await Order.findById(orderId)
  if (!order) order = await Order.findOne({ paystackReference: reference })

  if (!order) return NextResponse.json({ error: 'order not found' }, { status: 404 })

  if (!order.isPaid && tx.status === 'success') {
    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = { provider: 'Paystack', reference, status: tx.status }
    await order.save()

    try { await sendPurchaseReceipt({ order }) } catch (e) { console.error(e) }
  }

  return NextResponse.json({ ok: true, tx })
}
