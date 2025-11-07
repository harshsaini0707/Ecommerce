import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { CartProvider } from './context/CartContext';

const AppShell = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-glow-radial bg-porcelain">
      <div className="pointer-events-none fixed inset-0 bg-glow-spot opacity-75" />
      <div className="pointer-events-none fixed -left-24 top-32 h-64 w-64 rounded-full bg-accent-200 blur-3xl" />
      <div className="pointer-events-none fixed -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-200 blur-3xl" />

      <Header />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;