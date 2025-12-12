declare module '@paystack/inline-js' {
  interface PaystackPopOptions {
    key: string
    email: string
    amount: number
    ref?: string
    reference?: string // ✨ added alias
    metadata?: Record<string, unknown>
    onSuccess?: (response: unknown) => void
    onCancel?: () => void
  }

  export default class PaystackPop {
    newTransaction(options: PaystackPopOptions): void
  }
}
