import React, { useState, useEffect } from 'react';
import type { Transaction, TransactionType, KakeiboCategory } from '../types';
import { cleanRupiahInput } from '../utils/currency';
import { getCurrentDate } from '../utils/date';
import { X } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trx: Omit<Transaction, 'id' | 'createdAt'>, existingId?: string) => Promise<void>;
  initialData?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [rawAmount, setRawAmount] = useState<string>('');
  const [date, setDate] = useState<string>(getCurrentDate());
  const [kakeiboCategory, setKakeiboCategory] = useState<KakeiboCategory>('needs');
  const [subCategory, setSubCategory] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setRawAmount(String(initialData.amount));
      setDate(initialData.date);
      setKakeiboCategory(initialData.kakeiboCategory || 'needs');
      setSubCategory(initialData.subCategory || '');
      setNote(initialData.note || '');
    } else {
      setType('expense');
      setRawAmount('');
      setDate(getCurrentDate());
      setKakeiboCategory('needs');
      setSubCategory('');
      setNote('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = cleanRupiahInput(rawAmount);
    if (amount <= 0) {
      alert('Nominal harus lebih dari 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(
        {
          type,
          amount,
          date,
          kakeiboCategory: type === 'expense' ? kakeiboCategory : undefined,
          subCategory: subCategory.trim() || (type === 'income' ? 'Pemasukan' : 'Lain-lain'),
          note: note.trim()
        },
        initialData?.id
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const amountNumber = cleanRupiahInput(rawAmount);

  return (
    <div className="fixed inset-0 z-50 bg-sumi/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-washi w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 shadow-xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <h3 className="font-serif font-bold text-lg text-sumi">
            {initialData ? 'Ubah Catatan' : 'Catat Transaksi'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                type === 'expense' ? 'bg-card text-hanko shadow-sm' : 'text-stone-500'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                type === 'income' ? 'bg-card text-matcha-dark shadow-sm' : 'text-stone-500'
              }`}
            >
              Pemasukan
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Nominal (Rupiah)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-sm">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="0"
                value={amountNumber > 0 ? amountNumber.toLocaleString('id-ID') : ''}
                onChange={(e) => setRawAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-stone-200 rounded-xl font-mono text-lg font-bold text-sumi focus:outline-none focus:ring-2 focus:ring-matcha"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Tanggal</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-card border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-matcha"
            />
          </div>

          {type === 'expense' && (
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                Kategori Kakeibo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'needs', label: '1. Needs (Kebutuhan)' },
                  { key: 'wants', label: '2. Wants (Keinginan)' },
                  { key: 'culture', label: '3. Culture (Wawasan)' },
                  { key: 'extra', label: '4. Extra (Tak Terduga)' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setKakeiboCategory(item.key as KakeiboCategory)}
                    className={`py-2 px-3 text-xs text-left rounded-xl border transition-all ${
                      kakeiboCategory === item.key
                        ? 'border-matcha-dark bg-matcha-light text-matcha-dark font-semibold'
                        : 'border-stone-200 bg-card text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Keterangan Singkat</label>
            <input
              type="text"
              placeholder={type === 'expense' ? 'Contoh: Makan Siang Warteg, Buku' : 'Contoh: Gaji Bulanan, Bonus'}
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-3 py-2 bg-card border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-matcha"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Catatan Tambahan (Opsional)</label>
            <textarea
              rows={2}
              placeholder="Catatan kecil..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-card border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-matcha resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-matcha-dark hover:bg-matcha text-washi rounded-xl font-medium text-sm transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan ke Buku Kas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
