import { Resend } from 'resend'
import PurchaseReceiptEmail from './purchase-receipt'
import { IOrder } from '@/lib/db/models/order.model'
import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'
import { EmailOrder } from '@/types/email-order'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  // Convert mongoose document → plain object
  const cleanOrder: EmailOrder = JSON.parse(JSON.stringify(order))

  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: cleanOrder.user.email,
    subject: 'Order Confirmation',
    react: <PurchaseReceiptEmail order={cleanOrder} />,
  })
}
