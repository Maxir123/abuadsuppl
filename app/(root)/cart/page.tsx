'use client'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCartStore from '@/hooks/use-cart-store'
import { APP_NAME, FREE_SHIPPING_MIN_PRICE } from '@/lib/constants'
import { Trash2, ShoppingBag, Truck, Shield, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function CartPage() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore()
  const router = useRouter()

  const subtotalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const needsForFreeShipping = FREE_SHIPPING_MIN_PRICE - itemsPrice
  const freeShippingProgress = Math.min(
    (itemsPrice / FREE_SHIPPING_MIN_PRICE) * 100,
    100
  )

  return (
    <div className='min-h-screen bg-gray-50 py-6'>
      <div className='container mx-auto px-4 max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Shopping Cart</h1>
          <div className='flex items-center gap-2 text-sm text-gray-600 mt-2'>
            <Link href='/' className='text-green-600 hover:text-green-700'>
              Home
            </Link>
            <span>•</span>
            <span>Shopping Cart ({subtotalItems} items)</span>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {items.length === 0 ? (
            <Card className='col-span-4 rounded-xl shadow-sm border-0'>
              <CardContent className='p-12 text-center'>
                <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <ShoppingBag className='h-12 w-12 text-gray-400' />
                </div>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                  Your cart is empty
                </h2>
                <p className='text-gray-600 mb-8 max-w-md mx-auto'>
                  Looks like you haven&apos;t added anything to your cart yet.
                  Start shopping to discover amazing products!
                </p>
                <Button
                  onClick={() => router.push('/')}
                  className='bg-green-600 hover:bg-green-700 px-8 py-3 text-lg rounded-lg'
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Cart Items */}
              <div className='lg:col-span-3 space-y-4'>
                <Card className='rounded-xl shadow-sm border-0 overflow-hidden'>
                  <CardHeader className='bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100'>
                    <div className='flex justify-between items-center'>
                      <h2 className='text-xl font-bold text-gray-900'>
                        Your Items ({subtotalItems})
                      </h2>
                      <span className='text-lg font-semibold text-green-600'>
                        <ProductPrice price={itemsPrice} />
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className='p-0'>
                    {items.map((item) => (
                      <div
                        key={item.clientId}
                        className='flex flex-col sm:flex-row gap-4 p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors'
                      >
                        {/* Product Image */}
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex-shrink-0 self-center sm:self-auto'
                        >
                          <div className='relative w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-lg border border-gray-200 p-2'>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes='(max-width: 128px) 100vw, 128px'
                              className='object-contain transition-transform hover:scale-105'
                            />
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className='flex-1 min-w-0'>
                          <Link
                            href={`/product/${item.slug}`}
                            className='block group'
                          >
                            <h3 className='font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2'>
                              {item.name}
                            </h3>
                          </Link>

                          {/* Variants */}
                          <div className='space-y-1 mb-4'>
                            {item.color && (
                              <p className='text-sm text-gray-600'>
                                <span className='font-medium'>Color:</span>{' '}
                                {item.color}
                              </p>
                            )}
                            {item.size && (
                              <p className='text-sm text-gray-600'>
                                <span className='font-medium'>Size:</span>{' '}
                                {item.size}
                              </p>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className='flex flex-wrap items-center gap-3'>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm font-medium text-gray-700'>
                                Qty:
                              </span>
                              <Select
                                value={item.quantity.toString()}
                                onValueChange={(value) =>
                                  updateItem(item, Number(value))
                                }
                              >
                                <SelectTrigger className='w-20 h-9'>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({
                                    length: item.countInStock,
                                  }).map((_, i) => (
                                    <SelectItem key={i + 1} value={`${i + 1}`}>
                                      {i + 1}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => removeItem(item)}
                              className='text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700'
                            >
                              <Trash2 className='h-4 w-4 mr-1' />
                              Remove
                            </Button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className='flex flex-col items-end justify-between min-w-[100px]'>
                          <div className='text-right'>
                            <div className='text-lg font-bold text-gray-900'>
                              <ProductPrice
                                price={item.price * item.quantity}
                              />
                            </div>
                            {item.quantity > 1 && (
                              <div className='text-sm text-gray-500 mt-1'>
                                <ProductPrice price={item.price} /> each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                  <div className='bg-white rounded-lg p-4 text-center border border-gray-200'>
                    <Truck className='h-8 w-8 text-green-600 mx-auto mb-2' />
                    <p className='text-sm font-medium text-gray-900'>
                      Free Campus Delivery
                    </p>
                  </div>
                  <div className='bg-white rounded-lg p-4 text-center border border-gray-200'>
                    <Shield className='h-8 w-8 text-green-600 mx-auto mb-2' />
                    <p className='text-sm font-medium text-gray-900'>
                      Secure Checkout
                    </p>
                  </div>
                  <div className='bg-white rounded-lg p-4 text-center border border-gray-200 md:col-span-1 col-span-2'>
                    <div className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2'>
                      <span className='text-white text-sm font-bold'>✓</span>
                    </div>
                    <p className='text-sm font-medium text-gray-900'>
                      ABUAD Verified
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className='lg:col-span-1'>
                <Card className='rounded-xl shadow-sm border-0 sticky top-6'>
                  <CardContent className='p-6'>
                    {/* Free Shipping Progress */}
                    <div className='mb-6'>
                      <div className='flex justify-between text-sm mb-2'>
                        <span className='text-gray-600'>
                          {itemsPrice >= FREE_SHIPPING_MIN_PRICE ? (
                            <span className='text-green-600 font-semibold'>
                              🎉 You qualify for free shipping!
                            </span>
                          ) : (
                            <>
                              Add <ProductPrice price={needsForFreeShipping} />{' '}
                              for{' '}
                              <span className='text-green-600'>
                                FREE shipping
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-green-600 h-2 rounded-full transition-all duration-500'
                          style={{ width: `${freeShippingProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className='space-y-4'>
                      <div className='flex justify-between text-lg'>
                        <span className='text-gray-600'>
                          Subtotal ({subtotalItems} items)
                        </span>
                        <span className='font-bold text-gray-900'>
                          <ProductPrice price={itemsPrice} />
                        </span>
                      </div>

                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-600'>Shipping</span>
                        <span
                          className={
                            itemsPrice >= FREE_SHIPPING_MIN_PRICE
                              ? 'text-green-600 font-semibold'
                              : 'text-gray-600'
                          }
                        >
                          {itemsPrice >= FREE_SHIPPING_MIN_PRICE
                            ? 'FREE'
                            : 'Calculated at checkout'}
                        </span>
                      </div>

                      <div className='border-t border-gray-200 pt-4'>
                        <div className='flex justify-between text-xl font-bold'>
                          <span>Total</span>
                          <span className='text-green-600'>
                            <ProductPrice price={itemsPrice} />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Button
                      onClick={() => router.push('/checkout')}
                      className='w-full mt-6 bg-green-600 hover:bg-green-700 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                    >
                      Proceed to Checkout
                      <ArrowRight className='ml-2 h-5 w-5' />
                    </Button>

                    {/* Continue Shopping */}
                    <Button
                      variant='outline'
                      onClick={() => router.push('/')}
                      className='w-full mt-3 border-gray-300 text-gray-700 hover:bg-gray-50'
                    >
                      Continue Shopping
                    </Button>

                    {/* Security Note */}
                    <p className='text-xs text-gray-500 text-center mt-4'>
                      🔒 Secure checkout · ABUAD Verified
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Browsing History */}
        {items.length > 0 && (
          <div className='mt-12'>
            <BrowsingHistoryList />
          </div>
        )}
      </div>
    </div>
  )
}
