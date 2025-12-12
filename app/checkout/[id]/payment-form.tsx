'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Toaster, toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import type { IOrder } from '@/lib/db/models/order.model'
import { formatDateTime } from '@/lib/utils'
import {
  createPaystackPayment,
  verifyPaystackPayment,
} from '@/lib/actions/order.actions'
import {
  MapPin,
  CreditCard,
  Package,
  Calendar,
  Shield,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import CheckoutFooter from '../checkout-footer'
import { useRouter } from 'next/navigation'

interface PaystackPopInstance {
  newTransaction: (config: {
    key: string
    email: string
    amount: number
    ref: string
    onSuccess: (response: unknown) => void
    onCancel?: () => void
    onClose?: () => void
  }) => void
}

declare global {
  interface Window {
    PaystackPop?: {
      new (): PaystackPopInstance
    }
  }
}

// Extended ShippingAddress type with optional email
type ExtendedShippingAddress = {
  fullName: string
  street: string
  city: string
  postalCode: string
  province: string
  phone: string
  country: string
  email?: string
}

// Type for user object
type OrderUser = string | { email?: string; [key: string]: unknown }

interface OrderPaymentFormProps {
  order: IOrder & {
    shippingAddress?: ExtendedShippingAddress
    user?: OrderUser
    email?: string
  }
  paystackPublicKey: string
  isAdmin?: boolean
}

interface OrderSectionProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  border?: boolean
}

