import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { APP_NAME } from '@/lib/constants'

const categories = ['men', 'women', 'kids', 'accessories']

export default async function Search() {
  return (
    <form action='/search' method='GET' className='flex items-stretch h-10'>
      <Select name='category'>
        <SelectTrigger className='w-auto h-full border-r-0 rounded-r-none rounded-l-md bg-white border-gray-300 focus:border-red-800'>
          <SelectValue placeholder='All' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectItem value='all'>All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className='flex-1 rounded-none bg-white border-gray-300 focus:border-red-800 text-base h-full border-r-0'
        placeholder={`Search ${APP_NAME}`}
        name='q'
        type='search'
      />
      <button
        type='submit'
        className='bg-red-800 hover:bg-red-900 text-white rounded-s-none rounded-e-md h-full px-3 py-2 transition-colors duration-200 flex items-center justify-center'
      >
        <SearchIcon className='w-5 h-5' />
      </button>
    </form>
  )
}
