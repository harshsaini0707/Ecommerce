import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckoutForm } from '../components/CheckoutForm';
import { ReceiptModal } from '../components/ReceiptModal';
import { CartView } from '../components/CartView';
import type { CheckoutFormData, Receipt } from '../types';
import { useCart } from '../context/CartContext';
import { checkout } from '../services/api';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckoutSubmit = async (formData: CheckoutFormData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await checkout(cart, formData);
      setReceipt(result);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptClose = () => {
    setReceipt(null);
    navigate('/');
  };

  if (cart.length === 0 && !receipt) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 rounded-3xl bg-white/85 px-10 py-16 text-center shadow-xl shadow-slate-900/10 backdrop-blur"
      >
        <h2 className="font-display text-3xl text-slate-900">Your cart is empty</h2>
        <p className="max-w-md text-sm text-slate-500">Add products to your collection before completing checkout. We keep your selections saved as you explore.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-accent-600"
        >
          Continue shopping
        </button>
      </motion.div>
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <AnimatePresence>{receipt && <ReceiptModal receipt={receipt} onClose={handleReceiptClose} />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 shadow shadow-slate-900/5">
          Final step
        </span>
        <h1 className="font-display text-4xl text-slate-900">Checkout</h1>
        <p className="max-w-2xl text-sm text-slate-600">Secure your order with a few quick details. Shipping is covered, and we will send a detailed receipt to your inbox.</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <CheckoutForm onSubmit={handleCheckoutSubmit} loading={loading} />
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="space-y-6"
        >
          <div className="rounded-3xl bg-white/85 p-6 shadow-xl shadow-slate-900/10 backdrop-blur">
            <h2 className="mb-4 font-display text-2xl text-slate-900">Order summary</h2>
            <CartView items={cart} total={total} editable={false} variant="compact" />
          </div>
          <div className="rounded-2xl bg-white/75 px-5 py-4 text-xs text-slate-500 shadow shadow-slate-900/5">
            Payments are processed securely with bank-level encryption. Need help? Reach out to support@ecommerce.com.
          </div>
        </motion.aside>
      </div>
    </div>
  );
};
