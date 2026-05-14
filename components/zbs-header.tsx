"use client"

import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"

const PROTOTYPE_USERS: Record<string, { name: string; company: string; initials: string }> = {
  base:     { name: "Trường Phát",  company: "ZNSTest", initials: "TP" },
  phatnt11: { name: "PhatNT11",     company: "ZNSTest", initials: "P"  },
  viht2:    { name: "ViHT2",        company: "ZNSTest", initials: "V"  },
  hainlb:   { name: "HaiNLB",       company: "ZNSTest", initials: "H"  },
}

export default function ZbsHeader() {
  const pathname = usePathname()
  const protoId = pathname.split("/")[1] ?? "base"
  const user = PROTOTYPE_USERS[protoId] ?? PROTOTYPE_USERS.base

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-white px-4 shrink-0">
      <div className="flex-1" />

      <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm">
        <Wallet className="h-4 w-4" />
        Nạp tiền
      </Button>

      <div className="flex items-center gap-2 pl-2 border-l border-border ml-1">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
            {user.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">{user.company}</span>
        </div>
      </div>
    </header>
  )
}
