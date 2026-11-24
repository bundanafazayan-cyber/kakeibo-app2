import React, { useState } from 'react';
import type { Transaction, KakeiboCategory } from '../types';
import { formatRupiah } from '../utils/currency';
import { formatIndoDate } from '../utils/date';
import { Trash2, Edit2, Search } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (trx: Transaction) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_TAG: Record<KakeiboCategory, { label: string; style: string }> = {
  needs: { label: 'Needs', style: 'bg-blue-50 text-kakeibo-needs border-blue-200' },
  wants: { label: 'Wants', style: 'bg-amber-50 text-kakeibo-wants border-amber-200' },
  culture: { label: 'Culture', style: 'bg-emerald-50 text-kakeibo-culture border-emerald-200' },
  extra: { label: 'Extra', style: 'bg-rose-50 text-kakeibo-extra border-rose-200' }
};

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = transactions.filter((t) => {
    if (filter !== 'all') {
      if (filter === 'income' && t.type !== 'income') return false;
      if (filter !== 'income' && t.kakeiboCategory !== filter) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchSub = t.subCategory.toLowerCase().includes(q);
      const matchNote = t.note.toLowerCase().includes(q);
      return matchSub || matchNote;
    }
    return true;
  });

  const groupedByDate: Record<string, Transaction[]> = {};
  for (const trx of filtered) {
    if (!groupedByDate[trx.date]) groupedByDate[trx.date] = [];
    groupedByDate[trx.date].push(trx);
  }
  const dates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-card border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-matcha"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'needs', label: 'Needs' },
            { id: 'wants', label: 'Wants' },
            { id: 'culture', label: 'Culture' },
            { id: 'extra', label: 'Extra' },
            { id: 'income', label: 'Masuk' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilter(pill.id)}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap text-[11px] ${
                filter === pill.id
                  ? 'bg-stone-800 text-washi font-medium'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {dates.length === 0 ? (
        <div className="bg-card border border-dashed border-stone-300 rounded-2xl p-8 text-center text-stone-400">
          <p className="text-xs">Belum ada transaksi di bulan ini.</p>
          <p className="text-[11px] mt-1 text-stone-400">Tekan tombol (+) di pojok kanan bawah untuk mencatat.</p>
        </div>
      ) : (
        dates.map((dateStr) => {
          const dayItems = groupedByDate[dateStr];
          const dayTotalExpense = dayItems
            .filter((i) => i.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);

          return (
            <div key={dateStr} className="bg-card border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-stone-50/80 px-4 py-2 border-b border-stone-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-sumi">{formatIndoDate(dateStr)}</span>
                {dayTotalExpense > 0 && (
                  <span className="text-[11px] text-stone-500 font-mono">
                    Keluar: {formatRupiah(dayTotalExpense)}
                  </span>
                )}
              </div>

              <div className="divide-y divide-stone-100">
                {dayItems.map((trx) => {
                  const isIncome = trx.type === 'income';
                  const tag = trx.kakeiboCategory ? CATEGORY_TAG[trx.kakeiboCategory] : null;

                  return (
                    <div
                      key={trx.id}
                      className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-stone-50/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs text-sumi truncate">
                            {trx.subCategory}
                          </span>
                          {tag && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${tag.style}`}>
                              {tag.label}
                            </span>
                          )}
                        </div>
                        {trx.note && (
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">{trx.note}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-xs sm:text-sm font-semibold whitespace-nowrap ${
                            isIncome ? 'text-emerald-700' : 'text-sumi'
                          }`}
                        >
                          {isIncome ? `+${formatRupiah(trx.amount)}` : `-${formatRupiah(trx.amount)}`}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEdit(trx)}
                            className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Hapus transaksi ini?')) {
                                onDelete(trx.id);
                              }
                            }}
                            className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
