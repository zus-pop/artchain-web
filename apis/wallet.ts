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

export async function topupWallet(amount: number) {
  const response = await myAxios.post<WalletTopupResponse>(
    "/payments/wallet/topup",
    { amount } as WalletTopupRequest,
  );
  return response.data;
}
