"use client"
import { Card } from "@repo/ui/card"
import {Center} from "../../../packages/ui/src/Center"
import { TextInput } from "@repo/ui/textinput"
import { useState } from "react"
import { Button } from "@repo/ui/button"
import { p2pTransfer } from "../app/lib/action/p2pTransfer"
import { useRouter } from "next/navigation"
export function SendCard(){
  const [number,setNumber]=useState("");
  const[amount,setAmount]=useState("");
  const router=useRouter();
  return <div className="h-[90vh]">
    <Center>
      <Card title="Send">
        <div className="min-w-72 pt-2">
          <TextInput placeholder={"Number"} label="Number" onChange={(value)=> setNumber(value)}/>
          <TextInput placeholder={"Amount"} label="Amount" onChange={(value)=> setAmount(value)}/>
            <div className="pt-4 flex justify-center">
              <Button onClick={async ()=>{
                await p2pTransfer(number,Number(amount)*100)
                router.push('/transfer')
              }}>Send</Button>
            </div>
        </div>
      </Card>
    </Center>
  </div>
}