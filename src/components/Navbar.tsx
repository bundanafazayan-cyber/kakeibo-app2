import React from 'react';
import { BookOpen, Database, BarChart2, Calendar } from 'lucide-react';

interface NavbarProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  onOpenNewTrx: () => void;
  onOpenBudget: () => void;
  onOpenReflection: () => void;
  onOpenBackup: () => void;
  currentTab: 'journal' | 'reports';
  setCurrentTab: (tab: 'journal' | 'reports') => void;
  isPersisted: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMonth,
  onMonthChange,
  onOpenReflection,
  onOpenBackup,
  currentTab,
  setCurrentTab,
  isPersisted
}) => {
  return (
    <header className="sticky top-0 z-30 bg-washi/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-matcha-dark flex items-center justify-center text-washi font-serif font-bold text-sm shadow-sm">
              家
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg leading-tight text-sumi tracking-tight">Kakeibo</h1>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">Mindful Ledger</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReflection}
              title="Refleksi Kakeibo 4 Pertanyaan"
              className="p-2 text-stone-600 hover:text-matcha-dark hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1 text-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Refleksi</span>
            </button>
            <button
              onClick={onOpenBackup}
              title="Pencadangan & Status Database"
              className="p-2 text-stone-600 hover:text-matcha-dark hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1 text-xs relative"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Cadangan</span>
              {isPersisted && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1.5 right-1.5" title="Storage Persisten Aktif" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
          <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-stone-500 ml-1.5" />
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => e.target.value && onMonthChange(e.target.value)}
              className="bg-transparent text-sumi font-medium border-0 focus:ring-0 p-0 text-xs cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('journal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'journal'
                  ? 'bg-matcha-dark text-washi shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Buku Kas
            </button>
            <button
              onClick={() => setCurrentTab('reports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                currentTab === 'reports'
                  ? 'bg-matcha-dark text-washi shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Laporan
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
