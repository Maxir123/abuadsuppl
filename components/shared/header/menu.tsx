'use client'

import { Button } from '@/components/ui/button'
import { User, Heart, BookMarked } from 'lucide-react'
import CartButton from './cart-button'

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

      <CartButton />
    </div>
  )
}
