const base = process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co'
// lib/paystack.ts (add near top or bottom)

export  const paystack = {
   createOrder: async function createOrder(price: number) {
    const accessToken = await generateAccessToken()
    const url = `${base}/v2/checkout/orders`
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'NGN',
              value: price,
            },
          },
        ],
      }),
    })
    return handleResponse(response)
  },
  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken()
    const url = `${base}/v2/checkout/orders/${orderId}/capture`
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return handleResponse(response)
  },
}

async function generateAccessToken() {
  const { PAYSTACK_PUBLIC_KEY, PAYSTACK_SECRET_KEY } = process.env
  const auth = Buffer.from(PAYSTACK_PUBLIC_KEY + ':' + PAYSTACK_SECRET_KEY).toString(
    'base64'
  )
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'post',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })

  const jsonData = await handleResponse(response)
  return jsonData.access_token
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleResponse(response: any) {
  if (response.status === 200 || response.status === 201) {
    return response.json()
  }

  const errorMessage = await response.text()
  throw new Error(errorMessage)
}
