import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/db';
import { requestPersistentStorage } from './db/storage';
import type { Transaction, MonthlyBudget, MonthlyReflection, KakeiboCategory } from './types';
import { getCurrentMonth } from './utils/date';

import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { PillarProgress } from './components/PillarProgress';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { ReflectionModal } from './components/ReflectionModal';
import { ReportsView } from './components/ReportsView';
import { BackupModal } from './components/BackupModal';
import { Plus } from 'lucide-react';

export const App: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonth());
  const [currentTab, setCurrentTab] = useState<'journal' | 'reports'>('journal');

  const [isTrxModalOpen, setIsTrxModalOpen] = useState(false);
  const [editingTrx, setEditingTrx] = useState<Transaction | null>(null);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const [isPersisted, setIsPersisted] = useState(false);
  const [storageInfo, setStorageInfo] = useState({ quotaUsedMB: 0, quotaTotalMB: 0 });

  useEffect(() => {
    requestPersistentStorage().then((info) => {
      setIsPersisted(info.isPersisted);
      setStorageInfo({
        quotaUsedMB: info.quotaUsedMB,
        quotaTotalMB: info.quotaTotalMB
      });
    });
  }, []);

  const transactions = useLiveQuery(
    () => db.transactions.orderBy('date').reverse().toArray(),
    []
  ) || [];

  const currentBudget = useLiveQuery(
    () => db.budgets.get(currentMonth),
    [currentMonth]
  );

  const currentReflection = useLiveQuery(
    () => db.reflections.get(currentMonth),
    [currentMonth]
  );

  const monthTransactions = transactions.filter((t) => t.date.startsWith(currentMonth));

  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const categoryTotals: Record<KakeiboCategory, number> = {
    needs: 0,
    wants: 0,
    culture: 0,
    extra: 0
  };

  for (const trx of monthTransactions) {
    if (trx.type === 'expense' && trx.kakeiboCategory) {
      categoryTotals[trx.kakeiboCategory] += trx.amount;
    }
  }

  const categoryBudgets: Record<KakeiboCategory, number> = {
    needs: currentBudget?.needs || 0,
    wants: currentBudget?.wants || 0,
    culture: currentBudget?.culture || 0,
    extra: currentBudget?.extra || 0
  };

  const totalBudget = Object.values(categoryBudgets).reduce((a, b) => a + b, 0);

  const handleSaveTransaction = async (
    data: Omit<Transaction, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      await db.transactions.update(existingId, data);
    } else {
      const newTrx: Transaction = {
        ...data,
        id: `trx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        createdAt: Date.now()
      };
      await db.transactions.add(newTrx);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    await db.transactions.delete(id);
  };

  const handleSaveBudget = async (budget: MonthlyBudget) => {
    await db.budgets.put(budget);
  };

  const handleSaveReflection = async (reflection: MonthlyReflection) => {
    await db.reflections.put(reflection);
  };

  return (
    <div className="min-h-screen pb-24 text-sumi flex flex-col">
      <Navbar
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
        onOpenNewTrx={() => {
          setEditingTrx(null);
          setIsTrxModalOpen(true);
        }}
        onOpenBudget={() => setIsBudgetOpen(true)}
        onOpenReflection={() => setIsReflectionOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isPersisted={isPersisted}
      />

      <main className="max-w-2xl mx-auto px-4 py-4 w-full flex-1 space-y-4">
        {currentTab === 'journal' ? (
          <>
            <SummaryCards
              income={totalIncome}
              expenses={totalExpenses}
              savingsGoal={currentBudget?.targetSavings || 0}
              totalBudget={totalBudget}
              onEditBudget={() => setIsBudgetOpen(true)}
            />

            <PillarProgress
              categoryTotals={categoryTotals}
              categoryBudgets={categoryBudgets}
            />

            <div className="pt-2">
              <TransactionList
                transactions={monthTransactions}
                onEdit={(trx) => {
                  setEditingTrx(trx);
                  setIsTrxModalOpen(true);
                }}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </>
        ) : (
          <ReportsView currentMonth={currentMonth} allTransactions={transactions} />
        )}
      </main>

      <button
        onClick={() => {
          setEditingTrx(null);
          setIsTrxModalOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 bg-matcha-dark hover:bg-matcha text-washi w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
        title="Catat Transaksi Baru"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      <TransactionModal
        isOpen={isTrxModalOpen}
        onClose={() => setIsTrxModalOpen(false)}
        onSave={handleSaveTransaction}
        initialData={editingTrx}
      />

      <BudgetModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        month={currentMonth}
        currentBudget={currentBudget}
        onSave={handleSaveBudget}
      />

      <ReflectionModal
        isOpen={isReflectionOpen}
        onClose={() => setIsReflectionOpen(false)}
        month={currentMonth}
        currentReflection={currentReflection}
        onSave={handleSaveReflection}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        isPersisted={isPersisted}
        storageInfo={storageInfo}
        onRefreshData={async () => {}}
      />
    </div>
  );
};
