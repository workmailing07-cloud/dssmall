import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
<<<<<<< HEAD
import dbConnect from "@/lib/mongodb";
import Transaction from "@/lib/models/Transaction";
import { getActiveDepositAddress } from "@/lib/services/server/deposit-address.server";
=======
>>>>>>> 73cd97637b2d5838ed20978792d0f26eb5347296

const CUSTOMER_DEPOSIT_ADDRESS =
    "TAhBdywfRAbxUjxYNdCEVMb6oyyzcAMiuq";

const CUSTOMER_DEPOSIT_NETWORK =
    "TRON (TRC-20)";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(session.user as any)?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Customer-facing deposit address.
        // Admin-managed DepositAddress records are NOT queried here.
        return NextResponse.json(
            {
                address: CUSTOMER_DEPOSIT_ADDRESS,
                network: CUSTOMER_DEPOSIT_NETWORK,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate, proxy-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            }
        );
    } catch (error) {
        console.error("Customer deposit address error:", error);

<<<<<<< HEAD
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
=======
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
>>>>>>> 73cd97637b2d5838ed20978792d0f26eb5347296
    }
}
