'use server'

import { Cart, OrderItem, ShippingAddress } from '@/types'
import { formatError, round2 } from '../utils'
import { AVAILABLE_DELIVERY_DATES } from '../constants'
import Order, { IOrder } from '../db/models/order.model'
import { OrderInputSchema } from '../validator'
import { auth } from '@/auth'
import { connectToDatabase } from '../db'
import { formatAmountForPaystack, paystack } from '../paystack'
import { sendPurchaseReceipt } from '@/emails'
import { revalidatePath } from 'next/cache'

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
export async function createPaystackPayment(orderId: string) {
  await connectToDatabase()

  try {
    const order = await Order.findById(orderId).populate('user', 'email')
    if (!order) throw new Error('Order not found')

    // FIX: Assert 'order.user' as the specific object shape we expect
    const user = order.user as unknown as { email: string }

    const amountInKobo = formatAmountForPaystack(order.totalPrice)
    const reference = `order_${orderId}_${Date.now()}`

    const init = await paystack.initializePayment({
      email: user.email, // Use the casted 'user' variable
      amount: amountInKobo,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account/orders/${orderId}/verify`,
      metadata: {
        orderId,
      },
    })

    order.paymentResult = {
      id: reference,
      status: 'INITIALIZED',
      email_address: user.email,
      pricePaid: '0',
    }

    await order.save()

    return {
      success: true,
      message: 'Paystack payment initialized successfully',
      data: {
        authorization_url: init.data.authorization_url,
        reference,
      },
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// ⭐ VERIFY PAYSTACK PAYMENT
export async function verifyPaystackPayment(
  orderId: string,
  data: { reference: string }
) {
  await connectToDatabase()

  try {
    const order = await Order.findById(orderId).populate('user', 'email name')
    if (!order) throw new Error('Order not found')

    const verification = await paystack.verifyPayment(data.reference)
    const result = verification.data

    if (result.status !== 'success') throw new Error('Payment not completed')

    // Update order
    order.isPaid = true
    order.paidAt = new Date()

    // FIX: Ensure pricePaid is a string to match the error requirement
    // result.amount is usually in Kobo (e.g. 5000), we divide by 100 for Naira (50.00)
    order.paymentResult = {
      id: result.reference,
      status: result.status,
      email_address: result.customer?.email || '',
      pricePaid: (result.amount / 100).toFixed(2),
    }

    await order.save()

    // Send receipt email
    await sendPurchaseReceipt({ order })

    // Revalidate orders page
    revalidatePath(`/account/orders/${orderId}`)

    return {
      success: true,
      message: 'Your order has been successfully paid via Paystack',
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
