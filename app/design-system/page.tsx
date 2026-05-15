"use client"

import { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, Copy, Edit2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

// ---- Design tokens ----

const colorGroups = [
  {
    group: "Brand",
    tokens: [
      { var: "--primary", light: "oklch(0.488 0.243 264.376)", desc: "Brand blue — buttons, active states, links" },
      { var: "--primary-foreground", light: "oklch(0.97 0.014 254.604)", desc: "Text trên primary background" },
      { var: "--destructive", light: "oklch(0.577 0.245 27.325)", desc: "Lỗi, nguy hiểm, xóa" },
    ],
  },
  {
    group: "Neutral",
    tokens: [
      { var: "--background", light: "oklch(1 0 0)", desc: "Nền trang" },
      { var: "--foreground", light: "oklch(0.141 0.005 285.823)", desc: "Text chính" },
      { var: "--muted", light: "oklch(0.967 0.001 286.375)", desc: "Nền disabled, placeholder" },
      { var: "--muted-foreground", light: "oklch(0.552 0.016 285.938)", desc: "Text phụ, nhãn" },
      { var: "--border", light: "oklch(0.92 0.004 286.32)", desc: "Viền, đường kẻ" },
      { var: "--input", light: "oklch(0.92 0.004 286.32)", desc: "Viền input" },
    ],
  },
  {
    group: "Surface",
    tokens: [
      { var: "--card", light: "oklch(1 0 0)", desc: "Nền card" },
      { var: "--secondary", light: "oklch(0.967 0.001 286.375)", desc: "Nút thứ cấp, tag background" },
      { var: "--accent", light: "oklch(0.967 0.001 286.375)", desc: "Hover state, accent nhẹ" },
      { var: "--popover", light: "oklch(1 0 0)", desc: "Dropdown, tooltip background" },
    ],
  },
  {
    group: "Sidebar",
    tokens: [
      { var: "--sidebar", light: "oklch(0.985 0 0)", desc: "Nền sidebar" },
      { var: "--sidebar-primary", light: "oklch(0.546 0.245 262.881)", desc: "Item đang active trong sidebar" },
      { var: "--sidebar-accent", light: "oklch(0.967 0.001 286.375)", desc: "Hover trong sidebar" },
      { var: "--sidebar-border", light: "oklch(0.92 0.004 286.32)", desc: "Viền sidebar" },
    ],
  },
  {
    group: "Charts",
    tokens: [
      { var: "--chart-1", light: "oklch(0.871 0.006 286.286)", desc: "Màu biểu đồ 1 (nhạt nhất)" },
      { var: "--chart-2", light: "oklch(0.552 0.016 285.938)", desc: "Màu biểu đồ 2" },
      { var: "--chart-3", light: "oklch(0.442 0.017 285.786)", desc: "Màu biểu đồ 3" },
      { var: "--chart-4", light: "oklch(0.37 0.013 285.805)", desc: "Màu biểu đồ 4" },
      { var: "--chart-5", light: "oklch(0.274 0.006 286.033)", desc: "Màu biểu đồ 5 (đậm nhất)" },
    ],
  },
]

const defaultTokens: Record<string, string> = {}
colorGroups.forEach((g) => g.tokens.forEach((t) => { defaultTokens[t.var] = t.light }))

const radiusScale = [
  { label: "sm", formula: "× 0.6", css: "--radius-sm" },
  { label: "md", formula: "× 0.8", css: "--radius-md" },
  { label: "lg (base)", formula: "× 1", css: "--radius" },
  { label: "xl", formula: "× 1.4", css: "--radius-xl" },
  { label: "2xl", formula: "× 1.8", css: "--radius-2xl" },
  { label: "3xl", formula: "× 2.2", css: "--radius-3xl" },
]

const typeScale = [
  { cls: "text-xs", px: "12px", weight: "400", usage: "Label, caption, micro copy" },
  { cls: "text-sm", px: "14px", weight: "400", usage: "Body text, table cell, form label" },
  { cls: "text-base", px: "16px", weight: "400", usage: "Standard body (hiếm dùng)" },
  { cls: "text-lg", px: "18px", weight: "600", usage: "Sub-heading" },
  { cls: "text-xl", px: "20px", weight: "600", usage: "Tiêu đề trang (h1)" },
  { cls: "text-2xl", px: "24px", weight: "600", usage: "Section header lớn" },
]

const SECTIONS = [
  { id: "colors", label: "Colors" },
  { id: "radius", label: "Border Radius" },
  { id: "typography", label: "Typography" },
  { id: "button", label: "Button" },
  { id: "badge", label: "Badge" },
  { id: "input", label: "Input" },
  { id: "select", label: "Select" },
  { id: "card", label: "Card" },
  { id: "table", label: "Table" },
  { id: "tabs", label: "Tabs" },
  { id: "avatar", label: "Avatar" },
  { id: "switch", label: "Switch" },
  { id: "separator", label: "Separator" },
  { id: "skeleton", label: "Skeleton" },
]

// ---- Component ----

export default function DesignSystemPage() {
  const [editing, setEditing] = useState(false)
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [radiusRem, setRadiusRem] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    Object.entries(overrides).forEach(([k, v]) => root.style.setProperty(k, v))
  }, [overrides])

  useEffect(() => {
    document.documentElement.style.setProperty("--radius", `${radiusRem}rem`)
  }, [radiusRem])

  function handleTokenChange(varName: string, value: string) {
    setOverrides((prev) => ({ ...prev, [varName]: value }))
    document.documentElement.style.setProperty(varName, value)
  }

  function resetAll() {
    const root = document.documentElement
    Object.keys(overrides).forEach((k) => root.style.removeProperty(k))
    root.style.setProperty("--radius", "0")
    setOverrides({})
    setRadiusRem(0)
    setEditing(false)
  }

  function copyCss() {
    const allTokens = { ...defaultTokens, ...overrides, "--radius": `${radiusRem}rem` }
    const lines = Object.entries(allTokens)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n")
    navigator.clipboard.writeText(`:root {\n${lines}\n}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getVal = (v: string) =>
    overrides[v] ?? defaultTokens[v] ?? ""

  const hasChanges = Object.keys(overrides).length > 0 || radiusRem !== 0

  return (
    <SidebarProvider>
      <ZbsSidebar />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 h-[calc(100vh-56px)] overflow-y-auto">
          <div className="flex">
            {/* Sticky TOC */}
            <aside className="hidden xl:block w-44 shrink-0 sticky top-0 self-start h-screen border-r border-border bg-white py-5 px-3 overflow-y-auto">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-2">
                Contents
              </div>
              <nav className="space-y-px">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-accent transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0 p-6 pb-20 space-y-14 max-w-4xl">

              {/* Page header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-xl font-semibold text-foreground">ZBS Design System</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Design tokens và components đang dùng trong toàn bộ prototype.
                    Chỉnh token ở đây để cascade xuống ngay.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {hasChanges && (
                    <>
                      <Button variant="outline" size="sm" onClick={copyCss}>
                        {copied ? (
                          <Check className="h-3.5 w-3.5 mr-1.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        {copied ? "Copied!" : "Copy CSS"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={resetAll}>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                        Reset
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant={editing ? "default" : "outline"}
                    onClick={() => setEditing((v) => !v)}
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                    {editing ? "Đang chỉnh sửa…" : "Chỉnh sửa token"}
                  </Button>
                </div>
              </div>

              {editing && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
                  Đang ở chế độ chỉnh sửa — thay đổi token sẽ cascade ngay xuống tất cả components bên dưới.
                  Nhấn <strong>Copy CSS</strong> để lấy code cập nhật vào{" "}
                  <code className="font-mono text-xs bg-primary/10 px-1 rounded">app/globals.css</code>.
                </div>
              )}

              {/* ============ COLORS ============ */}
              <section id="colors" className="scroll-mt-6 space-y-6">
                <SectionHeading>Colors</SectionHeading>
                {colorGroups.map((group) => (
                  <div key={group.group}>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      {group.group}
                    </div>
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {group.tokens.map((token) => (
                        <TokenSwatch
                          key={token.var}
                          varName={token.var}
                          value={getVal(token.var)}
                          desc={token.desc}
                          editing={editing}
                          onChange={handleTokenChange}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </section>

              {/* ============ BORDER RADIUS ============ */}
              <section id="radius" className="scroll-mt-6 space-y-5">
                <SectionHeading>Border Radius</SectionHeading>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm text-muted-foreground">Base radius</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={radiusRem}
                    onChange={(e) => setRadiusRem(parseFloat(e.target.value))}
                    className="w-48 accent-primary"
                  />
                  <span className="font-mono text-sm text-foreground w-16">
                    {radiusRem.toFixed(2)}rem
                  </span>
                </div>
                <div className="flex items-end gap-5 flex-wrap">
                  {radiusScale.map((r) => (
                    <div key={r.label} className="text-center">
                      <div
                        className="w-14 h-14 bg-primary"
                        style={{ borderRadius: `var(${r.css})` }}
                      />
                      <div className="text-[10px] font-mono text-foreground mt-1.5">{r.label}</div>
                      <div className="text-[10px] text-muted-foreground">{r.formula}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tất cả scale tính theo{" "}
                  <code className="font-mono bg-muted px-1 rounded">--radius</code> (base).
                  Đổi 1 biến cascade xuống toàn bộ. Cập nhật trong{" "}
                  <code className="font-mono bg-muted px-1 rounded">app/globals.css</code>.
                </p>
              </section>

              {/* ============ TYPOGRAPHY ============ */}
              <section id="typography" className="scroll-mt-6 space-y-4">
                <SectionHeading>Typography</SectionHeading>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-4 py-2 w-24">
                          Class
                        </th>
                        <th className="text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-4 py-2 w-14">
                          Size
                        </th>
                        <th className="text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-4 py-2">
                          Preview
                        </th>
                        <th className="text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-4 py-2">
                          Dùng cho
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {typeScale.map((t, i) => (
                        <tr
                          key={t.cls}
                          className={cn(
                            "border-b last:border-0 border-border",
                            i % 2 === 0 ? "bg-white" : "bg-muted/20"
                          )}
                        >
                          <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{t.cls}</td>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{t.px}</td>
                          <td className="px-4 py-2.5">
                            <span className={cn(t.cls)}>Văn bản mẫu</span>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{t.usage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="grid grid-cols-4 gap-3 max-w-lg">
                  {(
                    [
                      ["font-normal", "400"],
                      ["font-medium", "500"],
                      ["font-semibold", "600"],
                      ["font-bold", "700"],
                    ] as const
                  ).map(([cls, w]) => (
                    <div
                      key={cls}
                      className="border border-border rounded-lg p-3 text-center"
                    >
                      <div className={cn("text-base text-foreground", cls)}>Aa</div>
                      <div className="text-[10px] font-mono text-muted-foreground mt-1">{cls}</div>
                      <div className="text-[10px] text-muted-foreground">weight {w}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ============ BUTTON ============ */}
              <section id="button" className="scroll-mt-6 space-y-5">
                <SectionHeading>Button</SectionHeading>
                <ComponentBlock title="Variants">
                  <div className="flex flex-wrap gap-2">
                    {(["default", "outline", "secondary", "ghost", "destructive", "link"] as const).map(
                      (v) => (
                        <Button key={v} variant={v}>
                          {v}
                        </Button>
                      )
                    )}
                  </div>
                </ComponentBlock>
                <ComponentBlock title="Sizes">
                  <div className="flex flex-wrap items-end gap-2">
                    {(["xs", "sm", "default", "lg"] as const).map((s) => (
                      <Button key={s} size={s}>
                        Button {s}
                      </Button>
                    ))}
                    <Separator orientation="vertical" className="h-8 mx-1" />
                    {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((s) => (
                      <Button key={s} size={s} variant="outline" title={s}>
                        A
                      </Button>
                    ))}
                  </div>
                </ComponentBlock>
                <ComponentBlock title="States">
                  <div className="flex flex-wrap gap-2">
                    <Button>Normal</Button>
                    <Button disabled>Disabled</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="outline" disabled>
                      Outline Disabled
                    </Button>
                  </div>
                </ComponentBlock>
              </section>

              {/* ============ BADGE ============ */}
              <section id="badge" className="scroll-mt-6 space-y-4">
                <SectionHeading>Badge</SectionHeading>
                <ComponentBlock title="Variants">
                  <div className="flex flex-wrap gap-2 items-center">
                    {(["default", "secondary", "destructive", "outline", "ghost", "link"] as const).map(
                      (v) => (
                        <Badge key={v} variant={v}>
                          {v}
                        </Badge>
                      )
                    )}
                  </div>
                </ComponentBlock>
                <ComponentBlock title="Dùng trong ngữ cảnh">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="default">Active</Badge>
                    <Badge variant="secondary">Pending</Badge>
                    <Badge variant="outline">Draft</Badge>
                    <Badge variant="destructive">Error</Badge>
                    <Badge variant="secondary" className="text-[9px] h-4 px-1">
                      Beta
                    </Badge>
                  </div>
                </ComponentBlock>
              </section>

              {/* ============ INPUT ============ */}
              <section id="input" className="scroll-mt-6 space-y-4">
                <SectionHeading>Input</SectionHeading>
                <ComponentBlock>
                  <div className="grid grid-cols-2 gap-4 max-w-lg">
                    <Labeled label="Default">
                      <Input placeholder="Nhập giá trị..." />
                    </Labeled>
                    <Labeled label="Filled">
                      <Input defaultValue="Giá trị đã nhập" />
                    </Labeled>
                    <Labeled label="Disabled">
                      <Input disabled placeholder="Disabled" />
                    </Labeled>
                    <Labeled label="Invalid">
                      <Input aria-invalid="true" defaultValue="Giá trị không hợp lệ" />
                    </Labeled>
                  </div>
                </ComponentBlock>
              </section>

              {/* ============ SELECT ============ */}
              <section id="select" className="scroll-mt-6 space-y-4">
                <SectionHeading>Select</SectionHeading>
                <ComponentBlock>
                  <div className="flex flex-wrap gap-6">
                    <Labeled label="Default">
                      <Select>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Chọn một tùy chọn..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a">Tùy chọn A</SelectItem>
                          <SelectItem value="b">Tùy chọn B</SelectItem>
                          <SelectItem value="c">Tùy chọn C</SelectItem>
                        </SelectContent>
                      </Select>
                    </Labeled>
                    <Labeled label="Disabled">
                      <Select disabled>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Disabled..." />
                        </SelectTrigger>
                      </Select>
                    </Labeled>
                  </div>
                </ComponentBlock>
              </section>

              {/* ============ CARD ============ */}
              <section id="card" className="scroll-mt-6 space-y-4">
                <SectionHeading>Card</SectionHeading>
                <ComponentBlock>
                  <div className="grid grid-cols-2 gap-4 max-w-2xl">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tiêu đề card</CardTitle>
                        <CardDescription>Mô tả ngắn hỗ trợ bên dưới tiêu đề</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Nội dung card. Dùng để nhóm thông tin liên quan thành một khối.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Tổng chi tiêu</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-semibold">14,288,430 đ</div>
                        <div className="text-xs text-muted-foreground mt-1">Tháng 05 / 2026</div>
                        <Badge variant="secondary" className="mt-2">
                          +12.4% so tháng trước
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </ComponentBlock>
              </section>

              {/* ============ TABLE ============ */}
              <section id="table" className="scroll-mt-6 space-y-4">
                <SectionHeading>Table</SectionHeading>
                <ComponentBlock>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Template</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Ngày gửi</TableHead>
                          <TableHead className="text-right">Chi phí</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: "ZNS Thông báo đơn hàng", status: "active", date: "12/05/2026", cost: "2,500,000 đ" },
                          { name: "ZNS Khuyến mãi flash", status: "pending", date: "10/05/2026", cost: "800,000 đ" },
                          { name: "OA Tin tức sản phẩm", status: "inactive", date: "08/05/2026", cost: "1,200,000 đ" },
                        ].map((row) => (
                          <TableRow key={row.name}>
                            <TableCell className="font-medium text-sm">{row.name}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  row.status === "active"
                                    ? "default"
                                    : row.status === "pending"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {row.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{row.date}</TableCell>
                            <TableCell className="text-right text-sm font-medium">{row.cost}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ComponentBlock>
              </section>

              {/* ============ TABS ============ */}
              <section id="tabs" className="scroll-mt-6 space-y-4">
                <SectionHeading>Tabs</SectionHeading>
                <ComponentBlock title='variant="default"'>
                  <Tabs defaultValue="a">
                    <TabsList>
                      <TabsTrigger value="a">Ngày</TabsTrigger>
                      <TabsTrigger value="b">Tuần</TabsTrigger>
                      <TabsTrigger value="c">Tháng</TabsTrigger>
                    </TabsList>
                    <TabsContent value="a" className="text-sm text-muted-foreground pt-2">
                      Nội dung tab Ngày
                    </TabsContent>
                    <TabsContent value="b" className="text-sm text-muted-foreground pt-2">
                      Nội dung tab Tuần
                    </TabsContent>
                    <TabsContent value="c" className="text-sm text-muted-foreground pt-2">
                      Nội dung tab Tháng
                    </TabsContent>
                  </Tabs>
                </ComponentBlock>
                <ComponentBlock title='variant="line"'>
                  <Tabs defaultValue="a">
                    <TabsList variant="line">
                      <TabsTrigger value="a">Ngày</TabsTrigger>
                      <TabsTrigger value="b">Tuần</TabsTrigger>
                      <TabsTrigger value="c">Tháng</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </ComponentBlock>
              </section>

              {/* ============ AVATAR ============ */}
              <section id="avatar" className="scroll-mt-6 space-y-4">
                <SectionHeading>Avatar</SectionHeading>
                <ComponentBlock>
                  <div className="flex items-end gap-5 flex-wrap">
                    {[
                      { cls: "h-6 w-6", text: "6", label: "xs" },
                      { cls: "h-8 w-8", text: "8", label: "sm" },
                      { cls: "h-10 w-10", text: "10", label: "md" },
                      { cls: "h-12 w-12", text: "12", label: "lg" },
                      { cls: "h-16 w-16", text: "16", label: "xl" },
                    ].map((a) => (
                      <div key={a.label} className="text-center">
                        <Avatar className={a.cls}>
                          <AvatarFallback className="text-[10px]">NT</AvatarFallback>
                        </Avatar>
                        <div className="text-[10px] font-mono text-muted-foreground mt-1">{a.label}</div>
                        <div className="text-[10px] text-muted-foreground">{a.cls.split(" ")[0]}</div>
                      </div>
                    ))}
                  </div>
                </ComponentBlock>
              </section>

              {/* ============ SWITCH ============ */}
              <section id="switch" className="scroll-mt-6 space-y-4">
                <SectionHeading>Switch</SectionHeading>
                <ComponentBlock>
                  <div className="flex items-center gap-8">
                    <Labeled label="Off">
                      <Switch />
                    </Labeled>
                    <Labeled label="On">
                      <Switch defaultChecked />
                    </Labeled>
                    <Labeled label="Disabled off">
                      <Switch disabled />
                    </Labeled>
                    <Labeled label="Disabled on">
                      <Switch disabled defaultChecked />
                    </Labeled>
                  </div>
                </ComponentBlock>
              </section>

              {/* ============ SEPARATOR ============ */}
              <section id="separator" className="scroll-mt-6 space-y-4">
                <SectionHeading>Separator</SectionHeading>
                <ComponentBlock>
                  <div className="space-y-3 max-w-sm">
                    <div className="text-sm text-foreground">Nội dung phía trên</div>
                    <Separator />
                    <div className="text-sm text-foreground">Nội dung phía dưới</div>
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-sm text-muted-foreground">Trái</span>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="text-sm text-muted-foreground">Giữa</span>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="text-sm text-muted-foreground">Phải</span>
                    </div>
                  </div>
                </ComponentBlock>
              </section>

              {/* ============ SKELETON ============ */}
              <section id="skeleton" className="scroll-mt-6 space-y-4">
                <SectionHeading>Skeleton</SectionHeading>
                <ComponentBlock>
                  <div className="space-y-3 max-w-sm">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex items-center gap-3 mt-4">
                      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                    <Skeleton className="h-24 w-full rounded-lg mt-2" />
                  </div>
                </ComponentBlock>
              </section>

            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

// ---- Helper sub-components ----

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
      {children}
    </h2>
  )
}

function ComponentBlock({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-white p-4 space-y-2">
      {title && (
        <div className="text-xs font-mono text-muted-foreground mb-3">{title}</div>
      )}
      {children}
    </div>
  )
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      {children}
    </div>
  )
}

function TokenSwatch({
  varName,
  value,
  desc,
  editing,
  onChange,
}: {
  varName: string
  value: string
  desc: string
  editing: boolean
  onChange: (varName: string, value: string) => void
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div
        className="h-12 w-full transition-colors"
        style={{ background: `var(${varName})` }}
      />
      <div className="p-2 space-y-1">
        <div className="font-mono text-[10px] font-semibold text-foreground leading-tight break-all">
          {varName}
        </div>
        {editing ? (
          <input
            className="w-full text-[10px] font-mono border border-border rounded px-1 py-0.5 bg-background text-foreground focus:outline-none focus:border-primary"
            value={value}
            onChange={(e) => onChange(varName, e.target.value)}
          />
        ) : (
          <div className="font-mono text-[10px] text-muted-foreground leading-tight break-all">
            {value}
          </div>
        )}
        <div className="text-[10px] text-muted-foreground leading-tight">{desc}</div>
      </div>
    </div>
  )
}
