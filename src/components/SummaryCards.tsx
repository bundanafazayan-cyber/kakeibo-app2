import React from 'react';
import { formatRupiah } from '../utils/currency';
import { Target, TrendingDown, TrendingUp, SlidersHorizontal } from 'lucide-react';

interface SummaryCardsProps {
  income: number;
  expenses: number;
  savingsGoal: number;
  totalBudget: number;
  onEditBudget: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  income,
  expenses,
  savingsGoal,
  onEditBudget
}) => {
  const moneyLeftToSpend = Math.max(0, income - savingsGoal - expenses);
  const actualSavings = Math.max(0, income - expenses);

  return (
    <div className="space-y-3">
      <div className="bg-card border border-stone-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-matcha-dark" />
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500">
              Sisa Uang Boleh Dibelanjakan
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-sumi mt-0.5">
              {formatRupiah(moneyLeftToSpend)}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Setelah dikurangi target tabungan ({formatRupiah(savingsGoal)})
            </p>
          </div>
          <button
            onClick={onEditBudget}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            title="Atur Target Tabungan & Anggaran"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-100 text-center">
          <div className="bg-stone-50/80 rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 text-[10px] text-stone-500 font-medium">
              <TrendingUp className="w-3 h-3 text-emerald-600" /> Masuk
            </div>
            <p className="text-xs sm:text-sm font-semibold text-sumi mt-1 truncate">
              {formatRupiah(income)}
            </p>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 text-[10px] text-stone-500 font-medium">
              <TrendingDown className="w-3 h-3 text-hanko" /> Keluar
            </div>
            <p className="text-xs sm:text-sm font-semibold text-hanko mt-1 truncate">
              {formatRupiah(expenses)}
            </p>
          </div>

          <div className="bg-stone-50/80 rounded-xl p-2.5">
            <div className="flex items-center justify-center gap-1 text-[10px] text-stone-500 font-medium">
              <Target className="w-3 h-3 text-matcha" /> Tabungan
            </div>
            <p className="text-xs sm:text-sm font-semibold text-matcha-dark mt-1 truncate">
              {formatRupiah(actualSavings)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
