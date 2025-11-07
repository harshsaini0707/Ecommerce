import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CheckoutFormData } from '../types';

interface CheckoutFormProps {
  onSubmit: (formData: CheckoutFormData) => void;
  loading?: boolean;
}

const fields: Array<{
  name: keyof CheckoutFormData;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'tel';
}> = [
  { name: 'name', label: 'Full name', placeholder: 'Ada Lovelace', type: 'text' },
  { name: 'email', label: 'Email address', placeholder: 'ada@ecommerce.com', type: 'email' },
  { name: 'address', label: 'Shipping address', placeholder: '221 Innovation Way, Suite 7', type: 'text' },
  { name: 'phone', label: 'Phone number', placeholder: '(555) 123-4567', type: 'tel' },
];

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[0-9\s()-]{7,}$/.test(formData.phone)) newErrors.phone = 'Enter a valid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl bg-white/80 p-8 shadow-xl shadow-slate-900/10 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="space-y-2">
        <h2 className="font-display text-2xl text-slate-900">Shipping details</h2>
        <p className="text-sm text-slate-500">We use this information to deliver your curated pieces securely.</p>
      </header>

      <div className="grid gap-5">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label htmlFor={field.name} className="text-sm font-medium text-slate-600">
              {field.label}
              <span className="text-accent-500"> *</span>
            </label>
            <motion.input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              disabled={loading}
              whileFocus={{ scale: 1.01 }}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-900/5 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:shadow-lg focus:shadow-accent-200/40 disabled:opacity-60"
            />
            <AnimatePresence mode="wait">
              {errors[field.name] && (
                <motion.p
                  key={errors[field.name]}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-xs font-medium text-red-500"
                >
                  {errors[field.name]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        <span className="relative z-10">{loading ? 'Processing…' : 'Confirm order'}</span>
        <span className="absolute inset-0 bg-gradient-to-r from-accent-500/0 via-accent-500/20 to-accent-500/40 opacity-0 transition group-hover:opacity-100" />
      </motion.button>
    </motion.form>
  );
};
