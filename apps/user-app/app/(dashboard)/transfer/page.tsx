"use server"

import { getServerSession } from "next-auth"
import { authOptions} from "../../../app/lib/auth"
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
import { AddMoney } from "../../../components/AddMoneyCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";


async function getBalance() {
  try {
    const session = await getServerSession(authOptions);
    console.log(session)
    if (!session?.user?.id) {
      throw new Error("User ID not found in session");
    }

    const userId = Number(session.user.id);
    
    const balance = await prisma.balance.findFirst({
      where: {
        userId: userId
      }
    });
    console.log(balance);
    
    return {
     balance
    };
  } catch (error) {
    console.error("Error in getBalance:", error);
    return {
      amount: 0,
      locked: 0
    };
  }
}

async function getOnRampTransaction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("User ID not found in session");
    }

    const userId = Number(session.user.id);
    
    const txns = await prisma.onRampTransaction.findMany({
      where: {
        userId: userId
      }
    });
    console.log(txns);
    return txns.map(t => ({
      time: t.startTime,
      amount: t.amount,
      status: t.status,
      provider: t.provider
    }));
  } catch (error) {
    console.error("Error in getOnRampTransaction:", error);
    return [];
  }
}
export default async function()
{
  const balance=await getBalance();
  const transactions=await getOnRampTransaction();
  return <div className="w-screen ">
    <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
      Transfer
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <div>
        <AddMoney/>
      </div>
      <div>
        <BalanceCard amount={balance?.amount||0} locked={balance?.locked||0}/>
        <div className="pt-4">
          <OnRampTransactions transactions={transactions}/>
        </div>

      </div>
    </div>
  </div>
}