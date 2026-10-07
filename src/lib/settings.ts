import { prisma } from "./prisma";

export interface BankPaymentSettings {
  upiId: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  accountType: string;
  branch: string;
  instructions: string;
  razorpayKeyId: string;
  razorpayEnabled: boolean;
  directBankEnabled: boolean;
  codEnabled: boolean;
}

export const DEFAULT_PAYMENT_SETTINGS: BankPaymentSettings = {
  upiId: "zeztypickles@okaxis",
  accountHolderName: "Zezty Pickles Handcrafted Foods",
  accountNumber: "50200084729184",
  bankName: "HDFC Bank",
  ifscCode: "HDFC0001234",
  accountType: "Current Account",
  branch: "MG Road, Kochi, Kerala",
  instructions: "Scan the QR code or transfer to our direct bank account below. Enter your 12-digit UTR/UPI reference number to immediately confirm your order.",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_Tl05XPZnqWHlxe",
  razorpayEnabled: true,
  directBankEnabled: true,
  codEnabled: true,
};

export async function getPaymentSettings(): Promise<BankPaymentSettings> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          startsWith: "payment_",
        },
      },
    });

    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return {
      upiId: settingsMap["payment_upi_id"] || DEFAULT_PAYMENT_SETTINGS.upiId,
      accountHolderName: settingsMap["payment_account_holder_name"] || DEFAULT_PAYMENT_SETTINGS.accountHolderName,
      accountNumber: settingsMap["payment_account_number"] || DEFAULT_PAYMENT_SETTINGS.accountNumber,
      bankName: settingsMap["payment_bank_name"] || DEFAULT_PAYMENT_SETTINGS.bankName,
      ifscCode: settingsMap["payment_ifsc_code"] || DEFAULT_PAYMENT_SETTINGS.ifscCode,
      accountType: settingsMap["payment_account_type"] || DEFAULT_PAYMENT_SETTINGS.accountType,
      branch: settingsMap["payment_branch"] || DEFAULT_PAYMENT_SETTINGS.branch,
      instructions: settingsMap["payment_instructions"] || DEFAULT_PAYMENT_SETTINGS.instructions,
      razorpayKeyId: settingsMap["payment_razorpay_key_id"] || process.env.RAZORPAY_KEY_ID || DEFAULT_PAYMENT_SETTINGS.razorpayKeyId,
      razorpayEnabled: settingsMap["payment_razorpay_enabled"] !== "false",
      directBankEnabled: settingsMap["payment_direct_bank_enabled"] !== "false",
      codEnabled: settingsMap["payment_cod_enabled"] !== "false",
    };
  } catch (error) {
    console.error("Failed to load payment settings:", error);
    return DEFAULT_PAYMENT_SETTINGS;
  }
}

export async function updatePaymentSettings(settings: Partial<BankPaymentSettings>): Promise<void> {
  const updates: Array<{ key: string; value: string }> = [];

  if (settings.upiId !== undefined) updates.push({ key: "payment_upi_id", value: settings.upiId });
  if (settings.accountHolderName !== undefined) updates.push({ key: "payment_account_holder_name", value: settings.accountHolderName });
  if (settings.accountNumber !== undefined) updates.push({ key: "payment_account_number", value: settings.accountNumber });
  if (settings.bankName !== undefined) updates.push({ key: "payment_bank_name", value: settings.bankName });
  if (settings.ifscCode !== undefined) updates.push({ key: "payment_ifsc_code", value: settings.ifscCode });
  if (settings.accountType !== undefined) updates.push({ key: "payment_account_type", value: settings.accountType });
  if (settings.branch !== undefined) updates.push({ key: "payment_branch", value: settings.branch });
  if (settings.instructions !== undefined) updates.push({ key: "payment_instructions", value: settings.instructions });
  if (settings.razorpayKeyId !== undefined) updates.push({ key: "payment_razorpay_key_id", value: settings.razorpayKeyId });
  if (settings.razorpayEnabled !== undefined) updates.push({ key: "payment_razorpay_enabled", value: String(settings.razorpayEnabled) });
  if (settings.directBankEnabled !== undefined) updates.push({ key: "payment_direct_bank_enabled", value: String(settings.directBankEnabled) });
  if (settings.codEnabled !== undefined) updates.push({ key: "payment_cod_enabled", value: String(settings.codEnabled) });

  for (const item of updates) {
    await prisma.siteSetting.upsert({
      where: { key: item.key },
      create: { key: item.key, value: item.value },
      update: { value: item.value },
    });
  }
}
