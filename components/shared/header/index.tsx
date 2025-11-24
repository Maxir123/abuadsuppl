import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import Menu from './menu'
import { Button } from '@/components/ui/button'
import { MenuIcon, Truck, Shield, HeadphonesIcon } from 'lucide-react'
import data from '@/lib/data'
import Search from './search'

export default function Header() {
  return (
    <header className='bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50'>
      {/* Top Announcement Bar */}
      <div className='bg-red-800 text-white py-2 px-4'>
        <div className='container mx-auto text-center text-sm'>
          <div className='flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8'>
            <div className='flex items-center gap-2'>
              <Truck className='h-4 w-4' />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className='flex items-center gap-2'>
              <Shield className='h-4 w-4' />
              <span>30-day money-back guarantee</span>
            </div>
            <div className='flex items-center gap-2'>
              <HeadphonesIcon className='h-4 w-4' />
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between gap-6'>
          {/* Logo */}
          <Link
            href='/'
            className='flex items-center gap-3 group flex-shrink-0'
          >
            <div className='relative'>
              <Image
                src='/icons/logo.png'
                width={48}
                height={48}
                alt={`${APP_NAME} logo`}
                className='transition-transform group-hover:scale-105'
              />
            </div>
            <span className='text-2xl font-bold text-red-800 tracking-tight'>
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Search */}
          <div className='hidden lg:block flex-1 max-w-2xl'>
            <Search />
          </div>

          {/* User Menu */}
          <div className='flex items-center gap-2 flex-shrink-0'>
            <Menu />
          </div>
        </div>

        {/* Mobile Search */}
        <div className='lg:hidden block mt-4'>
          <Search />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className='bg-red-800 text-white shadow-md'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center'>
            {/* All Categories Dropdown */}
            <Button
              variant='ghost'
              className='flex items-center gap-2 text-white hover:bg-red-700 hover:text-white px-4 py-3 h-auto font-semibold rounded-none border-r border-red-700'
            >
              <MenuIcon className='h-5 w-5' />
              <span className='hidden sm:block'>All Categories</span>
            </Button>

            {/* Navigation Links */}
            <div className='flex items-center overflow-x-auto scrollbar-hide'>
              {data.headerMenus.map((menu, index) => (
                <Link
                  href={menu.href}
                  key={menu.href}
                  className='px-4 py-3 text-sm font-medium whitespace-nowrap hover:bg-red-700 transition-colors duration-200 border-r border-red-700 last:border-r-0 relative group'
                >
                  {menu.name}
                  <span className='absolute bottom-0 left-1/2 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-4/5 group-hover:left-1/10'></span>
                </Link>
              ))}
            </div>

            {/* Additional Info */}
            <div className='ml-auto hidden md:flex items-center gap-4 px-4 text-sm'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                <span className='text-red-100'>Live Support</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
