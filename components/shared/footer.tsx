'use client'

import {
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Heart,
  BookOpen,
  GraduationCap,
  Coffee,
  Laptop,
  Utensils,
  Shirt,
  Dumbbell,
} from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-gradient-to-br from-green-50 via-white to-emerald-50 border-t border-green-200 text-gray-800'>
      {/* Back to Top Button */}
      <div className='border-b border-green-200 bg-white/80'>
        <Button
          variant='ghost'
          className='w-full rounded-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-5 transition-all duration-300 group shadow-sm'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className='flex items-center justify-center gap-3'>
            <ChevronUp className='h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:scale-110' />
            <span className='font-bold text-white'>Back to Top</span>
          </div>
        </Button>
      </div>

      {/* Main Footer Content */}
      <div className='container mx-auto px-4 sm:px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
          {/* Store Info */}
          <div className='lg:col-span-2'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg'>
                <GraduationCap className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent'>
                  {APP_NAME}
                </h3>
                <p className='text-green-600 text-sm font-semibold'>
                  🎓 ABUAD Campus Store
                </p>
              </div>
            </div>
            <p className='text-gray-700 mb-6 max-w-md leading-relaxed'>
              Your trusted campus marketplace at Afe Babalola University. From
              textbooks and school supplies to dorm essentials and snacks -
              everything you need for campus life, delivered right to you.
            </p>
            <div className='flex flex-col gap-3 text-gray-700'>
              <div className='flex items-center gap-3 group hover:translate-x-1 transition-transform duration-200'>
                <div className='p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors'>
                  <MapPin className='h-4 w-4 text-green-600' />
                </div>
                <span className='font-medium'>
                  Afe Babalola University, Ado-Ekiti
                </span>
              </div>
              <div className='flex items-center gap-3 group hover:translate-x-1 transition-transform duration-200'>
                <div className='p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors'>
                  <Phone className='h-4 w-4 text-green-600' />
                </div>
                <span className='font-medium'>+234 (0) 123 456 7890</span>
              </div>
              <div className='flex items-center gap-3 group hover:translate-x-1 transition-transform duration-200'>
                <div className='p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors'>
                  <Mail className='h-4 w-4 text-green-600' />
                </div>
                <span className='font-medium'>
                  hello@{APP_NAME.toLowerCase()}.com
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='font-bold text-lg mb-6 text-green-700 border-b-2 border-green-200 pb-2'>
              Quick Links
            </h4>
            <div className='flex flex-col gap-3'>
              {[
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/campus-delivery', label: 'Campus Delivery' },
                { href: '/student-discounts', label: 'Student Discounts' },
                { href: '/textbook-exchange', label: 'Textbook Exchange' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='text-gray-700 hover:text-green-600 transition-all duration-200 w-fit group flex items-center gap-2'
                >
                  <div className='w-2 h-2 bg-green-400 rounded-full group-hover:scale-125 transition-transform'></div>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Student Resources */}
          <div>
            <h4 className='font-bold text-lg mb-6 text-emerald-700 border-b-2 border-emerald-200 pb-2'>
              Student Resources
            </h4>
            <div className='flex flex-col gap-3'>
              {[
                {
                  href: '/study-materials',
                  label: 'Study Materials',
                  icon: '📚',
                },
                {
                  href: '/dorm-essentials',
                  label: 'Dorm Essentials',
                  icon: '🛏️',
                },
                { href: '/campus-jobs', label: 'Campus Jobs', icon: '💼' },
                { href: '/student-clubs', label: 'Student Clubs', icon: '👥' },
                { href: '/campus-events', label: 'Campus Events', icon: '🎉' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='text-gray-700 hover:text-emerald-600 transition-all duration-200 w-fit group flex items-center gap-2'
                >
                  <span className='text-lg group-hover:scale-110 transition-transform'>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Campus Categories */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
          {[
            {
              icon: <BookOpen className='h-5 w-5 text-green-600' />,
              label: 'Books & Supplies',
              color: 'green',
              count: '250+',
              description: 'Textbooks & Study Materials',
            },
            {
              icon: <Laptop className='h-5 w-5 text-emerald-600' />,
              label: 'Tech & Gadgets',
              color: 'emerald',
              count: '150+',
              description: 'Laptops & Accessories',
            },
            {
              icon: <Shirt className='h-5 w-5 text-lime-600' />,
              label: 'Fashion',
              color: 'lime',
              count: '200+',
              description: 'Campus Wear & More',
            },
            {
              icon: <Coffee className='h-5 w-5 text-teal-600' />,
              label: 'Snacks & Food',
              color: 'teal',
              count: '100+',
              description: 'Quick Bites & Drinks',
            },
          ].map((category) => (
            <div
              key={category.label}
              className={`bg-${category.color}-50 border border-${category.color}-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow duration-300 hover:translate-y-[-2px]`}
            >
              <div
                className={`inline-flex p-3 bg-${category.color}-100 rounded-lg mb-2`}
              >
                {category.icon}
              </div>
              <h5
                className={`font-bold text-${category.color}-700 text-sm mb-1`}
              >
                {category.label}
              </h5>
              <p className='text-xs text-gray-600 mb-1'>
                {category.description}
              </p>
              <p className='text-xs font-semibold text-gray-700'>
                {category.count} items
              </p>
            </div>
          ))}
        </div>

        {/* Campus Info */}
        <div className='bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-8 shadow-lg text-white'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-white/20 rounded-xl'>
                <GraduationCap className='h-6 w-6 text-white' />
              </div>
              <div>
                <h5 className='font-bold text-lg'>ABUAD Store Hours</h5>
                <p className='text-green-100'>
                  Mon-Fri: 8AM-10PM • Weekends: 10AM-8PM
                </p>
                <p className='text-green-100 text-sm mt-1'>
                  📍 Located at Student Union Building
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full'>
              <div className='w-3 h-3 bg-lime-400 rounded-full animate-pulse'></div>
              <span className='font-semibold text-white'>Online 24/7</span>
            </div>
            <Button className='bg-white text-green-600 hover:bg-green-50 font-bold shadow-lg'>
              Visit Campus Store
            </Button>
          </div>
        </div>

        {/* Social & Contact */}
        <div className='bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-6 mb-8 text-white'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='text-center md:text-left'>
              <h5 className='font-bold text-lg mb-2'>Stay Connected! 🎓</h5>
              <p className='text-emerald-100'>
                Follow for campus deals, events & exclusive student discounts
              </p>
            </div>
            <div className='flex gap-3 flex-wrap justify-center'>
              {[
                { label: 'Instagram', bg: 'bg-pink-500 hover:bg-pink-600' },
                { label: 'WhatsApp', bg: 'bg-green-500 hover:bg-green-600' },
                { label: 'Twitter', bg: 'bg-blue-400 hover:bg-blue-500' },
              ].map((social) => (
                <button
                  key={social.label}
                  className={`${social.bg} text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 shadow-md whitespace-nowrap`}
                >
                  {social.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-green-200 pt-8'>
          <div className='flex flex-col lg:flex-row justify-between items-center gap-6'>
            <div className='text-gray-600 text-sm text-center lg:text-left'>
              <p className='flex items-center gap-2 flex-wrap justify-center lg:justify-start'>
                <span>
                  © 2000-{currentYear}, {APP_NAME}. For ABUAD Students, By ABUAD
                  Students. 🎓
                </span>
                <span className='hidden md:inline'>•</span>
                <span className='flex items-center gap-1 text-gray-700'>
                  Built with{' '}
                  <Heart className='h-4 w-4 text-red-500 fill-red-500 animate-pulse' />{' '}
                  for campus life
                </span>
              </p>
            </div>
            <div className='flex gap-6 text-sm'>
              {[
                {
                  href: '/privacy',
                  label: 'Privacy',
                  color: 'text-green-600 hover:text-green-700',
                },
                {
                  href: '/terms',
                  label: 'Terms',
                  color: 'text-emerald-600 hover:text-emerald-700',
                },
                {
                  href: '/accessibility',
                  label: 'Accessibility',
                  color: 'text-lime-600 hover:text-lime-700',
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${link.color} transition-colors duration-200 font-medium`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
