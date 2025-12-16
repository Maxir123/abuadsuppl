'use server'

import { Cart, OrderItem, ShippingAddress } from '@/types'
import { formatError, round2 } from '../utils'
import { AVAILABLE_DELIVERY_DATES } from '../constants'
import { OrderInputSchema } from '../validator'
import { auth } from '@/auth'
import { connectToDatabase } from '../db'
import Order, { IOrder } from '../db/models/order.model'
import { revalidatePath } from 'next/cache'
import { sendPurchaseReceipt } from '@/emails'
import { paystack } from '../paystack'

export const createOrder = async (clientSideCart: Cart) => {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session) throw new Error('User not authenticated')

    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    )

    return {
      success: true,
      message: 'Order placed successfully',
      data: { orderId: createdOrder._id.toString() },
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export const createOrderFromCart = async (
  clientSideCart: Cart,
  userId: string
) => {
  const cart = {
    ...clientSideCart,
    ...calcDeliveryDateAndPrice({
      items: clientSideCart.items,
      shippingAddress: clientSideCart.shippingAddress,
      deliveryDateIndex: clientSideCart.deliveryDateIndex,
    }),
  }

  const order = OrderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliveryDate,
  })

  return await Order.create(order)
}
// ⭐ GET ORDER
export async function getOrderById(orderId: string): Promise<IOrder> {
  await connectToDatabase()
  const order = await Order.findById(orderId)
  return JSON.parse(JSON.stringify(order))
}

// ... (imports remain the same)

// ⭐ INITIALIZE PAYSTACK PAYMENT
export async function createpaystackOrder(orderId: string) {
  await connectToDatabase()
  try {
    const order = await Order.findById(orderId)
    .populate('user', 'email name')
    if (order) {
      const paystackOrder = await paystack.createOrder(order.totalPrice)
      order.paymentResult = {
        id: paystackOrder.id,
        email_address: '',
        status: '',
        pricePaid: '0',
      }
      await order.save()
      return {
        success: true,
        message: 'paystack order created successfully',
        data: paystackOrder.id,
      }
    } else {
      throw new Error('Order not found')
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

export async function approvepaystackOrder(
  orderId: string,
  data: { orderID: string }
) {
  await connectToDatabase()
  try {
    const order = await Order.findById(orderId).populate('user', 'email name')
    if (!order) throw new Error('Order not found')

    const captureData = await paystack.capturePayment(data.orderID)
    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== 'COMPLETED'
    )
      throw new Error('Error in paystack payment')
    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
      id: captureData.id,
      status: captureData.status,
      email_address: captureData.payer.email_address,
      pricePaid:
        captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
    }
    await order.save()
   if (!order.user?.email) {
  console.error('❌ No user email found. Email not sent.')
  return
}

  console.log('📧 Sending purchase receipt to:', order.user.email)

  await sendPurchaseReceipt({
    order,
  })

    revalidatePath(`/account/orders/${orderId}`)
    return {
      success: true,
      message: 'Your order has been successfully paid by paystack',
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}
export const calcDeliveryDateAndPrice = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const deliverayDate =
    AVAILABLE_DELIVERY_DATES[
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex
    ]

  const shippingPrice =
    !shippingAddress || !deliverayDate
      ? undefined
      : deliverayDate.freeShippingMinPrice > 0 &&
          itemsPrice >= deliverayDate.freeShippingMinPrice
        ? 0
        : deliverayDate.shippingPrice

  const taxPrice = round2(
    itemsPrice + (shippingPrice ? shippingPrice : 0) * 0.15
  )

  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  )

  return {
    AVAILABLE_DELIVERY_DATES,
    deliverayDateIndex:
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}
