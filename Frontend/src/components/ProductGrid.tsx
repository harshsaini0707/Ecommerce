import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { PiCursorClickBold } from 'react-icons/pi';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { addToCart as addToCartAPI } from '../services/api';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, loading = false, error }) => {
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string | number, number>>({});
  const [addingProductId, setAddingProductId] = useState<string | number | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  const handleQuantityChange = (productId: string | number, value: number) => {
    const sanitizedValue = Number.isFinite(value) ? Math.max(1, value) : 1;
    setQuantities((prev) => ({
      ...prev,
      [productId]: sanitizedValue,
    }));
  };

  const handleAddToCart = async (product: Product) => {
    try {
      setAddingProductId(product.id);
      setAddError(null);

      const quantity = quantities[product.id] || 1;

      await addToCartAPI(product, quantity);
      await addToCart(product, quantity);

      setQuantities((prev) => ({
        ...prev,
        [product.id]: 1,
      }));
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setAddingProductId(null);
    }
  };

  const renderStatus = (message: string, mode: 'loading' | 'error' | 'empty') => (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-porcelain/90 via-white/75 to-accent-50/60 p-16 text-center shadow-xl shadow-slate-900/10 backdrop-blur"
    >
      <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/25">
        {mode === 'loading' && <PiCursorClickBold className="h-7 w-7 animate-pulse" />}
        {mode === 'error' && <Minus className="h-7 w-7" />}
        {mode === 'empty' && <ShoppingBag className="h-7 w-7" />}
      </span>
      <p className="max-w-sm text-base font-medium text-slate-700">{message}</p>
    </motion.div>
  );

  if (loading) {
    return renderStatus('Curating the latest products for you...', 'loading');
  }

  if (error) {
    return renderStatus(`We could not load products right now. ${error}`, 'error');
  }

  if (products.length === 0) {
    return renderStatus('Our shelves are getting refreshed. Check back soon!', 'empty');
  }

  return (
    <div className="space-y-6">
      {addError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {addError}
        </motion.div>
      )}

      <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => {
          const quantity = quantities[product.id] || 1;
          const safeImage =
            product.image && !product.image.toLowerCase().endsWith('.gif')
              ? product.image
              : undefined;

          return (
            <motion.article
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ y: -6 }}
              className="group relative flex h-full flex-col rounded-3xl bg-gradient-to-br from-porcelain/95 via-white/70 to-accent-100/40 p-[1px] shadow-lg shadow-slate-900/12"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-2px)] bg-[#f7f9fc]/90 shadow-xl shadow-slate-900/12 backdrop-blur">
                <div className="relative flex justify-center px-6 pt-12 pb-6">
                  <span className="absolute inset-x-12 top-6 h-40 rounded-full bg-accent-200/30 blur-3xl transition duration-500 group-hover:scale-110" />
                  <div className="relative flex h-48 w-full max-w-xs items-center justify-center rounded-[1.75rem] bg-white/85 p-6 shadow-xl shadow-slate-900/15 ring-1 ring-white/60">
                    {safeImage ? (
                      <motion.img
                        src={safeImage}
                        alt={product.name}
                        className="h-32 w-32 object-contain drop-shadow-xl"
                        loading="lazy"
                        transition={{ duration: 0.45 }}
                        whileHover={{ scale: 1.04 }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-[1.25rem] bg-slate-100 text-slate-400">
                        <ShoppingBag size={28} />
                      </div>
                    )}
                  </div>
                  <motion.span
                    initial={{ scale: 0.85, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="absolute left-6 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow"
                  >
                    Spotlight
                  </motion.span>
                </div>

                <div className="flex flex-1 flex-col gap-6 px-6 pb-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                    <motion.span
                      layout
                      className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow shadow-slate-900/20"
                    >
                      ${product.price.toFixed(2)}
                    </motion.span>
                  </div>
                  <div className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                    Ecommerce Collection
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-full bg-slate-100 px-3 py-1.5">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => handleQuantityChange(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                        disabled={quantity <= 1}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-white hover:text-slate-900 disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </motion.button>
                      <div className="relative flex h-9 w-12 items-center justify-center overflow-hidden text-sm font-semibold text-slate-900">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={quantity}
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -12, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {quantity}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => handleQuantityChange(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-white hover:text-slate-900"
                      >
                        <Plus size={16} />
                      </motion.button>
                    </div>

                    <motion.button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={addingProductId === product.id}
                      whileTap={{ scale: 0.97 }}
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      <ShoppingBag className="h-4 w-4 transition duration-300 group-hover:-translate-y-0.5" />
                      <span>{addingProductId === product.id ? 'Adding...' : 'Add to cart'}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </div>
  );
};
