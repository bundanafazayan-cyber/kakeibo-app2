import React from 'react';
import type { KakeiboCategory } from '../types';
import { formatRupiah } from '../utils/currency';

interface PillarProgressProps {
  categoryTotals: Record<KakeiboCategory, number>;
  categoryBudgets: Record<KakeiboCategory, number>;
}

const PILLAR_CONFIG: Record<KakeiboCategory, { label: string; sub: string; color: string; bar: string }> = {
  needs: {
    label: 'Needs (Survival)',
    sub: 'Makan, kos, listrik, obat',
    color: 'text-kakeibo-needs',
    bar: 'bg-kakeibo-needs'
  },
  wants: {
    label: 'Wants (Optional)',
    sub: 'Ngopi, belanja, jajan',
    color: 'text-kakeibo-wants',
    bar: 'bg-kakeibo-wants'
  },
  culture: {
    label: 'Culture (Enrichment)',
    sub: 'Buku, tiket museum, kursus',
    color: 'text-kakeibo-culture',
    bar: 'bg-kakeibo-culture'
  },
  extra: {
    label: 'Extra (Unexpected)',
    sub: 'Servis mendadak, kondangan',
    color: 'text-kakeibo-extra',
    bar: 'bg-kakeibo-extra'
  }
};

export const PillarProgress: React.FC<PillarProgressProps> = ({
  categoryTotals,
  categoryBudgets
}) => {
  const pillars: KakeiboCategory[] = ['needs', 'wants', 'culture', 'extra'];

  return (
    <div className="bg-card border border-stone-200/80 rounded-2xl p-4 shadow-sm space-y-3.5">
      <h3 className="font-serif font-bold text-sm text-sumi">4 Pilar Pengeluaran Kakeibo</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pillars.map((key) => {
          const cfg = PILLAR_CONFIG[key];
          const spent = categoryTotals[key] || 0;
          const budget = categoryBudgets[key] || 0;
          const percentage = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
          const isOver = budget > 0 && spent > budget;

          return (
            <div key={key} className="p-3 bg-stone-50/70 border border-stone-100 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
                  <p className="text-[10px] text-stone-500">{cfg.sub}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-sumi">{formatRupiah(spent)}</span>
                  {budget > 0 && (
                    <span className="text-[10px] text-stone-500 block">/ {formatRupiah(budget)}</span>
                  )}
                </div>
              </div>

              {budget > 0 && (
                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-hanko' : cfg.bar}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
