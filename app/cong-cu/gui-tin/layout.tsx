"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, BarChart2, Zap, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ZbsHeader from "@/components/zbs-header"

const ROOT_SECTIONS = new Set(["cong-cu", "chi-tieu", "cai-dat", "giao-dich", "bao-cao", ""])

// Pages có standalone layout riêng — không wrap bằng gui-tin layout
const STANDALONE_ROUTES = ["/tao-moi", "/tao-template"]

function buildSections(basePath: string) {
  return [
    {
      label: "Báo cáo",
      icon: BarChart2,
      items: [
        { label: "Kết quả gửi tin SĐT", href: `${basePath}/cong-cu/gui-tin/bao-cao/ket-qua` },
        { label: "Chất lượng gửi tin SĐT", href: `${basePath}/cong-cu/gui-tin/chat-luong-gui-tin` },
      ],
    },
    {
      label: "Thiết kế nội dung",
      icon: Zap,
      items: [
        { label: "Thư viện Template", href: `${basePath}/cong-cu/gui-tin/thu-vien` },
        { label: "Quản lý Template", href: `${basePath}/cong-cu/gui-tin/quan-ly-template` },
        { label: "Quản lý Logo", href: `${basePath}/cong-cu/gui-tin/quan-ly-logo` },
      ],
    },
    {
      label: "Công cụ gửi tin SĐT",
      icon: Smartphone,
      items: [
        { label: "Gửi theo chiến dịch", href: `${basePath}/cong-cu/gui-tin/gui-theo-chien-dich` },
      ],
    },
  ]
}

export default function ZbsTemplateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Standalone pages — trả về children thẳng, không wrap layout
  if (STANDALONE_ROUTES.some((r) => pathname.endsWith(r))) {
    return <>{children}</>
  }

  return <GuiTinShell>{children}</GuiTinShell>
}

function GuiTinShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const seg = pathname.split("/")[1] ?? ""
  const basePath = ROOT_SECTIONS.has(seg) ? "" : `/${seg}`
  const secondarySections = buildSections(basePath)

  return (
    /* 100vh - 32px (PrototypeSwitcher) - 36px (GlobalHeader) */
    <div className="flex flex-col bg-white overflow-hidden" style={{ height: "calc(100vh - 68px)" }}>

      {/* ── Header — inset: logo + no-sticky (sticky phá layout trong overflow-hidden) ── */}
      <ZbsHeader inset />

      {/* ── Body: secondary sidebar + content ── */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[200px] shrink-0 bg-gray-50 border-r border-border flex flex-col overflow-y-auto">
          <div className="p-3">
            <Button
              className="w-full gap-2 bg-white border text-sm h-9 hover:bg-blue-50 shadow-sm"
              style={{ borderColor: "oklch(0.55 0.22 265)", color: "oklch(0.45 0.22 265)" }}
              variant="outline"
              asChild
            >
              <Link href={`${basePath}/cong-cu/gui-tin/tao-template`}>
                <Plus className="h-4 w-4" />
                Tạo Template
              </Link>
            </Button>
          </div>

          <nav className="flex-1 px-2 pb-4 space-y-4">
            {secondarySections.map((section) => (
              <div key={section.label}>
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-foreground">
                  <section.icon className="h-3.5 w-3.5" style={{ color: "oklch(0.55 0.22 265)" }} />
                  <span>{section.label}</span>
                </div>
                <div className="mt-0.5 space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-1.5 text-sm rounded-md transition-colors",
                          isActive
                            ? "font-medium border-l-2"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                        style={isActive ? {
                          background: "oklch(0.96 0.03 265)",
                          color: "oklch(0.45 0.22 265)",
                          borderColor: "oklch(0.55 0.22 265)",
                        } : undefined}
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

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
