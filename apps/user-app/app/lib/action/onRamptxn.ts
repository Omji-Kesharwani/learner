"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client";

 export default  async function OnRampTransactions(amount:number,provider:string){
  const session= await getServerSession(authOptions);
 const userId=session?.user.id;
 const token=(Math.random()*10000).toString();
 if(!userId)
 {
  return {
    message :"User not logged in !"
  }
 }
 await prisma.onRampTransaction.create({
  data:{
    userId:Number(userId),
    amount:amount,
  status:"Processing",
  startTime:new Date(),
  provider,
  token:token,
  }
 })
 return{
  message:"On ramp transaction added"
 }
 }