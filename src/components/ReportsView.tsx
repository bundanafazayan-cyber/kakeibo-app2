import React, { useState } from 'react';
import type { Transaction, KakeiboCategory } from '../types';
import { formatRupiah } from '../utils/currency';
import { formatMonthName } from '../utils/date';

interface ReportsViewProps {
  currentMonth: string;
  allTransactions: Transaction[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ currentMonth, allTransactions }) => {
  const [reportType, setReportType] = useState<'monthly' | 'yearly'>('monthly');
  const currentYear = currentMonth.slice(0, 4);

  const relevantTrx = allTransactions.filter((t) => {
    if (reportType === 'monthly') {
      return t.date.startsWith(currentMonth);
    }
    return t.date.startsWith(currentYear);
  });

  const totalIncome = relevantTrx
    .filter((t) => t.type === 'income')
    .reduce((acc, c) => acc + c.amount, 0);

  const totalExpense = relevantTrx
    .filter((t) => t.type === 'expense')
    .reduce((acc, c) => acc + c.amount, 0);

  const netSavings = Math.max(0, totalIncome - totalExpense);

  const catTotals: Record<KakeiboCategory, number> = {
    needs: 0,
    wants: 0,
    culture: 0,
    extra: 0
  };

  for (const t of relevantTrx) {
    if (t.type === 'expense' && t.kakeiboCategory) {
      catTotals[t.kakeiboCategory] += t.amount;
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex bg-stone-100 p-1 rounded-xl text-xs">
        <button
          onClick={() => setReportType('monthly')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
            reportType === 'monthly' ? 'bg-card text-sumi shadow-sm' : 'text-stone-500'
          }`}
        >
          Laporan Bulanan ({formatMonthName(currentMonth)})
        </button>
        <button
          onClick={() => setReportType('yearly')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
            reportType === 'yearly' ? 'bg-card text-sumi shadow-sm' : 'text-stone-500'
          }`}
        >
          Laporan Tahunan ({currentYear})
        </button>
      </div>

      <div className="bg-card border border-stone-200/80 rounded-2xl p-4 shadow-sm">
        <h4 className="font-serif font-bold text-sm text-sumi mb-3">Ringkasan Arus Kas</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-stone-100">
            <span className="text-stone-500">Total Pemasukan</span>
            <span className="font-mono font-semibold text-emerald-700">{formatRupiah(totalIncome)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-100">
            <span className="text-stone-500">Total Pengeluaran</span>
            <span className="font-mono font-semibold text-hanko">{formatRupiah(totalExpense)}</span>
          </div>
          <div className="flex justify-between py-1 font-semibold text-sumi">
            <span>Sisa / Tabungan Terbentuk</span>
            <span className="font-mono text-matcha-dark">{formatRupiah(netSavings)}</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-stone-200/80 rounded-2xl p-4 shadow-sm">
        <h4 className="font-serif font-bold text-sm text-sumi mb-3">Komposisi Pengeluaran Kakeibo</h4>

        {totalExpense === 0 ? (
          <p className="text-xs text-stone-400 text-center py-4">Belum ada pengeluaran pada periode ini.</p>
        ) : (
          <div className="space-y-3">
            {[
              { key: 'needs', label: 'Needs (Kebutuhan)', color: 'bg-kakeibo-needs' },
              { key: 'wants', label: 'Wants (Keinginan)', color: 'bg-kakeibo-wants' },
              { key: 'culture', label: 'Culture (Wawasan)', color: 'bg-kakeibo-culture' },
              { key: 'extra', label: 'Extra (Tak Terduga)', color: 'bg-kakeibo-extra' }
            ].map((p) => {
              const amount = catTotals[p.key as KakeiboCategory];
              const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;

              return (
                <div key={p.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-600">{p.label}</span>
                    <span className="font-mono font-medium">
                      {formatRupiah(amount)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${p.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
