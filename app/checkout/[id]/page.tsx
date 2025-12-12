import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import PaymentForm from './payment-form'

export const metadata = {
  title: 'Payment',
}

const CheckoutPaymentPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params

  const order = await getOrderById(id)
  if (!order) return notFound()

  const session = await auth()

  return (
    <PaymentForm
      order={order}
      paystackPublicKey={process.env.PAYSTACK_PUBLIC_KEY ?? ''}
      isAdmin={session?.user?.role === 'Admin'}
    />
  )
}

export default CheckoutPaymentPage
