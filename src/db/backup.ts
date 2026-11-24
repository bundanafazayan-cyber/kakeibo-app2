import { db } from './db';
import type { BackupData } from '../types';

export async function exportKakeiboBackup(): Promise<void> {
  const transactions = await db.transactions.toArray();
  const budgets = await db.budgets.toArray();
  const reflections = await db.reflections.toArray();

  const backupObject: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'kakeibo-local-first',
    data: {
      transactions,
      budgets,
      reflections
    }
  };

  const jsonString = JSON.stringify(backupObject, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  const now = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `kakeibo-backup-${now}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function validateBackupFile(content: any): { valid: boolean; message: string; data?: BackupData } {
  if (!content || typeof content !== 'object') {
    return { valid: false, message: 'Format berkas tidak valid (bukan JSON).' };
  }

  if (content.app !== 'kakeibo-local-first' || content.version !== 1) {
    return { valid: false, message: 'Berkas bukan cadangan resmi aplikasi Kakeibo.' };
  }

  if (!content.data || !Array.isArray(content.data.transactions)) {
    return { valid: false, message: 'Struktur data transaksi rusak atau tidak ditemukan.' };
  }

  return { valid: true, message: 'Validasi berhasil.', data: content as BackupData };
}

export async function restoreKakeiboBackup(
  backup: BackupData,
  mode: 'replace' | 'merge' = 'replace'
): Promise<{ success: boolean; message: string }> {
  const currentTransactions = await db.transactions.toArray();
  const currentBudgets = await db.budgets.toArray();
  const currentReflections = await db.reflections.toArray();

  try {
    await db.transaction('rw', [db.transactions, db.budgets, db.reflections], async () => {
      if (mode === 'replace') {
        await db.transactions.clear();
        await db.budgets.clear();
        await db.reflections.clear();
      }

      for (const trx of backup.data.transactions) {
        await db.transactions.put(trx);
      }
      for (const bgt of backup.data.budgets || []) {
        await db.budgets.put(bgt);
      }
      for (const ref of backup.data.reflections || []) {
        await db.reflections.put(ref);
      }
    });

    return { success: true, message: 'Pemulihan data berhasil disimpan!' };
  } catch (error) {
    console.error('Pemulihan gagal, memulihkan snapshot semula...', error);
    await db.transactions.bulkPut(currentTransactions);
    await db.budgets.bulkPut(currentBudgets);
    await db.reflections.bulkPut(currentReflections);
    return { success: false, message: 'Gagal memulihkan data. Data lama Anda tetap utuh.' };
  }
}
