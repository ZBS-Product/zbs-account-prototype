"use client"

import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function ZbsHeader() {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-white px-4 shrink-0">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="flex-1" />

      <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm">
        <Wallet className="h-4 w-4" />
        Nạp tiền
      </Button>

      <div className="flex items-center gap-2 pl-2 border-l border-border ml-1">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">HH</AvatarFallback>
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium">Hoàng Thu Hà</span>
          <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">Cty TNHH Tên rất dài...</span>
        </div>
      </div>
    </header>
  )
}
