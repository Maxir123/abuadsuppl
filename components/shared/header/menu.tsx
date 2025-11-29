'use client'

import CartButton from './cart-button'
import UserButton from './user-button'

export default function UserMenu() {
  return (
    <div className='flex items-center gap-0.5 flex-shrink-0'>
      <UserButton />
      <CartButton />
    </div>
  )
}
