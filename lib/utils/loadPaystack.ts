// utils/loadPaystack.ts
export function loadPaystackScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve();
    if ((window as any).PaystackPop) return resolve();
    const s = document.createElement('script');
    s.src = 'https://js.paystack.co/v1/inline.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve(); // resolve anyway but you should show error if PaystackPop missing
    document.body.appendChild(s);
  });
}
