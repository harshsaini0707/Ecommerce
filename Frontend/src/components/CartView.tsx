import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import type { CartItem } from '../types';
import { useCart } from '../context/CartContext';

interface CartViewProps {
  items: CartItem[];
  total: number;
  onCheckout?: () => void;
  editable?: boolean;
  variant?: 'full' | 'compact';
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  total,
  onCheckout,
  editable = true,
  variant = 'full',
}) => {
  const { removeFromCart, updateQuantity } = useCart();
  const [pendingId, setPendingId] = useState<string | number | null>(null);
  const [removingId, setRemovingId] = useState<string | number | null>(null);

  const handleRemove = async (productId: string | number) => {
    try {
      setRemovingId(productId);
      await removeFromCart(productId);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleUpdateQuantity = async (productId: string | number, quantity: number) => {
    if (!editable) return;
    try {
      setPendingId(productId);
      await updateQuantity(productId, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setPendingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white/85 px-10 py-16 text-center shadow-xl shadow-slate-900/10 backdrop-blur"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20">
          <ShoppingCart size={28} />
        </span>
        <div className="space-y-2">
          <h2 className="font-display text-2xl text-slate-900">Your cart is feeling light</h2>
          <p className="text-sm text-slate-500">Discover pieces that resonate with you and add them to your personal collection.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-accent-600"
        >
          Continue exploring
        </Link>
      </motion.div>
    );
  }

  const isCompact = variant === 'compact';

  return (
    <div className={`space-y-6 ${isCompact ? '' : 'rounded-3xl bg-white/85 p-8 shadow-xl shadow-slate-900/10 backdrop-blur'}`}>
      {!isCompact && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-slate-900">Shopping cart</h2>
            <p className="text-sm text-slate-500">Manage quantities and finalize your selection before checkout.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
            curated total
            <span className="rounded-full bg-slate-900 px-3 py-1 text-white">${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className={`space-y-4 ${isCompact ? '' : 'divide-y divide-slate-200/60'}`}>
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const isProcessing = pendingId === item.productId || removingId === item.productId;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col gap-4 rounded-2xl bg-white/70 p-5 shadow-sm shadow-slate-900/5 transition ${
                  isCompact ? '' : 'hover:shadow-lg hover:shadow-slate-900/10'
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    <div className="hidden h-20 w-20 overflow-hidden rounded-xl bg-slate-100 sm:flex">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <ShoppingCart size={20} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                      <p className="text-sm text-slate-500">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:justify-end">
                    {editable ? (
                      <div className="flex items-center rounded-full bg-slate-100 px-2 py-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isProcessing}
                          aria-label="Decrease quantity"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-white hover:text-slate-900 disabled:opacity-40"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="flex w-12 justify-center text-sm font-semibold text-slate-900">{item.quantity}</div>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          disabled={isProcessing}
                          aria-label="Increase quantity"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-white hover:text-slate-900 disabled:opacity-40"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">Qty {item.quantity}</span>
                    )}

                    <div className="text-right text-base font-semibold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    {editable && (
                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId)}
                        disabled={isProcessing}
                        className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className={`space-y-4 rounded-2xl bg-slate-900/90 p-6 text-white shadow-lg shadow-slate-900/20 ${isCompact ? '' : 'sm:flex sm:items-center sm:justify-between sm:space-y-0'}`}>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Order total</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold">${total.toFixed(2)}</span>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/60">Shipping included</span>
          </div>
        </div>

        {editable && onCheckout && (
          <motion.button
            type="button"
            onClick={onCheckout}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/25 transition hover:bg-accent-200"
          >
            Proceed to checkout
          </motion.button>
        )}
      </div>

      {!isCompact && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <p>Secure checkout • Free carbon-neutral shipping</p>
          <Link to="/checkout" className="underline-offset-2 hover:underline">Review shipping details</Link>
        </div>
      )}
    </div>
  );
};
