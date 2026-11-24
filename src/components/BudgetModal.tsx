import React, { useState, useEffect } from 'react';
import type { MonthlyBudget } from '../types';
import { cleanRupiahInput } from '../utils/currency';
import { formatMonthName } from '../utils/date';
import { X, Target } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  currentBudget?: MonthlyBudget | null;
  onSave: (budget: MonthlyBudget) => Promise<void>;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  month,
  currentBudget,
  onSave
}) => {
  const [savings, setSavings] = useState('');
  const [needs, setNeeds] = useState('');
  const [wants, setWants] = useState('');
  const [culture, setCulture] = useState('');
  const [extra, setExtra] = useState('');

  useEffect(() => {
    if (currentBudget) {
      setSavings(currentBudget.targetSavings ? String(currentBudget.targetSavings) : '');
      setNeeds(currentBudget.needs ? String(currentBudget.needs) : '');
      setWants(currentBudget.wants ? String(currentBudget.wants) : '');
      setCulture(currentBudget.culture ? String(currentBudget.culture) : '');
      setExtra(currentBudget.extra ? String(currentBudget.extra) : '');
    } else {
      setSavings('');
      setNeeds('');
      setWants('');
      setCulture('');
      setExtra('');
    }
  }, [currentBudget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const budgetData: MonthlyBudget = {
      id: month,
      month,
      targetSavings: cleanRupiahInput(savings),
      needs: cleanRupiahInput(needs),
      wants: cleanRupiahInput(wants),
      culture: cleanRupiahInput(culture),
      extra: cleanRupiahInput(extra),
      updatedAt: Date.now()
    };
    await onSave(budgetData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-sumi/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-washi w-full max-w-md rounded-2xl p-6 shadow-xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h3 className="font-serif font-bold text-lg text-sumi">Target & Anggaran</h3>
            <p className="text-xs text-stone-500">{formatMonthName(month)}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div className="bg-matcha-light/60 p-3 rounded-xl border border-matcha/20">
            <label className="flex items-center gap-1.5 font-semibold text-matcha-dark mb-1">
              <Target className="w-3.5 h-3.5" /> Target Tabungan Bulan Ini (Rupiah)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={cleanRupiahInput(savings) > 0 ? cleanRupiahInput(savings).toLocaleString('id-ID') : ''}
              onChange={(e) => setSavings(e.target.value)}
              className="w-full px-3 py-2 bg-card border border-stone-200 rounded-lg font-mono font-bold text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium text-stone-600 block">Batas Anggaran 4 Pilar (Opsional)</label>

            <div>
              <span className="text-stone-500 block mb-0.5">1. Needs (Kebutuhan Pokok):</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={cleanRupiahInput(needs) > 0 ? cleanRupiahInput(needs).toLocaleString('id-ID') : ''}
                onChange={(e) => setNeeds(e.target.value)}
                className="w-full px-3 py-1.5 bg-card border border-stone-200 rounded-lg font-mono text-xs"
              />
            </div>

            <div>
              <span className="text-stone-500 block mb-0.5">2. Wants (Keinginan):</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={cleanRupiahInput(wants) > 0 ? cleanRupiahInput(wants).toLocaleString('id-ID') : ''}
                onChange={(e) => setWants(e.target.value)}
                className="w-full px-3 py-1.5 bg-card border border-stone-200 rounded-lg font-mono text-xs"
              />
            </div>

            <div>
              <span className="text-stone-500 block mb-0.5">3. Culture (Wawasan & Buku):</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={cleanRupiahInput(culture) > 0 ? cleanRupiahInput(culture).toLocaleString('id-ID') : ''}
                onChange={(e) => setCulture(e.target.value)}
                className="w-full px-3 py-1.5 bg-card border border-stone-200 rounded-lg font-mono text-xs"
              />
            </div>

            <div>
              <span className="text-stone-500 block mb-0.5">4. Extra (Pengeluaran Tak Terduga):</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={cleanRupiahInput(extra) > 0 ? cleanRupiahInput(extra).toLocaleString('id-ID') : ''}
                onChange={(e) => setExtra(e.target.value)}
                className="w-full px-3 py-1.5 bg-card border border-stone-200 rounded-lg font-mono text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-matcha-dark text-washi font-medium rounded-xl hover:bg-matcha transition-colors"
          >
            Simpan Anggaran
          </button>
        </form>
      </div>
    </div>
  );
};
