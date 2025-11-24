'use client'

import { Button } from '@/components/ui/button'
import { User, ShoppingCart, Heart, BookMarked } from 'lucide-react'

export default function UserMenu() {
  return (
    <div className='flex items-center gap-0.5 flex-shrink-0'>
      {/* Account - Desktop */}
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 text-gray-700 hover:text-green-600 hover:bg-gray-100 hidden md:flex'
      >
        <User className='h-4 w-4' />
      </Button>

      {/* Orders - Desktop */}
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 text-gray-700 hover:text-green-600 hover:bg-gray-100 hidden lg:flex'
      >
        <BookMarked className='h-4 w-4' />
      </Button>

      {/* Wishlist */}
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 text-gray-700 hover:text-green-600 hover:bg-gray-100 relative'
      >
        <Heart className='h-4 w-4' />
        <span className='absolute -top-0.5 -right-0.5 bg-pink-500 text-white text-[10px] rounded-full h-3 w-3 flex items-center justify-center font-bold'>
          2
        </span>
      </Button>

      {/* Cart */}
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 text-gray-700 hover:text-green-600 hover:bg-gray-100 relative'
      >
        <ShoppingCart className='h-4 w-4' />
        <span className='absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[10px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold'>
          3
        </span>
      </Button>
    </div>
  )
}
