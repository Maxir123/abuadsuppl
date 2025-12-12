'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  calculateFutureDate,
  formatDateTime,
  timeUntilMidnight,
} from '@/lib/utils'
import { ShippingAddressSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import type { OrderItem } from '@/types'
import {
  MapPin,
  CreditCard,
  Package,
  CheckCircle2,
  Edit,
  Truck,
  Shield,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import CheckoutFooter from './checkout-footer'
import { ShippingAddress } from '@/types'
import useIsMounted from '@/hooks/use-is-mounted'
import Link from 'next/link'
import useCartStore from '@/hooks/use-cart-store'
import ProductPrice from '@/components/shared/product/product-price'
import {
  APP_NAME,
  AVAILABLE_DELIVERY_DATES,
  AVAILABLE_PAYMENT_METHODS,
  DEFAULT_PAYMENT_METHOD,
} from '@/lib/constants'
import { createOrder } from '@/lib/actions/order.actions'
import { toast } from 'sonner'

// Stepper Component
const Stepper = ({
  isAddressSelected,
  isPaymentMethodSelected,
  isDeliveryDateSelected,
}: {
  isAddressSelected: boolean
  isPaymentMethodSelected: boolean
  isDeliveryDateSelected: boolean
}) => (
  <div className='flex items-center justify-between mb-8 max-w-3xl mx-auto px-4'>
    {/* Step 1 */}
    <div
      className={`flex flex-col items-center ${
        isAddressSelected ? 'text-green-600' : 'text-gray-400'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
          isAddressSelected
            ? 'bg-green-600 border-green-600 text-white'
            : 'border-gray-300'
        }`}
      >
        {isAddressSelected ? (
          <CheckCircle2 className='h-6 w-6' />
        ) : (
          <span className='font-bold'>1</span>
        )}
      </div>
      <span className='text-sm font-medium mt-3'>Shipping Address</span>
    </div>

    {/* Connector 1 */}
    <div
      className={`flex-1 h-1 mx-4 ${
        isPaymentMethodSelected ? 'bg-green-600' : 'bg-gray-300'
      }`}
    ></div>

    {/* Step 2 */}
    <div
      className={`flex flex-col items-center ${
        isPaymentMethodSelected ? 'text-green-600' : 'text-gray-400'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
          isPaymentMethodSelected
            ? 'bg-green-600 border-green-600 text-white'
            : 'border-gray-300'
        }`}
      >
        {isPaymentMethodSelected ? (
          <CheckCircle2 className='h-6 w-6' />
        ) : (
          <span className='font-bold'>2</span>
        )}
      </div>
      <span className='text-sm font-medium mt-3'>Payment Method</span>
    </div>

    {/* Connector 2 */}
    <div
      className={`flex-1 h-1 mx-4 ${
        isDeliveryDateSelected ? 'bg-green-600' : 'bg-gray-300'
      }`}
    ></div>

    {/* Step 3 */}
    <div
      className={`flex flex-col items-center ${
        isDeliveryDateSelected ? 'text-green-600' : 'text-gray-400'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
          isDeliveryDateSelected
            ? 'bg-green-600 border-green-600 text-white'
            : 'border-gray-300'
        }`}
      >
        {isDeliveryDateSelected ? (
          <CheckCircle2 className='h-6 w-6' />
        ) : (
          <span className='font-bold'>3</span>
        )}
      </div>
      <span className='text-sm font-medium mt-3'>Review & Confirm</span>
    </div>
  </div>
)

// CheckoutSummary Component
const CheckoutSummary = ({
  isAddressSelected,
  isPaymentMethodSelected,
  items,
  itemsPrice,
  shippingPrice,
  taxPrice,
  totalPrice,
  onSelectShippingAddress,
  onSelectPaymentMethod,
  onPlaceOrder,
}: {
  isAddressSelected: boolean
  isPaymentMethodSelected: boolean
  items: OrderItem[] // <-- FIXED
  itemsPrice: number
  shippingPrice?: number
  taxPrice?: number
  totalPrice: number
  onSelectShippingAddress: () => void
  onSelectPaymentMethod: () => void
  onPlaceOrder: () => void
}) => {
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <Card className='rounded-xl shadow-lg border-0 sticky top-6'>
      <CardHeader className='bg-gradient-to-r from-green-600 to-emerald-600 text-white'>
        <h3 className='text-xl font-bold'>Order Summary</h3>
        <p className='text-green-100 text-sm'>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </CardHeader>
      <CardContent className='p-6'>
        {!isAddressSelected && (
          <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
            <Button
              className='w-full bg-green-600 hover:bg-green-700 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300'
              onClick={onSelectShippingAddress}
            >
              Continue to Shipping
            </Button>
            <p className='text-xs text-center text-gray-600 mt-3'>
              Choose a shipping address and payment method to calculate
              shipping, handling, and tax.
            </p>
          </div>
        )}
        {isAddressSelected && !isPaymentMethodSelected && (
          <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
            <Button
              className='w-full bg-green-600 hover:bg-green-700 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300'
              onClick={onSelectPaymentMethod}
            >
              Continue to Payment
            </Button>
            <p className='text-xs text-center text-gray-600 mt-3'>
              Choose a payment method to continue. You can review your order
              before finalizing.
            </p>
          </div>
        )}
        {isPaymentMethodSelected && isAddressSelected && (
          <div className='mb-6 p-4 bg-green-50 rounded-lg border border-green-200'>
            <Button
              onClick={onPlaceOrder}
              className='w-full bg-green-600 hover:bg-green-700 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
            >
              Place Your Order
            </Button>
            <p className='text-xs text-center text-gray-600 mt-3'>
              By placing your order, you agree to {APP_NAME}&apos;s{' '}
              <Link
                href='/page/privacy-policy'
                className='text-green-600 hover:text-green-700 font-medium'
              >
                privacy notice
              </Link>{' '}
              and
              <Link
                href='/page/conditions-of-use'
                className='text-green-600 hover:text-green-700 font-medium'
              >
                {' '}
                conditions of use
              </Link>
              .
            </p>
          </div>
        )}

        <div className='space-y-4'>
          <div className='flex justify-between text-base'>
            <span className='text-gray-600'>Items ({itemCount}):</span>
            <span className='font-semibold text-gray-900'>
              <ProductPrice price={itemsPrice} />
            </span>
          </div>
          <div className='flex justify-between text-base'>
            <span className='text-gray-600'>Shipping:</span>
            <span
              className={`font-semibold ${
                shippingPrice === 0 ? 'text-green-600' : 'text-gray-900'
              }`}
            >
              {shippingPrice === undefined ? (
                '--'
              ) : shippingPrice === 0 ? (
                'FREE'
              ) : (
                <ProductPrice price={shippingPrice} />
              )}
            </span>
          </div>
          <div className='flex justify-between text-base'>
            <span className='text-gray-600'>Tax:</span>
            <span className='font-semibold text-gray-900'>
              {taxPrice === undefined ? (
                '--'
              ) : (
                <ProductPrice price={taxPrice} />
              )}
            </span>
          </div>
          <div className='border-t border-gray-200 pt-4'>
            <div className='flex justify-between text-xl font-bold'>
              <span>Order Total</span>
              <span className='text-green-600'>
                <ProductPrice price={totalPrice} />
              </span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className='mt-6 space-y-3'>
          <div className='flex items-center gap-3 text-sm text-gray-600'>
            <Truck className='h-4 w-4 text-green-600' />
            <span>Free campus delivery available</span>
          </div>
          <div className='flex items-center gap-3 text-sm text-gray-600'>
            <Shield className='h-4 w-4 text-green-600' />
            <span>Secure encrypted payment</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const shippingAddressDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        fullName: 'Basir',
        street: '1911, 65 Sherbrooke Est',
        city: 'Montreal',
        province: 'Quebec',
        phone: '4181234567',
        postalCode: 'H2X 1C4',
        country: 'Canada',
      }
    : {
        fullName: '',
        street: '',
        city: '',
        province: '',
        phone: '',
        postalCode: '',
        country: '',
      }

const CheckoutForm = () => {
  const router = useRouter()

  const {
    cart: {
      items,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      shippingAddress,
      deliveryDateIndex,
      paymentMethod = DEFAULT_PAYMENT_METHOD,
    },
    setShippingAddress,
    setPaymentMethod,
    updateItem,
    removeItem,
    setDeliveryDateIndex,
    clearCart, // <-- add this
  } = useCartStore()

  const isMounted = useIsMounted()

  const shippingAddressForm = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: shippingAddress || shippingAddressDefaultValues,
  })
  const onSubmitShippingAddress: SubmitHandler<ShippingAddress> = (values) => {
    setShippingAddress(values)
    setIsAddressSelected(true)
  }
  // local selected delivery index (keeps radio controlled and syncs with store)
  const [selectedDeliveryIndex, setSelectedDeliveryIndex] = useState<
    number | undefined
  >(deliveryDateIndex)

  // keep local selected index in sync if store value changes
  useEffect(() => {
    setSelectedDeliveryIndex(deliveryDateIndex)
  }, [deliveryDateIndex])

  useEffect(() => {
    if (!isMounted || !shippingAddress) return
    shippingAddressForm.setValue('fullName', shippingAddress.fullName)
    shippingAddressForm.setValue('street', shippingAddress.street)
    shippingAddressForm.setValue('city', shippingAddress.city)
    shippingAddressForm.setValue('country', shippingAddress.country)
    shippingAddressForm.setValue('postalCode', shippingAddress.postalCode)
    shippingAddressForm.setValue('province', shippingAddress.province)
    shippingAddressForm.setValue('phone', shippingAddress.phone)
  }, [items, isMounted, router, shippingAddress, shippingAddressForm])

  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false)
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] =
    useState<boolean>(false)
  const [isDeliveryDateSelected, setIsDeliveryDateSelected] =
    useState<boolean>(false)

  const handlePlaceOrder = async () => {
    // guard: shipping address
    if (!shippingAddress) {
      toast.error('Please provide a shipping address before placing the order.')
      return
    }

    // guard: delivery date must be selected
    // Use selectedDeliveryIndex from local state instead of deliveryDateIndex from store
    // This ensures we have the most current value
    if (selectedDeliveryIndex === undefined) {
      toast.error('Please select a delivery date before placing the order.')
      return
    }

    // guard: payment method (optional)
    if (!paymentMethod) {
      toast.error('Please choose a payment method before placing the order.')
      return
    }

    try {
      const res = await createOrder({
        items,
        shippingAddress,
        expectedDeliveryDate: calculateFutureDate(
          AVAILABLE_DELIVERY_DATES[selectedDeliveryIndex].daysToDeliver
        ),
        deliveryDateIndex: selectedDeliveryIndex, // Use the local state value
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })

      if (!res.success) {
        toast.error(res.message || 'Failed to place order')
        return
      }

      // success
      toast.success(res.message || 'Order placed successfully!')
      clearCart()
      router.push(`/checkout/${res.data?.orderId}`)
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.')
      console.error(err)
    }
  }

  const handleSelectPaymentMethod = () => {
    setIsAddressSelected(true)
    setIsPaymentMethodSelected(true)
  }
  const handleSelectShippingAddress = () => {
    shippingAddressForm.handleSubmit(onSubmitShippingAddress)()
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4 max-w-7xl'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Checkout</h1>
          <p className='text-gray-600 mt-2'>Complete your purchase securely</p>
        </div>

        <Stepper
          isAddressSelected={isAddressSelected}
          isPaymentMethodSelected={isPaymentMethodSelected}
          isDeliveryDateSelected={isDeliveryDateSelected}
        />

        <div className='grid lg:grid-cols-4 gap-8'>
          <div className='lg:col-span-3 space-y-6'>
            {/* Shipping Address */}
            <div>
              {isAddressSelected && shippingAddress ? (
                <Card className='rounded-xl shadow-sm border-0'>
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start gap-4'>
                        <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                          <MapPin className='h-6 w-6 text-green-600' />
                        </div>
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                            Shipping Address
                          </h3>
                          <div className='text-gray-600 space-y-1'>
                            <p className='font-medium'>
                              {shippingAddress.fullName}
                            </p>
                            <div>{shippingAddress.street}</div>
                            <div>{`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}`}</div>
                            <div>{shippingAddress.country}</div>
                            <p className='flex items-center gap-1'>
                              📞 {shippingAddress.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={'outline'}
                        onClick={() => {
                          setIsAddressSelected(false)
                          setIsPaymentMethodSelected(false)
                          setIsDeliveryDateSelected(false)
                        }}
                        className='text-green-600 border-green-200 hover:bg-green-50'
                      >
                        <Edit className='h-4 w-4 mr-2' />
                        Change
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className='rounded-xl shadow-sm border-0'>
                  <CardHeader className='bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-green-600 rounded-full flex items-center justify-center'>
                        <MapPin className='h-5 w-5 text-white' />
                      </div>
                      <div>
                        <h2 className='text-xl font-bold text-gray-900'>
                          Shipping Address
                        </h2>
                        <p className='text-sm text-gray-600'>
                          Where should we deliver your order?
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='p-6'>
                    <Form {...shippingAddressForm}>
                      <form
                        method='post'
                        onSubmit={shippingAddressForm.handleSubmit(
                          onSubmitShippingAddress
                        )}
                        className='space-y-6'
                      >
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                          <FormField
                            control={shippingAddressForm.control}
                            name='fullName'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-gray-700 font-medium'>
                                  Full Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter full name'
                                    {...field}
                                    className='rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='phone'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-gray-700 font-medium'>
                                  Phone Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter phone number'
                                    {...field}
                                    className='rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={shippingAddressForm.control}
                          name='street'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-gray-700 font-medium'>
                                Street Address
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter street address'
                                  {...field}
                                  className='rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                          <FormField
                            control={shippingAddressForm.control}
                            name='city'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-gray-700 font-medium'>
                                  City
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter city'
                                    {...field}
                                    className='rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='province'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-gray-700 font-medium'>
                                  Province
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter province'
                                    {...field}
                                    className='rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='postalCode'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-gray-700 font-medium'>
                                  Postal Code
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter postal code'
                                    {...field}
                                    className='rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='country'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-gray-700 font-medium'>
                                  Country
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter country'
                                    {...field}
                                    className='rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          type='submit'
                          className='w-full bg-green-600 hover:bg-green-700 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300'
                        >
                          Save & Continue
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Payment Method */}
            {isAddressSelected && (
              <div>
                {isPaymentMethodSelected && paymentMethod ? (
                  <Card className='rounded-xl shadow-sm border-0'>
                    <CardContent className='p-6'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-4'>
                          <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                            <CreditCard className='h-6 w-6 text-green-600' />
                          </div>
                          <div>
                            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                              Payment Method
                            </h3>
                            <p className='text-gray-600 font-medium capitalize'>
                              {paymentMethod.replace(/_/g, ' ')}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant='outline'
                          onClick={() => setIsPaymentMethodSelected(false)}
                          className='text-green-600 border-green-200 hover:bg-green-50'
                        >
                          <Edit className='h-4 w-4 mr-2' />
                          Change
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className='rounded-xl shadow-sm border-0'>
                    <CardHeader className='bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-green-600 rounded-full flex items-center justify-center'>
                          <CreditCard className='h-5 w-5 text-white' />
                        </div>
                        <div>
                          <h2 className='text-xl font-bold text-gray-900'>
                            Payment Method
                          </h2>
                          <p className='text-sm text-gray-600'>
                            How would you like to pay?
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='p-6'>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={(value) => setPaymentMethod(value)}
                        className='space-y-4'
                      >
                        {AVAILABLE_PAYMENT_METHODS.map((method) => (
                          <div
                            key={method.name}
                            className='flex items-center space-x-3 p-4 border rounded-lg hover:border-green-500 transition-colors cursor-pointer'
                          >
                            <RadioGroupItem
                              value={method.name}
                              id={method.name}
                            />
                            <Label
                              htmlFor={method.name}
                              className='cursor-pointer flex-1 font-medium capitalize'
                            >
                              {method.name.replace(/_/g, ' ')}{' '}
                              {/* display method.name */}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>

                      <Button
                        onClick={() => {
                          if (!paymentMethod) {
                            toast.error('Please select a payment method')
                            return
                          }
                          setIsPaymentMethodSelected(true)
                        }}
                        className='w-full mt-6 bg-green-600 hover:bg-green-700 py-3 text-lg font-semibold rounded-lg shadow-lg'
                      >
                        Continue to Delivery Date
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Items and Delivery Date */}
            {isPaymentMethodSelected && isAddressSelected && (
              <div>
                {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
                  <Card className='rounded-xl shadow-sm border-0'>
                    <CardContent className='p-6'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start gap-4'>
                          <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                            <Package className='h-6 w-6 text-green-600' />
                          </div>
                          <div>
                            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                              Delivery & Items
                            </h3>
                            <div className='text-gray-600 space-y-2'>
                              <p className='font-semibold'>
                                Delivery:{' '}
                                {
                                  formatDateTime(
                                    calculateFutureDate(
                                      AVAILABLE_DELIVERY_DATES[
                                        deliveryDateIndex
                                      ].daysToDeliver
                                    )
                                  ).dateOnly
                                }
                              </p>
                              <div className='space-y-2'>
                                {items.map((item, index) => (
                                  <div
                                    key={index}
                                    className='flex items-center gap-3'
                                  >
                                    <div className='w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold'>
                                      {item.quantity}
                                    </div>
                                    <span>{item.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={'outline'}
                          onClick={() => {
                            setIsDeliveryDateSelected(false)
                          }}
                          className='text-green-600 border-green-200 hover:bg-green-50'
                        >
                          <Edit className='h-4 w-4 mr-2' />
                          Change
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className='rounded-xl shadow-sm border-0'>
                    <CardHeader className='bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-green-600 rounded-full flex items-center justify-center'>
                          <Package className='h-5 w-5 text-white' />
                        </div>
                        <div>
                          <h2 className='text-xl font-bold text-gray-900'>
                            Review Items & Shipping
                          </h2>
                          <p className='text-sm text-gray-600'>
                            Review your items and choose delivery speed
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='p-6'>
                      <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                        <p className='text-lg font-semibold text-green-700 mb-1'>
                          Arriving{' '}
                          {
                            formatDateTime(
                              calculateFutureDate(
                                AVAILABLE_DELIVERY_DATES[deliveryDateIndex ?? 0]
                                  .daysToDeliver
                              )
                            ).dateOnly
                          }
                        </p>
                        <p className='text-sm text-gray-600'>
                          Order in the next {timeUntilMidnight().hours}h{' '}
                          {timeUntilMidnight().minutes}m for delivery
                        </p>
                      </div>

                      <div className='grid lg:grid-cols-2 gap-8'>
                        {/* Items */}
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                            Items in Cart
                          </h3>
                          <div className='space-y-4'>
                            {items.map((item, index) => (
                              <div
                                key={index}
                                className='flex gap-4 p-4 border border-gray-200 rounded-lg'
                              >
                                <div className='relative w-20 h-20 bg-white rounded-lg border border-gray-200 p-2 flex-shrink-0'>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes='80px'
                                    className='object-contain'
                                  />
                                </div>
                                <div className='flex-1 min-w-0'>
                                  <h4 className='font-semibold text-gray-900 line-clamp-2'>
                                    {item.name}
                                  </h4>
                                  <p className='text-sm text-gray-600'>
                                    {item.color}, {item.size}
                                  </p>
                                  <div className='font-bold text-green-600 mt-1'>
                                    <ProductPrice price={item.price} />
                                  </div>

                                  <Select
                                    value={item.quantity.toString()}
                                    onValueChange={(value) => {
                                      if (value === '0') removeItem(item)
                                      else updateItem(item, Number(value))
                                    }}
                                  >
                                    <SelectTrigger className='w-24 mt-2'>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({
                                        length: item.countInStock,
                                      }).map((_, i) => (
                                        <SelectItem
                                          key={i + 1}
                                          value={`${i + 1}`}
                                        >
                                          Qty: {i + 1}
                                        </SelectItem>
                                      ))}
                                      <SelectItem
                                        key='delete'
                                        value='0'
                                        className='text-red-600'
                                      >
                                        Remove
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Options */}
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                            Shipping Speed
                          </h3>
                          <RadioGroup
                            value={
                              selectedDeliveryIndex !== undefined
                                ? AVAILABLE_DELIVERY_DATES[
                                    selectedDeliveryIndex
                                  ].name
                                : undefined
                            }
                            onValueChange={(value) => {
                              const index = AVAILABLE_DELIVERY_DATES.findIndex(
                                (dd) => dd.name === value
                              )
                              if (index !== -1) {
                                setSelectedDeliveryIndex(index)
                                setDeliveryDateIndex(index) // update store
                              }
                            }}
                            className='space-y-4'
                          >
                            {AVAILABLE_DELIVERY_DATES.map((dd) => (
                              <div
                                key={dd.name}
                                className='p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors'
                              >
                                <div className='flex items-start space-x-3'>
                                  <RadioGroupItem
                                    value={dd.name}
                                    id={`address-${dd.name}`}
                                    className='text-green-600 border-2 border-gray-300 mt-1'
                                  />
                                  <Label
                                    htmlFor={`address-${dd.name}`}
                                    className='flex-1 cursor-pointer'
                                  >
                                    <div className='font-semibold text-green-700 text-lg'>
                                      {
                                        formatDateTime(
                                          calculateFutureDate(dd.daysToDeliver)
                                        ).dateOnly
                                      }
                                    </div>
                                    <div className='text-gray-600 mt-1'>
                                      {(dd.freeShippingMinPrice > 0 &&
                                      itemsPrice >= dd.freeShippingMinPrice
                                        ? 0
                                        : dd.shippingPrice) === 0 ? (
                                        <span className='text-green-600 font-semibold'>
                                          FREE Shipping
                                        </span>
                                      ) : (
                                        <ProductPrice
                                          price={dd.shippingPrice}
                                        />
                                      )}
                                    </div>
                                  </Label>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                          <Button
                            onClick={() => setIsDeliveryDateSelected(true)}
                            className='w-full mt-6 bg-green-600 hover:bg-green-700 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300'
                          >
                            Continue to Order Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Mobile Order Button */}
            {isPaymentMethodSelected &&
              isAddressSelected &&
              isDeliveryDateSelected && (
                <div className='block lg:hidden'>
                  <Card className='rounded-xl shadow-lg border-0'>
                    <CardContent className='p-6'>
                      <Button
                        onClick={handlePlaceOrder}
                        className='w-full bg-green-600 hover:bg-green-700 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                      >
                        Place Your Order
                      </Button>
                      <div className='mt-4 text-center'>
                        <div className='font-bold text-lg text-gray-900'>
                          Order Total: <ProductPrice price={totalPrice} />
                        </div>

                        <p className='text-xs text-gray-600 mt-2'>
                          By placing your order, you agree to {APP_NAME}&apos;s
                          privacy notice and conditions of use.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

            <CheckoutFooter />
          </div>

          {/* Desktop Order Summary */}
          <div className='hidden lg:block'>
            <CheckoutSummary
              isAddressSelected={isAddressSelected}
              isPaymentMethodSelected={isPaymentMethodSelected}
              items={items}
              itemsPrice={itemsPrice}
              shippingPrice={shippingPrice}
              taxPrice={taxPrice}
              totalPrice={totalPrice}
              onSelectShippingAddress={handleSelectShippingAddress}
              onSelectPaymentMethod={handleSelectPaymentMethod}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default CheckoutForm
