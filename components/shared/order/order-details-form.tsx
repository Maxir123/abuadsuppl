'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IOrder } from '@/lib/db/models/order.model'
import { cn, formatDateTime } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import ProductPrice from '../product/product-price'
import {
  MapPin,
  Package,
  CreditCard,
  Receipt,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface OrderDetailsFormProps {
  order: IOrder
  isAdmin: boolean
}

export default function OrderDetailsForm({
  order,
  isAdmin,
}: OrderDetailsFormProps) {
  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    expectedDeliveryDate,
  } = order

  const statusIcon = isDelivered ? (
    <CheckCircle className='h-5 w-5 text-green-500' />
  ) : (
    <Truck className='h-5 w-5 text-amber-500' />
  )

  const paymentIcon = isPaid ? (
    <CheckCircle className='h-5 w-5 text-green-500' />
  ) : (
    <XCircle className='h-5 w-5 text-red-500' />
  )

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Order Details</h1>
        <p className='text-muted-foreground mt-2'>
          Order ID: {order._id.toString()} •{' '}
          {formatDateTime(order.createdAt).dateTime}
        </p>
      </div>

      <div className='grid lg:grid-cols-3 gap-6'>
        {/* Left Column - Order Information */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Shipping Address Card */}
          <Card className='border shadow-sm'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-blue-50 rounded-lg'>
                  <MapPin className='h-5 w-5 text-blue-600' />
                </div>
                <CardTitle className='text-lg'>Shipping Address</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div>
                  <p className='font-semibold text-lg'>
                    {shippingAddress.fullName}
                  </p>
                  {shippingAddress.phone && (
                    <p className='text-muted-foreground'>
                      {shippingAddress.phone}
                    </p>
                  )}
                </div>

                <div className='space-y-1'>
                  <p className='font-medium'>{shippingAddress.street}</p>
                  <p className='text-muted-foreground'>
                    {shippingAddress.city}, {shippingAddress.province}
                  </p>
                  <p className='text-muted-foreground'>
                    {shippingAddress.postalCode}, {shippingAddress.country}
                  </p>
                </div>

                <div className='flex items-center justify-between pt-4 border-t'>
                  <div className='flex items-center gap-2'>
                    {statusIcon}
                    <span
                      className={cn(
                        'font-medium',
                        isDelivered ? 'text-green-700' : 'text-amber-700'
                      )}
                    >
                      {isDelivered ? 'Delivered' : 'In Transit'}
                    </span>
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {isDelivered ? (
                      <span>
                        Delivered on {formatDateTime(deliveredAt!).dateOnly}
                      </span>
                    ) : (
                      <span>
                        Expected{' '}
                        {formatDateTime(expectedDeliveryDate!).dateOnly}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card className='border shadow-sm'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-purple-50 rounded-lg'>
                  <CreditCard className='h-5 w-5 text-purple-600' />
                </div>
                <CardTitle className='text-lg'>Payment Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-semibold text-lg'>{paymentMethod}</p>
                    <p className='text-sm text-muted-foreground'>
                      Payment Method
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    {paymentIcon}
                    <Badge variant={isPaid ? 'default' : 'destructive'}>
                      {isPaid ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                </div>

                {isPaid && (
                  <div className='p-3 bg-green-50 rounded-lg border border-green-100'>
                    <p className='text-sm text-green-800'>
                      Paid on {formatDateTime(paidAt!).dateTime}
                    </p>
                    {order.paymentResult?.id && (
                      <p className='text-xs text-green-600 mt-1'>
                        Transaction ID: {order.paymentResult.id}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items Card */}
          <Card className='border shadow-sm'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-amber-50 rounded-lg'>
                  <Package className='h-5 w-5 text-amber-600' />
                </div>
                <CardTitle className='text-lg'>Order Items</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[400px]'>Product</TableHead>
                    <TableHead className='text-center'>Quantity</TableHead>
                    <TableHead className='text-right'>Price</TableHead>
                    <TableHead className='text-right'>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.slug} className='hover:bg-muted/50'>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center gap-3 hover:no-underline group'
                        >
                          <div className='relative h-16 w-16 rounded-lg overflow-hidden border bg-white'>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className='object-cover'
                              sizes='64px'
                            />
                          </div>
                          <div className='flex-1'>
                            <p className='font-medium group-hover:text-primary transition-colors'>
                              {item.name}
                            </p>
                            <p className='text-sm text-muted-foreground line-clamp-1'>
                              {item.slug}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className='text-center font-medium'>
                        {item.quantity}
                      </TableCell>
                      <TableCell className='text-right font-medium'>
                        <ProductPrice price={item.price} plain />
                      </TableCell>
                      <TableCell className='text-right font-bold'>
                        <ProductPrice price={item.price * item.quantity} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className='lg:col-span-1'>
          <Card className='border shadow-sm sticky top-6'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-emerald-50 rounded-lg'>
                  <Receipt className='h-5 w-5 text-emerald-600' />
                </div>
                <CardTitle className='text-lg'>Order Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Price Breakdown */}
              <div className='space-y-3'>
                <div className='flex justify-between items-center py-2'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <ProductPrice price={itemsPrice} className='font-medium' />
                </div>

                <div className='flex justify-between items-center py-2 border-t'>
                  <span className='text-muted-foreground'>Shipping</span>
                  <div className='text-right'>
                    {shippingPrice === undefined ? (
                      <span className='text-muted-foreground'>--</span>
                    ) : shippingPrice === 0 ? (
                      <Badge variant='outline' className='text-green-600'>
                        FREE
                      </Badge>
                    ) : (
                      <ProductPrice
                        price={shippingPrice}
                        className='font-medium'
                      />
                    )}
                  </div>
                </div>

                <div className='flex justify-between items-center py-2 border-t'>
                  <span className='text-muted-foreground'>Tax</span>
                  <div className='text-right'>
                    {taxPrice === undefined ? (
                      <span className='text-muted-foreground'>--</span>
                    ) : (
                      <ProductPrice price={taxPrice} className='font-medium' />
                    )}
                  </div>
                </div>

                <div className='flex justify-between items-center py-4 border-t'>
                  <span className='text-lg font-bold'>Total Amount</span>
                  <ProductPrice
                    price={totalPrice}
                    className='text-xl font-bold'
                  />
                </div>
              </div>

              {/* Order Status Overview */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                  <span className='text-sm font-medium'>Order Status</span>
                  <Badge variant={isDelivered ? 'default' : 'secondary'}>
                    {isDelivered ? 'Completed' : 'Processing'}
                  </Badge>
                </div>

                <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                  <span className='text-sm font-medium'>Payment Status</span>
                  <Badge variant={isPaid ? 'default' : 'destructive'}>
                    {isPaid ? 'Paid' : 'Pending'}
                  </Badge>
                </div>

                <div className='flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100'>
                  <Calendar className='h-4 w-4 text-blue-600' />
                  <div className='text-sm'>
                    <p className='font-medium text-blue-800'>Delivery Date</p>
                    <p className='text-blue-600'>
                      {formatDateTime(expectedDeliveryDate!).dateOnly}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {!isPaid && ['Stripe', 'PayPal'].includes(paymentMethod) && (
                <Link
                  className={cn(
                    buttonVariants(),
                    'w-full bg-primary hover:bg-primary/90 h-11 rounded-lg font-semibold'
                  )}
                  href={`/checkout/${order._id}`}
                >
                  Complete Payment
                </Link>
              )}

              {/* Admin Actions (Optional) */}
              {isAdmin && (
                <div className='pt-4 border-t'>
                  <p className='text-sm font-medium mb-2'>Admin Actions</p>
                  <div className='flex gap-2'>
                    <Link
                      href={`/admin/orders/${order._id}/edit`}
                      className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'flex-1 text-sm'
                      )}
                    >
                      Edit Order
                    </Link>
                    <Link
                      href={`/admin/orders/${order._id}/tracking`}
                      className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'flex-1 text-sm'
                      )}
                    >
                      Update Tracking
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
