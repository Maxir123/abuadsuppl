'use client'

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import useIsMounted from '@/hooks/use-is-mounted'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'

export default function CartButton() {
  const isMounted = useIsMounted()
  const {
    cart: { items },
  } = useCartStore()
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)

  return (
    <Link
      href='/cart'
      className='header-button p-1.5 rounded-md hover:bg-gray-100 transition-colors group relative'
    >
      <div className='flex items-center gap-1'>
        <div className='relative'>
          <ShoppingCartIcon className='h-5 w-5' />

          {isMounted && cartItemsCount > 0 && (
            <span
              className={cn(
                `bg-green-600 text-white rounded-full text-xs font-bold absolute -top-2 -right-2 min-w-[16px] h-4 flex items-center justify-center px-0.5`,
                cartItemsCount >= 10 && 'text-[10px] min-w-[18px]'
              )}
            >
              {cartItemsCount > 99 ? '99+' : cartItemsCount}
            </span>
          )}
        </div>

        {/* Text that appears on hover */}
        <span className='font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap'>
          Cart
        </span>
      </div>
    </Link>
  )
}
