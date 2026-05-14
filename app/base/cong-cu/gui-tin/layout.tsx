"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, Bell, Plus, BarChart2, Zap, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const secondarySections = [
  {
    label: "Báo cáo",
    icon: BarChart2,
    items: [
      { label: "Kết quả gửi tin SĐT", href: "/base/cong-cu/gui-tin/bao-cao/ket-qua" },
      { label: "Chất lượng gửi tin SĐT", href: "/base/cong-cu/gui-tin/bao-cao/chat-luong" },
    ],
  },
  {
    label: "Thiết kế nội dung",
    icon: Zap,
    items: [
      { label: "Thư viện Template", href: "/base/cong-cu/gui-tin/thu-vien" },
      { label: "Quản lý Template", href: "/base/cong-cu/gui-tin/quan-ly-template" },
      { label: "Quản lý Logo", href: "/base/cong-cu/gui-tin/quan-ly-logo" },
    ],
  },
  {
    label: "Công cụ gửi tin SĐT",
    icon: Smartphone,
    items: [
      { label: "Gửi theo chiến dịch", href: "/base/cong-cu/gui-tin/chien-dich" },
    ],
  },
]

export default function ZbsTemplateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex h-14 items-center gap-3 border-b border-border bg-white px-4 shrink-0 z-10">
        <Link href="/base" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        {/* ZBS Template Message logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
            <span className="text-xs font-bold text-white">Z</span>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-blue-600">ZBS</span>
              <span className="text-[10px] text-muted-foreground font-medium">Template</span>
            </div>
            <span className="text-[10px] text-muted-foreground leading-tight">Message</span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Bell */}
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-border ml-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=phat" />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">TP</AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium">Trường Phát</span>
            <span className="text-[11px] text-muted-foreground">ZNSTest</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Secondary sidebar */}
        <aside className="w-[200px] shrink-0 bg-white border-r border-border flex flex-col overflow-y-auto">
          {/* Tạo Template button */}
          <div className="p-3">
            <Button className="w-full gap-2 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 text-sm h-9" variant="outline">
              <Plus className="h-4 w-4" />
              Tạo Template
            </Button>
          </div>

          <nav className="flex-1 px-2 pb-4 space-y-4">
            {secondarySections.map((section) => (
              <div key={section.label}>
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-foreground">
                  <section.icon className="h-3.5 w-3.5 text-blue-600" />
                  <span>{section.label}</span>
                </div>
                <div className="mt-0.5 space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-1.5 text-sm rounded-md transition-colors",
                          isActive
                            ? "bg-blue-50 text-blue-600 font-medium border-l-2 border-blue-600"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
