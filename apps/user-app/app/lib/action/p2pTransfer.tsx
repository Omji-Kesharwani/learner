"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  try {
    const session = await getServerSession(authOptions);
    const fromUser= session?.user;
    const fromUserId=Number(fromUser?.id)
    
    if (!fromUserId) {
      return {
        message: "Error while sending: User not authenticated."
      };
    }
    
    const toUser = await prisma.user.findFirst({
      where: {
        number: to
      }
    });
    
    if (!toUser) {
      return {
        message: "User not found"
      };
    }

    // Check if 'from' and 'to' balances exist
    const fromBalance = await prisma.balance.findUnique({
      where: {
        userId: fromUserId
      }
    });
    
    if (!fromBalance) {
      return {
        message: "Sender balance not found"
      };
    }
    
    if (fromBalance.amount < amount) {
      return {
        message: "Insufficient funds"
      };
    }
    
    // Transaction for updating balances
    await prisma.$transaction(async (txn) => {
      await txn.$queryRaw`SELECT * FROM  "Balance" WHERE "userId"=${fromUserId} FOR UPDATE`;
      const toBalance = await txn.balance.findUnique({
        where: {
          userId: toUser.id
        }
      });

      if (!toBalance) {
        throw new Error('Recipient balance record not found');
      }
      
      await txn.balance.update({
        where: {
          userId: fromUserId
        },
        data: {
          amount: {
            decrement: amount
          }
        }
      });

      await txn.balance.update({
        where: {
          userId: toUser.id
        },
        data: {
          amount: {
            increment: amount
          }
        }
      });
      await txn.p2pTransfer.create({
        data:{
          fromUser,
          fromUserId:fromUserId,
          toUserId:toUser.id,
          amount,
          timestamp:new Date()
        }
      })

    });
    
    return {
      message: "Transfer successful"
    };
  } catch (error) {
    console.error("Error in p2pTransfer:", error);
    return {
      message: "An error occurred during the transfer"
    };
  }
}
