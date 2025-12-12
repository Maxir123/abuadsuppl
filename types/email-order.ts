export type EmailOrder = {
  _id: string
  createdAt?: Date
  isPaid: boolean
  paidAt?: Date
  totalPrice: number
  itemsPrice: number
  taxPrice: number
  shippingPrice: number

  user: {
    name: string
    email: string
  }

  shippingAddress: {
    fullName: string
    street: string
    city: string
    postalCode: string
    country: string
    phone: string
    province: string
  }

  items: {
    clientId: string
    name: string
    image: string
    price: number
    quantity: number
    product: string
    slug: string
    category: string
    countInStock: number
  }[]

  paymentMethod: string
  expectedDeliveryDate: Date
  isDelivered: boolean
  deliveredAt?: Date
}
