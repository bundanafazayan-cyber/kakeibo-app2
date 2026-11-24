import Dexie, { type Table } from 'dexie';
import type { Transaction, MonthlyBudget, MonthlyReflection } from '../types';

export class KakeiboDatabase extends Dexie {
  transactions!: Table<Transaction, string>;
  budgets!: Table<MonthlyBudget, string>;
  reflections!: Table<MonthlyReflection, string>;

  constructor() {
    super('KakeiboDB');
    this.version(1).stores({
      transactions: 'id, type, date, kakeiboCategory, createdAt',
      budgets: 'id, month',
      reflections: 'id, month'
    });
  }
}

export const db = new KakeiboDatabase();
