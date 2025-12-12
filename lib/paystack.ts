const base = process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co'

export const paystack = {
  initializePayment: async function initializePayment(data: {
    email: string
    amount: number // amount in kobo (NGN) or pesewas (GHS)
    reference: string
    callback_url: string
    metadata?: Record<string, string | number | boolean>
  }) {
    const response = await fetch(`${base}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      body: JSON.stringify(data),
    })

    return handleResponse(response)
  },

  verifyPayment: async function verifyPayment(reference: string) {
    const response = await fetch(`${base}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    return handleResponse(response)
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleResponse(response: any) {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Payment request failed')
  }

  if (!data.status) {
    throw new Error(data.message || 'Payment failed')
  }

  return data
}

export function formatAmountForPaystack(amount: number): number {
  // Convert to kobo (NGN) or pesewas (GHS) - 100 units = 1 currency unit
  // Adjust multiplier based on your currency (100 for NGN/GHS, 100 for cents, etc.)
  return Math.round(amount * 100)
}
