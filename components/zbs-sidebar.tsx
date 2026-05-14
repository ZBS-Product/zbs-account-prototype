"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Wrench,
  Receipt,
  Settings,
  ExternalLink,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const navSections = [
  {
    label: "Chi tiêu",
    icon: BarChart3,
    items: [
      { label: "Tổng quan", href: "/" },
      { label: "Chi tiêu tin Template", href: "/chi-tieu/tin-template" },
      { label: "Chi tiêu OA", href: "/chi-tieu/oa" },
      { label: "Quản lý Ngân Sách", href: "/chi-tieu/ngan-sach", badge: "Beta" },
    ],
  },
  {
    label: "Công cụ",
    icon: Wrench,
    items: [
      { label: "Dịch vụ gửi tin", href: "/cong-cu/gui-tin" },
      { label: "Dịch vụ OA", href: "/cong-cu/oa", external: true },
    ],
  },
  {
    label: "Giao dịch",
    icon: Receipt,
    items: [
      { label: "Lịch sử giao dịch", href: "/giao-dich/lich-su" },
      { label: "Quản lý hóa đơn", href: "/giao-dich/hoa-don" },
    ],
  },
  {
    label: "Cài đặt",
    icon: Settings,
    items: [
      { label: "Thông tin tài khoản", href: "/cai-dat/tai-khoan" },
      { label: "Quản lý tài sản", href: "/cai-dat/tai-san" },
      { label: "Quản lý thành viên", href: "/cai-dat/thanh-vien" },
      { label: "Quản lý thông báo", href: "/cai-dat/thong-bao" },
    ],
  },
]

export default function ZbsSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border bg-gray-50" style={{ width: 220 }}>
      <SidebarHeader className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
            <span className="text-xs font-bold text-white">Z</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-blue-600">Zalo</span>
            <span className="text-[10px] text-muted-foreground leading-tight">Business Solutions</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {navSections.map((section) => (
          <SidebarGroup key={section.label} className="px-2 py-1">
            <SidebarGroupLabel className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <section.icon className="h-3 w-3" />
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                          isActive
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "text-foreground hover:bg-accent"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-2 w-full">
                          <span className="flex-1">{item.label}</span>
                          {"badge" in item && item.badge && (
                            <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">
                              {item.badge}
                            </Badge>
                          )}
                          {"external" in item && item.external && (
                            <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