export default function OrderPaymentForm({
  order,
  paystackPublicKey,
  isAdmin,
}: OrderPaymentFormProps) {
  // silence unused isAdmin lint if not used
  void isAdmin

  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  // stable fallback reference created once on mount (impure calls only inside useEffect)
  const fallbackRef = useRef<string | null>(null)
  useEffect(() => {
    if (!fallbackRef.current) {
      // safe to call impure functions here (not during render)
      fallbackRef.current = `order_${String(order._id)}_${Date.now()}_${Math.floor(
        Math.random() * 1_000_000
      )}`
    }
    // we intentionally don't add order._id to deps to keep single seed during component lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // use a counter to ensure uniqueness across attempts for this mounted component
  const paymentCounterRef = useRef(0)

  const {
    _id: orderId,
    shippingAddress,
    items = [],
    totalPrice = 0,
    paymentMethod,
    expectedDeliveryDate,
    isPaid,
  } = order

  if (isPaid) {
    // redirect if already paid
    router.push(`/account/orders/${String(orderId)}`)
    return null
  }

  // Helper to pick an email from known places
  const getCustomerEmail = (): string => {
    const maybeUser = order.user
    if (maybeUser && typeof maybeUser === 'object' && 'email' in maybeUser) {
      // Typeguard: user is object with possibly email
      const e = (maybeUser as { email?: unknown }).email
      if (typeof e === 'string' && e.length > 0) return e
    }

    if (typeof order.email === 'string' && order.email.length > 0)
      return order.email
    if (shippingAddress?.email) return shippingAddress.email
    return 'customer@example.com'
  }

  // Main payment handler (invoked by user action)
  const handlePaystackPayment = async () => {
    setIsProcessing(true)
    try {
      const initRes = (await createPaystackPayment(String(orderId))) as {
        success: boolean
        message?: string
        data?: { reference?: string }
      }

      if (!initRes.success) {
        toast.error(initRes.message || 'Failed to initialize payment')
        setIsProcessing(false)
        return
      }

      paymentCounterRef.current += 1

      // Use server-provided reference if present; otherwise compose from stable fallback + counter
      const reference =
        initRes.data?.reference ??
        (fallbackRef.current
          ? `${fallbackRef.current}_${paymentCounterRef.current}`
          : `${String(orderId)}_${paymentCounterRef.current}`)

      // instantiate Paystack safely
      const PaystackCtor = window.PaystackPop
      if (!PaystackCtor) {
        toast.error('Paystack is not available on window')
        setIsProcessing(false)
        return
      }
      const paystack = new PaystackCtor()

      paystack.newTransaction({
        key: paystackPublicKey,
        email: getCustomerEmail(),
        amount: Math.round(Number(totalPrice || 0) * 100),
        ref: reference,
        onSuccess: async (response: unknown) => {
          // narrow the unknown response
          const tx = (response as { reference?: unknown }) ?? {}
          if (!tx || typeof tx.reference !== 'string') {
            toast.error('Payment completed but no reference returned.')
            setIsProcessing(false)
            return
          }

          toast.success('Payment completed — verifying...')

          try {
            const verifyRes = (await verifyPaystackPayment(String(orderId), {
              reference: tx.reference,
            })) as { success: boolean; message?: string }

            if (verifyRes.success) {
              toast.success(verifyRes.message || 'Payment verified.')
              // small delay so user sees toast
              setTimeout(() => {
                router.push(`/account/orders/${String(orderId)}`)
                router.refresh()
              }, 900)
            } else {
              toast.error(verifyRes.message || 'Payment verification failed.')
            }
          } catch (err) {
            console.error('verifyPaystackPayment error', err)
            toast.error('Error confirming Paystack payment.')
          } finally {
            setIsProcessing(false)
          }
        },
        onCancel: () => {
          toast.error('Payment window closed.')
          setIsProcessing(false)
        },
        onClose: () => {
          setIsProcessing(false)
        },
      })
    } catch (err) {
      console.error('Payment error:', err)
      toast.error('An error occurred during payment')
      setIsProcessing(false)
    }
  }

  const handleViewOrder = () => {
    router.push(`/account/orders/${String(orderId)}`)
  }

  return (
    <>
      <Toaster position='top-center' />

      <main className='max-w-6xl mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Complete Payment</h1>
          <p className='text-muted-foreground mt-2'>
            Order #{String(orderId).slice(-8)} • Secure payment with{' '}
            {paymentMethod}
          </p>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Order Details */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Shipping Address */}
            <OrderSection
              title='Shipping Address'
              icon={<MapPin className='h-5 w-5' />}
            >
              <div className='space-y-2'>
                <p className='font-semibold text-lg'>
                  {shippingAddress?.fullName}
                </p>
                {shippingAddress?.phone && (
                  <p className='text-muted-foreground'>
                    {shippingAddress.phone}
                  </p>
                )}
                <div className='space-y-1'>
                  <p>{shippingAddress?.street}</p>
                  <p>
                    {shippingAddress?.city}, {shippingAddress?.province}
                  </p>
                  <p>
                    {shippingAddress?.postalCode}, {shippingAddress?.country}
                  </p>
                </div>
              </div>
            </OrderSection>

            {/* Payment Method */}
            <OrderSection
              title='Payment Method'
              icon={<CreditCard className='h-5 w-5' />}
              border
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-lg font-semibold'>{paymentMethod}</p>
                  <p className='text-sm text-muted-foreground'>
                    {isPaid ? 'Payment completed' : 'Awaiting payment'}
                  </p>
                </div>
                {!isPaid && (
                  <div className='flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full'>
                    <span className='h-2 w-2 bg-amber-500 rounded-full animate-pulse' />
                    <span className='text-sm font-medium'>Pending</span>
                  </div>
                )}
              </div>
            </OrderSection>

            {/* Items & Delivery */}
            <OrderSection
              title='Items & Delivery'
              icon={<Package className='h-5 w-5' />}
            >
              <div className='space-y-4'>
                <div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg'>
                  <Calendar className='h-5 w-5 text-blue-600' />
                  <div>
                    <p className='font-medium'>Expected Delivery</p>
                    <p className='text-blue-700'>
                      {formatDateTime(expectedDeliveryDate).dateOnly}
                    </p>
                  </div>
                </div>

                <div className='space-y-3'>
                  <h4 className='font-semibold'>
                    Order Items ({items.length})
                  </h4>
                  <div className='space-y-3'>
                    {items.map((item) => (
                      <div
                        key={item.slug}
                        className='flex items-center gap-4 p-3 border rounded-lg'
                      >
                        <div className='relative h-16 w-16 rounded-lg overflow-hidden bg-muted'>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className='object-cover'
                            sizes='64px'
                          />
                        </div>
                        <div className='flex-1'>
                          <p className='font-medium'>{item.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className='text-right'>
                          <ProductPrice
                            price={item.price}
                            className='font-semibold'
                          />
                          <p className='text-sm text-muted-foreground'>
                            <ProductPrice
                              price={item.price * item.quantity}
                              plain
                            />
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </OrderSection>

            {/* Mobile Order Summary */}
            <div className='block lg:hidden'>
              <OrderSummary
                order={order}
                onPaystackPayment={handlePaystackPayment}
                onViewOrder={handleViewOrder}
                isProcessing={isProcessing}
                userEmail={getCustomerEmail()}
              />
            </div>

            <CheckoutFooter />
          </div>

          {/* Desktop Order Summary */}
          <div className='hidden lg:block'>
            <OrderSummary
              order={order}
              onPaystackPayment={handlePaystackPayment}
              onViewOrder={handleViewOrder}
              isProcessing={isProcessing}
              userEmail={getCustomerEmail()}
            />
          </div>
        </div>
      </main>
    </>
  )
}

// Order Section Component
function OrderSection({
  title,
  icon,
  children,
  border = false,
}: OrderSectionProps) {
  return (
    <Card
      className={`${border ? 'border-t-0 border-r-0 border-l-0 border-b' : ''}`}
    >
      <CardContent className='p-6'>
        <div className='flex items-center gap-3 mb-4'>
          {icon && <div className='p-2 rounded-lg bg-primary/10'>{icon}</div>}
          <h3 className='text-lg font-semibold'>{title}</h3>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

// Order Summary Component (kept mostly the same)
interface OrderSummaryProps {
  order: IOrder & {
    shippingAddress?: ExtendedShippingAddress
    user?: OrderUser
  }
  onPaystackPayment: () => Promise<void> | void
  onViewOrder: () => void
  isProcessing: boolean
  userEmail: string
}

function OrderSummary({
  order,
  onPaystackPayment,
  onViewOrder,
  isProcessing,
  userEmail,
}: OrderSummaryProps) {
  const {
    itemsPrice = 0,
    shippingPrice,
    taxPrice,
    totalPrice = 0,
    isPaid,
    paymentMethod,
  } = order

  const priceBreakdown = [
    { label: 'Subtotal', price: itemsPrice },
    {
      label: 'Shipping',
      price: shippingPrice,
      note: shippingPrice === 0 ? 'Free Shipping' : undefined,
    },
    { label: 'Tax', price: taxPrice },
  ]

  return (
    <Card className='sticky top-6 border shadow-lg'>
      <CardHeader className='pb-4 border-b'>
        <CardTitle className='text-xl'>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='space-y-3'>
          {priceBreakdown.map((item) => (
            <div key={item.label} className='flex justify-between items-center'>
              <div>
                <span className='text-muted-foreground'>{item.label}</span>
                {item.note && (
                  <p className='text-xs text-green-600'>{item.note}</p>
                )}
              </div>
              <span className='font-medium'>
                {item.price === undefined ? (
                  '--'
                ) : item.price === 0 ? (
                  <span className='text-green-600'>FREE</span>
                ) : (
                  <ProductPrice price={item.price} plain />
                )}
              </span>
            </div>
          ))}

          <div className='pt-4 border-t'>
            <div className='flex justify-between items-center'>
              <span className='text-lg font-bold'>Total Amount</span>
              <ProductPrice
                price={totalPrice}
                className='text-2xl font-bold text-primary'
              />
            </div>
          </div>
        </div>

        <div className='mt-8 space-y-4'>
          {!isPaid && paymentMethod === 'Paystack' && (
            <>
              <Button
                onClick={onPaystackPayment}
                disabled={isProcessing}
                className='w-full h-12 text-base font-semibold'
                size='lg'
              >
                {isProcessing ? (
                  <>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className='mr-2 h-5 w-5' />
                    Pay Now
                  </>
                )}
              </Button>

              <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                <CheckCircle className='h-4 w-4 text-green-500' />
                <span>Secure payment powered by Paystack</span>
              </div>
            </>
          )}

          {!isPaid && paymentMethod === 'Cash On Delivery' && (
            <Button
              onClick={onViewOrder}
              className='w-full h-12 text-base'
              variant='outline'
            >
              View Order Details
            </Button>
          )}

          <div className='flex flex-wrap justify-center gap-3 pt-6 border-t'>
            <div className='flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full'>
              <div className='h-1.5 w-1.5 rounded-full bg-green-500' />
              <span className='text-xs'>SSL Secure</span>
            </div>
            <div className='flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full'>
              <div className='h-1.5 w-1.5 rounded-full bg-green-500' />
              <span className='text-xs'>Encrypted</span>
            </div>
            <div className='flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full'>
              <div className='h-1.5 w-1.5 rounded-full bg-green-500' />
              <span className='text-xs'>PCI DSS</span>
            </div>
          </div>
        </div>

        <div className='mt-6 space-y-2 text-sm text-muted-foreground'>
          <p className='flex items-start gap-2'>
            <span className='h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0' />
            Your items are reserved for 30 minutes
          </p>
          <p className='flex items-start gap-2'>
            <span className='h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0' />
            Confirmation will be sent to {userEmail}
          </p>
          <p className='flex items-start gap-2'>
            <span className='h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0' />
            24/7 customer support available
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
