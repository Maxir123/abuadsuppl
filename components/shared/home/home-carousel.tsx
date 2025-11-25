'use client'

import * as React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HomeCarousel({
  items,
}: {
  items: {
    image: string
    url: string
    title: string
    buttonCaption: string
    description?: string
  }[]
}) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <Carousel
      dir='ltr'
      plugins={[plugin.current]}
      className='w-full relative group'
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        loop: true,
        align: 'start',
      }}
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={item.title}>
            <Link href={item.url}>
              <div className='flex aspect-[16/6] md:aspect-[16/5] items-center justify-center p-0 relative overflow-hidden rounded-lg md:rounded-xl shadow-lg'>
                {/* Background Image with Gradient Overlay */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className='object-cover transition-transform duration-700 group-hover:scale-105'
                  priority={index === 0}
                />

                {/* Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent' />

                {/* Content Container */}
                <div className='absolute w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <div className='flex flex-col justify-center h-full'>
                    <div className='max-w-2xl space-y-4 md:space-y-6'>
                      {/* Title */}
                      <h2 className='text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight'>
                        {item.title}
                      </h2>

                      {/* Description */}
                      {item.description && (
                        <p className='text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed max-w-lg'>
                          {item.description}
                        </p>
                      )}

                      {/* Button */}
                      <Button
                        size='lg'
                        className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                      >
                        {item.buttonCaption}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation Buttons */}
      <CarouselPrevious className='left-2 md:left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white border-0 shadow-lg h-10 w-10 md:h-12 md:w-12' />
      <CarouselNext className='right-2 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white border-0 shadow-lg h-10 w-10 md:h-12 md:w-12' />

      {/* Indicators/Dots */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10'>
        {items.map((_, index) => (
          <button
            key={index}
            className='w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/50 hover:bg-white transition-colors duration-200'
            onClick={() => {
              // You might want to add navigation logic here
            }}
          />
        ))}
      </div>
    </Carousel>
  )
}
