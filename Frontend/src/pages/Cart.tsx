import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { CartView } from '../components/CartView';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, total } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 shadow shadow-slate-900/5">your bag</span>
        <h1 className="font-display text-4xl text-slate-900">Cart overview</h1>
        <p className="max-w-2xl text-sm text-slate-600">Review the pieces you have curated. Quantities update in real time, and you can head to checkout whenever you are ready.</p>
      </motion.div>

      <CartView items={cart} total={total} onCheckout={handleCheckout} />
    </div>
  );
};
