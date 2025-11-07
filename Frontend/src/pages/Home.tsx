import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { ProductGrid } from '../components/ProductGrid';
import type { Product } from '../types';
import { fetchProducts } from '../services/api';

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        const transformedProducts: Product[] = data.map((product: any) => ({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image,
          description: product.description,
        }));
        setProducts(transformedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl bg-white/80 p-10 shadow-xl shadow-slate-900/10 backdrop-blur">
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-accent-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        >
          <div className="space-y-8">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-slate-900/25"
            >
              <Sparkles size={16} className="text-accent-200" />
              ecommerce • modern living
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-display text-4xl leading-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Ecommerce elevates every day with design-led essentials
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg"
            >
              Discover a rotating selection of thoughtfully crafted pieces that blend form and function. Each drop is handpicked by the Ecommerce team to bring a sense of calm luxury into your space.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                to="#catalog"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-accent-600"
              >
                <span className="relative z-10">Browse collection</span>
                <motion.span
                  whileHover={{ x: 4 }}
                  className="relative z-10"
                >
                  <ArrowRight size={18} />
                </motion.span>
                <span className="absolute inset-0 bg-gradient-to-r from-accent-500/0 via-accent-500/15 to-accent-500/30 opacity-0 transition group-hover:opacity-100" />
              </Link>
              <Link
                to="/checkout"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                Plan your order
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="relative hidden aspect-square w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl shadow-slate-900/30 sm:flex"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_55%)]" />
            <div className="absolute inset-x-10 inset-y-12 rounded-[1.75rem] border border-white/10" />
            <div className="absolute inset-x-16 inset-y-20 rounded-[1.5rem] border border-white/15" />
            <div className="relative z-10 flex flex-col justify-between text-white">
              <header className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.3em] text-white/60">drop 07</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">limited</span>
              </header>
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-[0.35em] text-white/40">featured</p>
                <h2 className="font-display text-3xl leading-tight">Aurora tactile glassware</h2>
              </div>
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Ships in 24h</span>
                <span>$65</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[{
          icon: <Sparkles size={20} />, title: 'Curated drops', copy: 'Fresh edits every month, designed to feel personal and intentional.'
        }, {
          icon: <Truck size={20} />, title: 'Express delivery', copy: 'Tracked, eco-friendly shipping that lands at your door in days.'
        }, {
          icon: <ShieldCheck size={20} />, title: 'Conscious quality', copy: 'Sourced from mindful makers with a focus on lasting craftsmanship.'
        }].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-lg shadow-slate-900/10 backdrop-blur"
          >
            <span className="absolute inset-x-12 top-0 h-24 rounded-full bg-accent-200/30 blur-3xl transition duration-500 group-hover:scale-150" />
            <div className="relative z-10 space-y-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                {feature.icon}
              </span>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{feature.copy}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <section id="catalog" className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-slate-900">Latest arrivals</h2>
            <p className="text-sm text-slate-500">Each piece is selected to balance utility with aesthetic ease.</p>
          </div>
        </div>
        <ProductGrid products={products} loading={loading} error={error ?? undefined} />
      </section>
    </div>
  );
};
