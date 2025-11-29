// components/shared/header/user-button.tsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function UserButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className='w-32 h-10 animate-pulse bg-gray-200 rounded' />
  }

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center cursor-pointer'>
            <div className='flex flex-col text-xs text-left'>
              <span>Hello, {session ? session.user?.name : 'sign in'}</span>
              <span className='font-bold'>Account & Orders</span>
            </div>
            <ChevronDown className='ml-1' />
          </div>
        </DropdownMenuTrigger>

        {session ? (
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  {session.user?.name}
                </p>
                <p className='text-xs leading-none text-muted-foreground'>
                  {session.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <Link href='/account' className='w-full'>
                <DropdownMenuItem>Your account</DropdownMenuItem>
              </Link>
              <Link href='/account/orders' className='w-full'>
                <DropdownMenuItem>Your orders</DropdownMenuItem>
              </Link>
              {session.user?.role === 'Admin' && (
                <Link href='/admin/overview' className='w-full'>
                  <DropdownMenuItem>Admin</DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>
            <DropdownMenuItem className='p-0 mb-1'>
              <form
                action={() => signOut({ callbackUrl: '/' })}
                className='w-full'
              >
                <Button
                  className='w-full py-4 px-2 h-auto justify-start'
                  variant='ghost'
                >
                  Sign out
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  href='/sign-in'
                  className={cn(buttonVariants(), 'w-full')}
                >
                  Sign in
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuLabel className='font-normal text-center'>
              New Customer?{' '}
              <Link href='/sign-up' className='underline'>
                Sign up
              </Link>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
