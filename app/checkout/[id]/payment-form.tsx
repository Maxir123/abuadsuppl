'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime } from '@/lib/utils'
import CheckoutFooter from '../checkout-footer'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import { approvepaystackOrder } from '@/lib/actions/order.actions'
import PayButton from '@/components/PayButton'

interface OrderPaymentFormProps {
  order: IOrder
  paystackClientId: string
  isAdmin?: boolean
  /**
   * Optional overrides so this component can be used when your Paystack flow
   * lives somewhere else (server action / API route).
   */
  onCreatePaystackOrder?: (orderId: string) => Promise<{ success: boolean; message?: string; data?: any }> // returns created order data for the Paystack widget
  onApprovePaystack?: (orderId: string, data: any) => Promise<{ success: boolean; message?: string }>
}

export default function OrderPaymentForm({
  order,
  paystackClientId,
  isAdmin = false,
  onCreatePaystackOrder,
  onApprovePaystack,
}: OrderPaymentFormProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  // client-side redirect if order already paid
  useEffect(() => {
    if (order?.isPaid) {
      router.push(`/account/orders/${order._id}`)
    }
  }, [order?.isPaid, order?._id, router])

  // Defensive destructure with defaults
  const {
    shippingAddress = {} as any,
    items = [],
    itemsPrice = 0,
    taxPrice = 0,
    shippingPrice = 0,
    totalPrice = 0,
    paymentMethod,
    expectedDeliveryDate,
    isPaid,
  } = order || {}

  const formattedDelivery = useMemo(() => {
    if (!expectedDeliveryDate) return 'Not available'
    return formatDateTime(expectedDeliveryDate).dateOnly
  }, [expectedDeliveryDate])

  // Fallback implementation that calls an API route if a prop handler isn't provided.
  const createPaystackOrder = async (orderId: string) => {
    if (onCreatePaystackOrder) return onCreatePaystackOrder(orderId)

    setIsCreating(true)
    try {
      const res = await fetch('/api/paystack/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      setIsCreating(false)
      return data
    } catch (err: any) {
      setIsCreating(false)
      return { success: false, message: err?.message || 'Failed to create Paystack order' }
    }
  }

  const approvePaystackOrder = async (orderId: string, payload: any) => {
    setIsApproving(true)
    try {
      if (onApprovePaystack) {
        const result = await onApprovePaystack(orderId, payload)
        setIsApproving(false)
        return result
      }

      // default: use the server action / helper the app already has
      const result = await approvepaystackOrder(orderId, payload)
      setIsApproving(false)
      return result
    } catch (err: any) {
      setIsApproving(false)
      return { success: false, message: err?.message || 'Approval failed' }
    }
  }

  // Lightweight Paystack integration UI. Replace or enhance this part with
  // your preferred Paystack provider/widget. This component keeps the
  // create/approve responsibilities outside of UI so it is easy to test.
  const PaystackArea = () => {
    if (paymentMethod !== 'PayStack' || isPaid) return null

    return (
      <div className='space-y-2'>
        {/* Show helpful state for user */}
        <div className='text-sm'>
          Pay securely with PayStack. You will be redirected to the PayStack popup
          to complete payment.
        </div>

        <div className='flex gap-2'>
<form id="paystack-form">
  <Button
    type="button"
    className="rounded-full w-full"
    onClick={async () => {
      setIsCreating(true)

      // Step 1: Create Paystack order on server
      const res = await createPaystackOrder(order._id.toString())
      setIsCreating(false)

      if (!res?.success || !res.data?.reference) {
        toast.error('Payment initialization failed')
        return
      }

      const payload = res.data
      const userEmail = typeof order.user === 'string' ? '' : order.user.email

      // Step 2: Open Paystack Popup
      const handler = (window as any).PaystackPop.setup({
        key: paystackClientId,
        email: userEmail,
        amount: Math.round(totalPrice * 100), // NGN → kobo
        ref: payload.reference,
        onClose: () => toast.error('Payment window closed'),
        callback: async (response: any) => {
          setIsApproving(true)
          // Step 3: Approve / verify on your server
          const approval = await approvePaystackOrder(order._id.toString(), {
            reference: response.reference,
          })
          setIsApproving(false)
        if (approval?.success) {
          toast.success('Payment completed')
          router.push(`/account/orders/${order._id}`)
        } else {
          toast.error('Payment approval failed')
        }

        },
      })

      handler.openIframe()
    }}
    disabled={isCreating || isApproving}
  >
    {isCreating ? 'Initializing...' : isApproving ? 'Approving...' : 'Pay with PayStack'}
  </Button>
</form>


          <Button variant='ghost' onClick={() => router.push(`/account/orders/${order._id}`)}>
            View Order
          </Button>
        </div>
      </div>
    )
  }

  const CheckoutSummary = () => (
    <Card aria-labelledby='order-summary-title'>
      <CardContent className='p-4'>
        <div>
          <div id='order-summary-title' className='text-lg font-bold'>
            Order Summary
          </div>

          <div className='space-y-2 mt-2'>
            <div className='flex justify-between'>
              <span>Items:</span>
              <span>
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>

            <div className='flex justify-between'>
              <span>Shipping & Handling:</span>
              <span>
                {shippingPrice === undefined ? '--' : shippingPrice === 0 ? 'FREE' : <ProductPrice price={shippingPrice} plain />}
              </span>
            </div>

            <div className='flex justify-between'>
              <span>Tax:</span>
              <span>{taxPrice === undefined ? '--' : <ProductPrice price={taxPrice} plain />}</span>
            </div>

            <div className='flex justify-between pt-1 font-bold text-lg'>
              <span>Order Total:</span>
              <span>
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>

           <div>
        <PayButton orderId={order._id.toString()} />
      </div>
            {!isPaid && paymentMethod?.toLowerCase() === 'cash on delivery' && (
              <Button
                className='w-full rounded-full'
                onClick={() => router.push(`/account/orders/${order._id}`)}
              >
                View Order
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
  console.log('isPaid', isPaid, 'paymentMethod', paymentMethod)

console.log('OrderPaymentForm debug:', {
  isPaid,
  paymentMethod,
  totalPrice,
})
  return (
    <main className='max-w-6xl mx-auto'>
      <div className='grid md:grid-cols-4 gap-6'>
        <div className='md:col-span-3'>
          {/* Shipping Address */}
          <section aria-label='shipping address' className='mb-4'>
            <div className='grid md:grid-cols-3 my-3 pb-3'>
              <div className='text-lg font-bold'>Shipping Address</div>
              <div className='col-span-2'>
                <p>
                  {shippingAddress?.fullName ?? '—'} <br />
                  {shippingAddress?.street ?? '—'} <br />
                  {`${shippingAddress?.city ?? '—'}, ${shippingAddress?.province ?? '—'}, ${shippingAddress?.postalCode ?? '—'}, ${shippingAddress?.country ?? '—'}`}
                </p>
              </div>
            </div>
          </section>

          {/* payment method */}
          <section className='border-y py-3' aria-label='payment method'>
            <div className='grid md:grid-cols-3 my-3 pb-3'>
              <div className='text-lg font-bold'>Payment Method</div>
              <div className='col-span-2'>
                <p>{paymentMethod ?? '—'}</p>
              </div>
            </div>
          </section>

          <section className='grid md:grid-cols-3 my-3 pb-3' aria-label='items and shipping'>
            <div className='flex text-lg font-bold'>Items and shipping</div>
            <div className='col-span-2'>
              <p>Delivery date: {formattedDelivery}</p>

              <ul className='list-disc pl-4 mt-2'>
                {items.map((item: any) => (
                  <li key={item?.slug ?? item?.id} className='py-1'>
                    <span className='font-medium'>{item?.name ?? 'Unnamed'}</span>
                    <span> — </span>
                    <span>
                      {item?.quantity ?? 1} x <ProductPrice price={item?.price ?? 0} plain />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className='block md:hidden mt-4'>
            <CheckoutSummary />
          </div>

          <CheckoutFooter />
        </div>

        <aside className='hidden md:block'>
          <CheckoutSummary />
        </aside>
      </div>
    </main>
  )
}
