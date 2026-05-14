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

interface NavChild {
  label: string
  href: string
}

interface NavItem {
  label: string
  href: string
  badge?: string
  external?: boolean
  children?: NavChild[]
}

const navSections = [
  {
    label: "Chi tiêu",
    icon: BarChart3,
    items: [
      { label: "Tổng quan", href: "/" },
      { label: "Chi tiêu tin Template", href: "/chi-tieu/tin-template" },
      { label: "Chi tiêu OA", href: "/chi-tieu/oa" },
      { label: "Quản lý Ngân Sách", href: "/chi-tieu/ngan-sach", badge: "Beta" },
    ] as NavItem[],
  },
  {
    label: "Công cụ",
    icon: Wrench,
    items: [
      {
        label: "Dịch vụ gửi tin",
        href: "/cong-cu/gui-tin",
        children: [
          { label: "Chất lượng gửi tin SĐT", href: "/cong-cu/gui-tin/chat-luong-gui-tin" },
          { label: "Quản lý Logo", href: "/cong-cu/gui-tin/quan-ly-logo" },
          { label: "Gửi theo chiến dịch", href: "/cong-cu/gui-tin/gui-theo-chien-dich" },
        ],
      },
      { label: "Dịch vụ OA", href: "/cong-cu/oa", external: true },
    ] as NavItem[],
  },
  {
    label: "Giao dịch",
    icon: Receipt,
    items: [
      { label: "Lịch sử giao dịch", href: "/giao-dich/lich-su" },
      { label: "Quản lý hóa đơn", href: "/giao-dich/hoa-don" },
    ] as NavItem[],
  },
  {
    label: "Cài đặt",
    icon: Settings,
    items: [
      { label: "Thông tin tài khoản", href: "/cai-dat/tai-khoan" },
      { label: "Quản lý tài sản", href: "/cai-dat/tai-san" },
      { label: "Quản lý thành viên", href: "/cai-dat/thanh-vien" },
      { label: "Quản lý thông báo", href: "/cai-dat/thong-bao" },
    ] as NavItem[],
  },
]

export default function ZbsSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border bg-gray-50" style={{ width: 220 }}>
      <SidebarHeader className="px-4 py-3 border-b border-border">
        <img src="/zbs-logo.svg" alt="Zalo Business Solutions" className="h-10 w-auto" />
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
                  const hasActiveChild = item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href))
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

                      {/* Sub-items */}
                      {item.children && (
                        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border pl-3">
                          {item.children.map((child) => {
                            const childActive = pathname === child.href || pathname.startsWith(child.href + "/")
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "flex w-full items-center rounded-md px-2 py-1 text-xs transition-colors",
                                  childActive
                                    ? "bg-blue-600 text-white"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                              >
                                {child.label}
                              </Link>
                            )
                          })}
                        </div>
                      )}
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
