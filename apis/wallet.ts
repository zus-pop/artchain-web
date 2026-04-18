import myAxios from "@/lib/custom-axios";

export async function createWallet(accountId: string) {
  const response = await myAxios.post("/wallets/create", { accountId });
  return response.data;
}

export interface WalletTopupRequest {
  amount: number;
}

export interface WalletTopupResponse {
  paymentUrl?: string;
  checkoutUrl?: string;
  url?: string;
  message?: string;
  [key: string]: unknown;
}

export interface WalletTransaction {
  transactionId: string;
  userId: string;
  sponsorId: string | null;
  campaignId: string | null;
  amount: number;
  paymentDate: string;
  status: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  walletImpact: "DEBIT" | "CREDIT" | "NONE";
  signedAmount: number;
}

export interface WalletTransactionResponse {
  success: boolean;
  message: string;
  data: WalletTransaction[];
  summary: {
    totalTopupThisMonth: number;
    totalSpendThisMonth: number;
  };
  pagination: {
    page: string;
    limit: string;
    total: number;
    totalPages: number;
  };
}

export async function topupWallet(amount: number) {
  const response = await myAxios.post<WalletTopupResponse>(
    "/payments/wallet/topup",
    { amount } as WalletTopupRequest,
  );
  return response.data;
}

export async function getWalletTransactions(
  accountId: string,
  page: number = 1,
  limit: number = 10,
) {
  const response = await myAxios.get<WalletTransactionResponse>(
    `/wallets/${accountId}/transactions`,
    {
      params: { page, limit },
    },
  );
  return response.data;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  createdAt: string;
}

export async function addBankAccount(data: {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}) {
  const response = await myAxios.post("/wallets/bank-accounts", data);
  return response.data;
}

export async function getMyBankAccounts() {
  const response = await myAxios.get<{ data: BankAccount[] }>(
    "/wallets/bank-accounts/me",
  );
  return response.data;
}

export async function createWithdrawRequest(data: {
  amount: number;
  accountId: string;
}) {
  const response = await myAxios.post("/wallets/withdraw-requests", data);
  return response.data;
}

// STAFF APIs
export interface StaffWithdrawRequest {
  requestId: string;
  senderId: string;
  senderName: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankBranch?: string;
  createdAt: string;
  staffNote?: string;
  proofImageUrl?: string;
  rejectReason?: string;
  user: {
    userId: string;
    fullName: string;
  };
}

export async function getStaffWithdrawRequests(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const response = await myAxios.get<{
    data: StaffWithdrawRequest[];
    pagination: { total: number; totalPages: number };
  }>("/staff/wallet-withdraw-requests", { params });
  return response.data;
}

export async function getMyWithdrawRequests(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const response = await myAxios.get<{
    data: StaffWithdrawRequest[];
    pagination: { total: number; totalPages: number };
  }>("/wallets/withdraw-requests/me", { params });
  return response.data;
}

export async function approveWithdrawRequest(
  requestId: string,
  data: { proofImage?: File; proofImageUrl?: string; staffNote?: string },
) {
  const formData = new FormData();
  if (data.proofImage) formData.append("proofImage", data.proofImage);
  if (data.proofImageUrl) formData.append("proofImageUrl", data.proofImageUrl);
  if (data.staffNote) formData.append("staffNote", data.staffNote);

  const response = await myAxios.patch(
    `/staff/wallet-withdraw-requests/${requestId}/approve`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
}

export async function rejectWithdrawRequest(
  requestId: string,
  data: { rejectReason: string; staffNote?: string },
) {
  const response = await myAxios.patch(
    `/staff/wallet-withdraw-requests/${requestId}/reject`,
    data,
  );
  return response.data;
}

export async function deleteBankAccount(id: string) {
  const response = await myAxios.delete(`/wallets/bank-accounts/${id}`);
  return response.data;
}
