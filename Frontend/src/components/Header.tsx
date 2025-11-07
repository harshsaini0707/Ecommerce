import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/checkout', label: 'Checkout' },
];

export const Header: React.FC = () => {
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const location = useLocation();
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(scrollY, [0, 120], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)']);

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      style={{ backgroundColor }}
      className="sticky left-0 right-0 top-0 z-50 w-full border-b backdrop-blur-xl"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900 transition hover:text-accent-600">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            <ShoppingBag size={20} />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-xl tracking-tight">Ecommerce</span>
            <span className="text-xs text-slate-500">Design-forward retail</span>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-2 text-sm font-medium">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 transition duration-200 ${
                    isActive ? 'text-slate-900' : 'text-slate-900 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative inline-flex items-center gap-2">
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10  "
                        transition={{ type: 'spring', stiffness: 450, damping: 40 }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/cart"
            className="group relative flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
          >
            <ShoppingCart className="transition duration-300 group-hover:-translate-y-0.5" size={18} />
            <span>View cart</span>
            <motion.span
              key={itemCount}
              initial={{ scale: 0.8, opacity: 0, y: 4 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/15 px-1 text-[11px]"
            >
              {itemCount}
            </motion.span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/70 shadow-lg shadow-slate-900/10 backdrop-blur md:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden"
          >
            <nav className="mx-4 mb-4 space-y-2 rounded-2xl bg-white/90 p-4 shadow-lg shadow-slate-900/10 backdrop-blur">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100/80'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  {item.to === location.pathname && (
                    <motion.span layoutId="mobile-active" className="h-2 w-2 rounded-full bg-accent-500" />
                  )}
                </NavLink>
              ))}
              <Link
                to="/cart"
                className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow shadow-slate-900/20"
              >
                <span>View cart</span>
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.8, opacity: 0, y: 4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/20 px-2 text-xs"
                >
                  {itemCount}
                </motion.span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
