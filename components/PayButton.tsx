'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button' // or plain button
import { toast } from 'sonner'

export default function PayButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false)

  const startPayment = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/paystack/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      setLoading(false)

      if (data?.authorization_url) {
        // Redirect to paystack checkout page
        window.location.href = data.authorization_url
      } else {
        toast.error('Payment initialization failed')
        console.error('Paystack init error:', data)
      }
    } catch (err: any) {
      setLoading(false)
      toast.error(err?.message || 'Failed to start payment')
      console.error(err)
    }
  }

  return (
    <Button onClick={startPayment} disabled={loading}>
      {loading ? 'Initializing...' : 'Pay with Paystack'}
    </Button>
  )
}
