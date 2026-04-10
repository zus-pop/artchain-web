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
