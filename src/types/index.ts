export type KakeiboCategory = 'needs' | 'wants' | 'culture' | 'extra';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  kakeiboCategory?: KakeiboCategory;
  subCategory: string;
  note: string;
  createdAt: number;
}

export interface MonthlyBudget {
  id: string;
  month: string;
  targetSavings: number;
  needs: number;
  wants: number;
  culture: number;
  extra: number;
  updatedAt: number;
}

export interface MonthlyReflection {
  id: string;
  month: string;
  q1IncomeFeedback: string;
  q2SavingsFeedback: string;
  q3SpendingFeedback: string;
  q4ImprovementPlan: string;
  updatedAt: number;
}

export interface BackupData {
  version: 1;
  exportedAt: string;
  app: 'kakeibo-local-first';
  data: {
    transactions: Transaction[];
    budgets: MonthlyBudget[];
    reflections: MonthlyReflection[];
  };
}
