import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import type { Receipt } from '../types';

interface ReceiptModalProps {
  receipt: Receipt;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-title"
        onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 12 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white/95 p-6 shadow-2xl shadow-slate-900/40 backdrop-blur"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          aria-label="Close receipt"
        >
          <X size={16} />
        </button>

        <div className="space-y-6">
          <header className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/30">
              <CheckCircle2 size={24} />
            </span>
            <div>
              <h2 id="receipt-title" className="font-display text-2xl text-slate-900">Order confirmed</h2>
              <p className="text-xs text-slate-500">Order ID: {receipt.id}</p>
            </div>
          </header>

          <section className="rounded-xl border border-slate-200/70 bg-white/70 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Customer</h3>
            <div className="mt-2 space-y-0.5">
              <p className="text-sm font-semibold text-slate-900">{receipt.customerName}</p>
              <p className="text-xs text-slate-500">{receipt.customerEmail}</p>
            </div>
          </section>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Items</h3>
            <div className="overflow-hidden rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2">Qty</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {receipt.items.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100/80 bg-white/80">
                      <td className="px-3 py-2 text-slate-900 text-xs">{item.name}</td>
                      <td className="px-3 py-2 text-xs">{item.quantity}</td>
                      <td className="px-3 py-2 text-xs">${item.price.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-semibold text-slate-900 text-xs">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <section className="flex flex-col gap-2 rounded-xl bg-slate-900/92 p-4 text-white shadow-lg shadow-slate-900/30 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-black font-bold">Total paid</p>
              <p className="text-2xl text-black font-semibold">${receipt.total.toFixed(2)}</p>
            </div>
            <p className="text-xs text-black text-white/70">Taxes and shipping included • Transaction #VC-{receipt.id.slice(-6)}</p>
          </section>

          <footer className="flex flex-col gap-1 text-xs text-gray-800">
            <p>Placed on {new Date(receipt.timestamp).toLocaleString()}</p>
            <p>We have emailed your receipt. Reach out within 24 hours to tweak your order.</p>
          </footer>

          <div className="flex justify-end">
            <motion.button
              type="button"
              onClick={onClose}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow shadow-slate-900/25 transition hover:bg-accent-600"
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
