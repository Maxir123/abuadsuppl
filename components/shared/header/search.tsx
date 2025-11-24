'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const categories = [
  'All',
  'Textbooks',
  'Electronics',
  'Fashion',
  'Dorm',
  'Supplies',
  'Snacks',
]

export default function SearchComponent() {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <div className='flex w-full'>
      {/* Category Select - Compact for mobile */}
      <Select defaultValue='all'>
        <SelectTrigger className='h-8 rounded-r-none border-r-0 bg-gray-50 w-16 text-xs focus:ring-0 focus:ring-offset-0 rounded-l-lg border-gray-300'>
          <SelectValue className='text-xs truncate' />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem
              key={category}
              value={category.toLowerCase()}
              className='text-sm'
            >
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search Input */}
      <Input
        placeholder='Search textbooks, supplies...'
        className='h-8 rounded-none border-l-0 border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 placeholder:text-gray-500 border-gray-300 text-sm'
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
      />

      {/* Search Button */}
      <Button
        className='h-8 rounded-l-none bg-green-600 hover:bg-green-700 w-10 rounded-r-lg border-0'
        size='icon'
      >
        <Search className='h-3.5 w-3.5 text-white' />
      </Button>
    </div>
  )
}
