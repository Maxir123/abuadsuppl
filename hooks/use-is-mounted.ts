import { useEffect, useState } from 'react'

export default function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    Promise.resolve().then(() => setIsMounted(true))
  }, [])

  return isMounted
}
