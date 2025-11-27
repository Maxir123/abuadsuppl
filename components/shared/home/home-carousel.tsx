'use client'

import * as React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  // Track active slide for the dots
  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <Carousel
      setApi={setApi}
      dir='ltr'
      plugins={[plugin.current]}
      className='w-full relative group'
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={item.title}>
            <Link href={item.url} className='block h-full'>
              <div className='relative flex items-end md:items-center justify-center overflow-hidden rounded-lg md:rounded-xl shadow-lg h-full'>
                {/* RESPONSIVE ASPECT RATIO:
                   aspect-[4/5] for mobile (tall), 
                   md:aspect-[16/6] for desktop (wide) 
                */}
                <div className='relative w-full aspect-[4/5] md:aspect-[16/6]'>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                    priority={index === 0}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
                  />

                  {/* RESPONSIVE GRADIENT:
                     Bottom-to-top on mobile (bg-gradient-to-t), 
                     Left-to-right on desktop (md:bg-gradient-to-r) 
                  */}
                  <div className='absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent md:bg-gradient-to-r md:from-gray-900/90 md:via-gray-900/40' />
                </div>

                {/* Content Container */}
                <div className='absolute inset-0 flex flex-col justify-end md:justify-center px-6 pb-12 pt-6 md:px-12 md:py-0'>
                  <div className='max-w-3xl space-y-3 md:space-y-6'>
                    {/* Title */}
                    <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-md'>
                      {item.title}
                    </h2>

                    {/* Description - Hidden on very small screens if needed, or clamped */}
                    {item.description && (
                      <p className='text-base sm:text-lg md:text-2xl text-gray-200 leading-relaxed max-w-xl line-clamp-3 md:line-clamp-none'>
                        {item.description}
                      </p>
                    )}

                    {/* Button */}
                    <div className='pt-2 md:pt-4'>
                      <Button
                        size='lg'
                        className='bg-green-600 hover:bg-green-700 text-white w-full md:w-auto px-6 py-6 md:px-8 md:py-4 text-base md:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
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

      {/* Navigation Buttons - Hidden on Mobile (md:flex) */}
      <CarouselPrevious className='hidden md:flex left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white border-0 shadow-lg h-12 w-12' />
      <CarouselNext className='hidden md:flex right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white border-0 shadow-lg h-12 w-12' />

      {/* Indicators/Dots */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10'>
        {items.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              'w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300',
              current === index
                ? 'bg-white w-6 md:w-8' // Active state (elongated)
                : 'bg-white/50 hover:bg-white/80'
            )}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </Carousel>
  )
}
