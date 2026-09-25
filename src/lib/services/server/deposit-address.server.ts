import dbConnect from "@/lib/mongodb";
import DepositAddress from "@/lib/models/DepositAddress";

export const DEPOSIT_NETWORKS = [
    "TRON (TRC-20)",
    "Ethereum (ERC-20)",
    "BNB Chain (BEP-20)",
] as const;

export type DepositNetwork = (typeof DEPOSIT_NETWORKS)[number];

export function validateDepositAddress(address: string, network: string): string {
    const value = String(address || "").trim();
    const normalizedNetwork = String(network || "").trim();

    if (!value) throw new Error("Deposit address is not configured");
    if (!DEPOSIT_NETWORKS.includes(normalizedNetwork as DepositNetwork)) {
        throw new Error("Unsupported deposit network");
    }

    const valid = normalizedNetwork === "TRON (TRC-20)"
        ? /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(value)
        : /^0x[a-fA-F0-9]{40}$/.test(value);

    if (!valid) throw new Error("Invalid deposit address for selected network");
    return value;
}

export async function getActiveDepositAddress(userId: string) {
    await dbConnect();

    const userAddress = await DepositAddress.findOne({
        userId,
        isActive: true,
    }).sort({ createdAt: -1 }).lean();

    const globalAddress = userAddress || await DepositAddress.findOne({
        userId: null,
        isActive: true,
    }).sort({ createdAt: -1 }).lean();

    if (!globalAddress) throw new Error("Deposit address is not configured");

    return {
        address: validateDepositAddress(globalAddress.address, globalAddress.network),
        network: globalAddress.network as DepositNetwork,
    };
}
