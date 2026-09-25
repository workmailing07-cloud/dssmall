import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/lib/models/Transaction";
import { getActiveDepositAddress } from "@/lib/services/server/deposit-address.server";

// Returns the active deposit address for the current user.
// User-specific address takes priority over the global one.
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(session.user as any).id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const userId = (session.user as any).id;

        const pendingDeposit = await Transaction.findOne({
            userId,
            type: "DEPOSIT",
            status: "PENDING",
        }).sort({ createdAt: -1 }).lean();

        if (pendingDeposit?.depositAddress) {
            const current = await getActiveDepositAddress(userId);
            return NextResponse.json({
                address: pendingDeposit.depositAddress,
                network: pendingDeposit.depositNetwork || current.network,
            });
        }

        return NextResponse.json(await getActiveDepositAddress(userId));
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
}
