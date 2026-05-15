"use client"

import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { usePathname, useRouter } from "next/navigation"

const PROTOTYPE_USERS: Record<string, { name: string; company: string; initials: string }> = {
  base:     { name: "Trường Phát",  company: "ZNSTest", initials: "TP" },
  phatnt11: { name: "PhatNT11",     company: "ZNSTest", initials: "P"  },
  viht2:    { name: "ViHT2",        company: "ZNSTest", initials: "V"  },
  hainlb:   { name: "HaiNLB",       company: "ZNSTest", initials: "H"  },
}

const ROOT_SECTIONS = new Set(["cong-cu", "chi-tieu", "cai-dat", "giao-dich", "bao-cao", ""])

export default function ZbsHeader({ standalone, inset }: { standalone?: boolean; inset?: boolean } = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const seg = pathname.split("/")[1] ?? ""
  const basePath = ROOT_SECTIONS.has(seg) ? "" : `/${seg}`
  const protoId = ROOT_SECTIONS.has(seg) ? "base" : seg
  const user = PROTOTYPE_USERS[protoId] ?? PROTOTYPE_USERS.base
  const homeHref = basePath === "" ? "/" : basePath

  // standalone = logo + sticky (dùng cho trang full-page như Nạp tiền)
  // inset      = logo + KHÔNG sticky (dùng khi nằm trong container overflow-hidden như GuiTinShell)
  const showLogo  = standalone || inset
  const isSticky  = standalone && !inset

  return (
    <header className={`flex h-14 items-center gap-3 border-b border-border bg-white px-4 shrink-0${isSticky ? " sticky top-[68px] z-40" : ""}`}>
      {showLogo && (
        <a href={homeHref} className="flex-shrink-0">
          <img src="/zbs-logo.svg" alt="Zalo Business Solutions" className="h-9 w-auto" />
        </a>
      )}

      <div className="flex-1" />

      {!showLogo && (
        <Button
          size="sm"
          className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm"
          onClick={() => router.push(`${basePath}/giao-dich/nap-tien`)}
        >
          <Wallet className="h-4 w-4" />
          Nạp tiền
        </Button>
      )}

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
