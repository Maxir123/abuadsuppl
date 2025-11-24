'use client'

import { useState } from 'react'
import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Menu,
  MapPin,
  Bell,
  BookOpen,
  GraduationCap,
  Utensils,
  Search,
  ShoppingCart,
  Heart,
  User,
} from 'lucide-react'
import SearchBar from './search'
import UserMenu from './menu'

const categories = [
  'All',
  'Textbooks',
  'Electronics',
  'Fashion',
  'Dorm Essentials',
  'School Supplies',
  'Snacks',
]

export default function Header() {
  return (
    <>
      {/* Top Announcement Bar - Optimized for 350px+ */}
      <div className='bg-gradient-to-r from-green-700 to-emerald-700 text-white py-1.5'>
        <div className='container mx-auto px-2 sm:px-4'>
          <div className='flex flex-nowrap justify-center items-center gap-2 text-xs whitespace-nowrap overflow-x-auto scrollbar-hide'>
            <div className='flex items-center gap-1 flex-shrink-0'>
              <div className='w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse flex-shrink-0'></div>
              <span className='text-xs'>🚚 Free delivery</span>
            </div>
            <div className='text-white/60 flex-shrink-0 hidden xs:block'>•</div>
            <div className='flex items-center gap-1 flex-shrink-0 hidden xs:flex'>
              <div className='w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse flex-shrink-0'></div>
              <span className='text-xs'>🎓 Student deals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'>
        <div className='container mx-auto'>
          {/* Top Row - Optimized for 350px */}
          <div className='flex items-center justify-between px-2 sm:px-4 py-2 gap-2'>
            {/* Left Section: Menu & Logo */}
            <div className='flex items-center gap-2 flex-shrink-0 min-w-0'>
              {/* Mobile Menu */}
              <div className='lg:hidden flex items-center'>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-gray-700 hover:bg-gray-100 hover:text-green-600 flex-shrink-0'
                    >
                      <Menu className='h-4 w-4' />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side='left' className='w-[280px] bg-white p-0'>
                    <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
                    <MobileSidebar />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Logo - Optimized for small screens */}
              <Link
                href='/'
                className='flex items-center gap-2 group flex-shrink-0 min-w-0'
              >
                <div className='relative'>
                  <Image
                    src='/icons/logo1.png'
                    width={32}
                    height={32}
                    alt={APP_NAME}
                    className='transition-transform group-hover:scale-105 flex-shrink-0'
                  />
                </div>
                <div className='flex flex-col flex-shrink-0 min-w-0'>
                  <span className='text-sm font-bold text-gray-900 tracking-tight whitespace-nowrap truncate max-w-[100px] xs:max-w-none'>
                    {APP_NAME}
                  </span>
                  <span className='text-[10px] text-green-600 font-medium whitespace-nowrap hidden xs:block'>
                    ABUAD Campus
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Location */}
            <div className='hidden lg:flex items-center min-w-0 flex-shrink-0'>
              <Button
                variant='ghost'
                className='h-8 text-gray-700 hover:bg-gray-100 hover:text-green-600 px-2 flex-shrink-0 border-r border-gray-200 rounded-none'
              >
                <MapPin className='h-3.5 w-3.5 mr-1 text-green-600 flex-shrink-0' />
                <div className='text-left hidden xl:block'>
                  <div className='text-[10px] text-gray-500 whitespace-nowrap'>
                    Deliver to
                  </div>
                  <div className='text-xs font-semibold whitespace-nowrap'>
                    ABUAD Campus
                  </div>
                </div>
              </Button>
            </div>

            {/* Search Bar - Center - Hidden on very small mobile */}
            <div className='flex-1 min-w-0 max-w-2xl mx-2 hidden xs:flex'>
              <div className='hidden sm:block w-full'>
                <SearchBar />
              </div>
            </div>

            {/* Right Section: User Menu */}
            <div className='flex items-center gap-0.5 flex-shrink-0'>
              <UserMenu />
            </div>
          </div>

          {/* Mobile Search - Always visible on very small screens */}
          <div className='xs:hidden px-2 pb-2 border-t border-gray-100 pt-1'>
            <SearchBar />
          </div>

          {/* Mobile Search for small screens (xs breakpoint) */}
          <div className='hidden xs:flex sm:hidden px-2 pb-2 border-t border-gray-100 pt-1'>
            <SearchBar />
          </div>

          {/* Categories Navigation */}
          <div className='border-t border-gray-100 bg-gray-50 hidden lg:block'>
            <div className='flex items-center h-9 px-4 flex-nowrap overflow-x-auto scrollbar-hide gap-1'>
              {/* All Categories */}
              <Button
                variant='ghost'
                className='h-7 text-gray-700 hover:bg-gray-200 hover:text-green-600 px-2 flex-shrink-0 whitespace-nowrap rounded-none border-r border-gray-200'
              >
                <Menu className='h-3.5 w-3.5 mr-1 flex-shrink-0' />
                <span className='text-xs font-medium'>All</span>
              </Button>

              {/* Categories */}
              {categories.map((item) => (
                <Button
                  key={item}
                  variant='ghost'
                  className='h-7 text-gray-600 hover:bg-gray-200 hover:text-green-600 px-2 flex-shrink-0 whitespace-nowrap rounded-none text-xs font-normal'
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

// Updated Mobile Sidebar for small screens
function MobileSidebar() {
  const studentCategories = [
    { name: 'Textbooks & Notes', icon: BookOpen, color: 'text-blue-600' },
    { name: 'School Supplies', icon: GraduationCap, color: 'text-green-600' },
    { name: 'Dorm & Room', icon: '🛏️', emoji: true },
    { name: 'Electronics', icon: '💻', emoji: true },
    { name: 'Fashion', icon: '👕', emoji: true },
    { name: 'Food & Snacks', icon: Utensils, color: 'text-orange-600' },
    { name: 'Sports & Fitness', icon: '⚽', emoji: true },
  ]

  return (
    <div className='h-full flex flex-col bg-white'>
      {/* Header */}
      <div className='bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4'>
        <div className='flex items-center gap-2'>
          <div className='p-1.5 bg-white/20 rounded-lg'>
            <GraduationCap className='h-5 w-5' />
          </div>
          <div>
            <div className='font-bold text-base'>ABUAD Store</div>
            <div className='text-xs text-white/80'>Your campus marketplace</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className='p-3 border-b border-gray-100'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm'>
            S
          </div>
          <div>
            <div className='font-semibold text-gray-900 text-sm'>
              Hello, Student
            </div>
            <div className='text-xs text-gray-500'>Sign in to your account</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='p-3 border-b border-gray-100'>
        <div className='grid grid-cols-2 gap-2'>
          <Button
            variant='outline'
            className='h-10 flex-col gap-0.5 text-[10px] p-1'
          >
            <span className='text-sm'>📚</span>
            <span className='leading-tight'>Book Swap</span>
          </Button>
          <Button
            variant='outline'
            className='h-10 flex-col gap-0.5 text-[10px] p-1'
          >
            <span className='text-sm'>🚚</span>
            <span className='leading-tight'>Delivery</span>
          </Button>
          <Button
            variant='outline'
            className='h-10 flex-col gap-0.5 text-[10px] p-1'
          >
            <span className='text-sm'>💼</span>
            <span className='leading-tight'>Campus Jobs</span>
          </Button>
          <Button
            variant='outline'
            className='h-10 flex-col gap-0.5 text-[10px] p-1'
          >
            <span className='text-sm'>🎓</span>
            <span className='leading-tight'>Student Deals</span>
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-3'>
          <div className='font-bold text-gray-900 text-base mb-3'>
            Shop Categories
          </div>
          <div className='space-y-1'>
            {studentCategories.map((category) => (
              <Button
                key={category.name}
                variant='ghost'
                className='w-full justify-start h-10 px-2 rounded-lg hover:bg-green-50 hover:text-green-600 text-sm'
              >
                {category.emoji ? (
                  <span className='text-base mr-2'>{category.icon}</span>
                ) : (
                  <category.icon
                    className={`h-3.5 w-3.5 mr-2 ${category.color}`}
                  />
                )}
                <span className='font-medium'>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
