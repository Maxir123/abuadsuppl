'use client'

import { ChevronUp, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-gradient-to-b from-red-800 to-red-900 text-white'>
      {/* Back to Top Button */}
      <div className='w-full border-b border-red-700'>
        <Button
          variant='ghost'
          className='w-full rounded-none bg-red-700 hover:bg-red-600 text-white py-6 transition-all duration-300 group hover:shadow-lg'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className='mr-3 h-5 w-5 transition-transform group-hover:-translate-y-1' />
          <span className='font-semibold'>Back to top</span>
        </Button>
      </div>

      {/* Main Footer Content */}
      <div className='container mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          {/* Company Info */}
          <div className='md:col-span-2'>
            <h3 className='text-2xl font-bold mb-4 text-white'>{APP_NAME}</h3>
            <p className='text-red-100 mb-6 max-w-md leading-relaxed'>
              Your trusted partner for quality products and exceptional service.
              We&apos;re committed to bringing you the best shopping experience.
            </p>
            <div className='flex flex-col gap-3 text-red-100'>
              <div className='flex items-center gap-3'>
                <MapPin className='h-4 w-4 text-red-200' />
                <span>123, Main Street, Anytown, CA, Zip 12345</span>
              </div>
              <div className='flex items-center gap-3'>
                <Phone className='h-4 w-4 text-red-200' />
                <span>+1 (123) 456-7890</span>
              </div>
              <div className='flex items-center gap-3'>
                <Mail className='h-4 w-4 text-red-200' />
                <span>contact@{APP_NAME.toLowerCase()}.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='font-semibold text-lg mb-4 text-white'>
              Quick Links
            </h4>
            <div className='flex flex-col gap-3'>
              <Link
                href='/about'
                className='text-red-100 hover:text-white transition-colors duration-200 w-fit'
              >
                About Us
              </Link>
              <Link
                href='/contact'
                className='text-red-100 hover:text-white transition-colors duration-200 w-fit'
              >
                Contact
              </Link>
              <Link
                href='/shipping'
                className='text-red-100 hover:text-white transition-colors duration-200 w-fit'
              >
                Shipping Info
              </Link>
              <Link
                href='/returns'
                className='text-red-100 hover:text-white transition-colors duration-200 w-fit'
              >
                Returns
              </Link>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h4 className='font-semibold text-lg mb-4 text-white'>Policies</h4>
            <div className='flex flex-col gap-3'>
              <Link
                href='/page/conditions-of-use'
                className='text-red-100 hover:text-white transition-colors duration-200 w-fit'
              >
                Conditions of Use
              </Link>
              <Link
                href='/page/privacy-policy'
                className='text-red-100 hover:text-white transition-colors duration-200 w-fit'
              >
                Privacy Notice
              </Link>
              <Link
                href='/page/help'
                className='text-red-100 hover:text-white transition-colors duration-200 w-fit'
              >
                Help & Support
              </Link>
              <Link
                href='/terms'
                className='text-red-100 hover:text-white transition-colors duration-200 w-fit'
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-red-700 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='text-red-100 text-sm text-center md:text-left'>
              <p>
                © 2000-{currentYear}, {APP_NAME}, Inc. or its affiliates. All
                rights reserved.
              </p>
            </div>
            <div className='flex gap-6 text-sm'>
              <Link
                href='/sitemap'
                className='text-red-100 hover:text-white transition-colors duration-200'
              >
                Sitemap
              </Link>
              <Link
                href='/accessibility'
                className='text-red-100 hover:text-white transition-colors duration-200'
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
