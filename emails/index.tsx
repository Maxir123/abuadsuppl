import { Resend } from 'resend'
import PurchaseReceiptEmail from './purchase-receipt'
import { IOrder } from '@/lib/db/models/order.model'
import { SENDER_EMAIL, SENDER_NAME } from '@/lib/constants'
import { EmailOrder } from '@/types/email-order'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  const cleanOrder = JSON.parse(JSON.stringify(order))

  if (!cleanOrder.user?.email) {
    console.error('❌ User email missing, receipt not sent')
    return
  }

  console.log(
    '📧 Sending purchase receipt to:',
    cleanOrder.user.email
  )

const result = await resend.emails.send({
  from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
  to: cleanOrder.user.email,
  subject: 'Your AbuadSupply Order Receipt',
  react: <PurchaseReceiptEmail order={cleanOrder} />,
})

console.log('📨 Resend result:', result)

if (result.error) {
  console.error('❌ Resend error:', result.error)
}

}
