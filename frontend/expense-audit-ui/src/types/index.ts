export interface User {
  email: string;
  role: string;
  token: string;
}

export interface Expense {
  id: number;
  vendor: string;
  amount: number;
  category: string;
  submittedBy: string;
  submittedAt: string;
  isFlagged: boolean;
  flagReason?: string;
}

export interface CreateExpenseRequest {
  vendor: string;
  amount: number;
  category: string;
  submittedBy: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
}