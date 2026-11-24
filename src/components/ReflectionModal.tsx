import React, { useState, useEffect } from 'react';
import type { MonthlyReflection } from '../types';
import { formatMonthName } from '../utils/date';
import { X, Sparkles } from 'lucide-react';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  currentReflection?: MonthlyReflection | null;
  onSave: (data: MonthlyReflection) => Promise<void>;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  isOpen,
  onClose,
  month,
  currentReflection,
  onSave
}) => {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');

  useEffect(() => {
    if (currentReflection) {
      setQ1(currentReflection.q1IncomeFeedback || '');
      setQ2(currentReflection.q2SavingsFeedback || '');
      setQ3(currentReflection.q3SpendingFeedback || '');
      setQ4(currentReflection.q4ImprovementPlan || '');
    } else {
      setQ1('');
      setQ2('');
      setQ3('');
      setQ4('');
    }
  }, [currentReflection, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      id: month,
      month,
      q1IncomeFeedback: q1,
      q2SavingsFeedback: q2,
      q3SpendingFeedback: q3,
      q4ImprovementPlan: q4,
      updatedAt: Date.now()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-sumi/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-washi w-full max-w-lg rounded-2xl p-6 shadow-xl border border-stone-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-1.5 text-matcha-dark font-serif font-bold text-lg">
              <Sparkles className="w-4 h-4" /> 4 Refleksi Motoko Hani
            </div>
            <p className="text-xs text-stone-500">Evaluasi Finansial: {formatMonthName(month)}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="font-semibold text-sumi block mb-1">
              1. Berapa banyak uang yang kamu miliki bulan ini?
            </label>
            <textarea
              rows={2}
              placeholder="Refleksi tentang sumber pendapatan..."
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              className="w-full p-2.5 bg-card border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-matcha"
            />
          </div>

          <div>
            <label className="font-semibold text-sumi block mb-1">
              2. Berapa banyak uang yang ingin kamu tabung?
            </label>
            <textarea
              rows={2}
              placeholder="Apakah target tabungan realistis?"
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              className="w-full p-2.5 bg-card border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-matcha"
            />
          </div>

          <div>
            <label className="font-semibold text-sumi block mb-1">
              3. Berapa banyak uang yang sebenarnya kamu belanjakan?
            </label>
            <textarea
              rows={2}
              placeholder="Pengeluaran mana yang paling bermanfaat atau sia-sia?"
              value={q3}
              onChange={(e) => setQ3(e.target.value)}
              className="w-full p-2.5 bg-card border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-matcha"
            />
          </div>

          <div>
            <label className="font-semibold text-sumi block mb-1">
              4. Bagaimana kamu bisa memperbaikinya di bulan depan?
            </label>
            <textarea
              rows={2}
              placeholder="Komitmen kecil untuk kebiasaan belanja yang lebih bijak..."
              value={q4}
              onChange={(e) => setQ4(e.target.value)}
              className="w-full p-2.5 bg-card border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-matcha"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-matcha-dark text-washi font-medium rounded-xl hover:bg-matcha transition-colors"
          >
            Simpan Refleksi
          </button>
        </form>
      </div>
    </div>
  );
};
