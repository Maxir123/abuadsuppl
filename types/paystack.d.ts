export {}

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string
        email: string
        amount: number
        ref: string
        callback: (response: { reference: string }) => void
        onClose: () => void
      }) => {
        openIframe: () => void
      }
    }
  }
}
