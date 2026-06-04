"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Check, X, Info, Plus, Trash2, Bell,
  ChevronDown, ChevronUp, Edit2, ShieldCheck, Star,
  FileText, Ticket, Tag, Image as ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// ── Data ──────────────────────────────────────────────────────────────────────

const APPS = ["QC Test ZNS 1", "QC Test ZNS 3", "QC Test ZNS 4", "Test ZBS App", "ZNS Service", "Sarimi Runner"]
const OAS  = ["Qc Test ZNS 4", "ZBS Test OA", "Zalo Business Solutions", "QC OA 1", "Test ZNS", "ZBS Account"]

const TEMPLATE_TYPES = [
  { id: "tuy-chinh", icon: Edit2,       label: "Mẫu tuỳ chỉnh",          price: "Từ 210đ/tin" },
  { id: "xac-thuc",  icon: ShieldCheck, label: "Mẫu xác thực",            price: "Từ 280đ/tin" },
  { id: "danh-gia",  icon: Star,        label: "Mẫu đánh giá dịch vụ",    price: "Từ 210đ/tin" },
  { id: "thanh-toan",icon: FileText,    label: "Mẫu yêu cầu thanh toán",  price: "Từ 210đ/tin" },
  { id: "voucher",   icon: Ticket,      label: "Mẫu Voucher",              price: "Từ 280đ/tin" },
]

const PURPOSES = [
  { id: "cap1", level: "Cấp độ 1", sub: "Giao dịch" },
  { id: "cap2", level: "Cấp độ 2", sub: "Chăm sóc khách hàng" },
  { id: "cap3", level: "Cấp độ 3", sub: "Hậu mãi" },
]

const BUTTON_GROUPS = [
  {
    group: "ĐẾN TÀI SẢN CỦA DOANH NGHIỆP TRÊN HỆ SINH THÁI ZALO",
    options: [
      { id: "oa-info",   label: "Đến trang thông tin OA (+0đ)",                              desc: "Truy cập trang thông tin chính thức của OA trên Zalo" },
      { id: "mini-app",  label: "Đến ứng dụng Zalo Mini App của Doanh nghiệp (+0/100đ)",    desc: "Truy cập Mini App của doanh nghiệp trên Zalo" },
      { id: "oa-post",   label: "Đến bài viết của OA (+0/100đ)",                             desc: "Truy cập bài viết của doanh nghiệp trên Zalo" },
    ],
  },
  {
    group: "ĐẾN CÁC DỊCH VỤ KHÁC",
    options: [
      { id: "web",     label: "Đến trang của doanh nghiệp (+100đ)",            desc: "Truy cập trang web của doanh nghiệp (có tên miền giống tên OA)" },
      { id: "invoice", label: "Đến trang tra cứu hoá đơn điện tử (+100đ)",    desc: "Tra cứu hoá đơn điện tử" },
    ],
  },
]

const TECH_SETTINGS = [
  "Tên khách hàng (30)",
  "Tên sản phẩm / Thương hiệu (200)",
  "Mã đơn hàng (50)",
  "Số tiền (20)",
  "Trạng thái (50)",
  "Ngày tháng (30)",
  "URL (500)",
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getButtonLabel(id: string) {
  for (const g of BUTTON_GROUPS) {
    const found = g.options.find((o) => o.id === id)
    if (found) return found.label
  }
  return ""
}

// ── StepIndicator ─────────────────────────────────────────────────────────────

function StepIndicator({ step, label, status }: { step: number; label: string; status: "done" | "active" | "upcoming" }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors
        ${status === "done"     ? "border-blue-600 bg-blue-600 text-white" :
          status === "active"   ? "border-blue-600 text-blue-600 bg-white" :
                                  "border-gray-300 text-gray-400 bg-white"}`}
      >
        {status === "done" ? <Check className="h-3 w-3" /> : step}
      </div>
      <span className={`text-sm ${status === "upcoming" ? "text-muted-foreground" : "text-foreground"} ${status === "active" ? "font-semibold" : ""}`}>
        {label}
      </span>
    </div>
  )
}

// ── TemplatePreview ────────────────────────────────────────────────────────────

function TemplatePreview({ darkMode, headingText, bodyText, tableRows, buttonText }: {
  darkMode: boolean
  headingText: string
  bodyText: string
  tableRows: { title: string; value: string }[]
  buttonText: string
}) {
  const bg     = darkMode ? "oklch(0.15 0 0)"  : "oklch(0.99 0 0)"
  const text   = darkMode ? "white"             : "oklch(0.15 0 0)"
  const border = darkMode ? "oklch(0.3 0 0)"   : "oklch(0.9 0 0)"
  const rowAlt = darkMode ? "oklch(0.22 0 0)"  : "oklch(0.97 0 0)"

  return (
    <div className="rounded-xl border overflow-hidden text-sm" style={{ background: bg, borderColor: border, color: text }}>
      <div className="px-4 pt-4 pb-2">
        <div className="h-8 rounded flex items-center justify-center mb-3 px-2" style={{ background: darkMode ? "oklch(0.2 0 0)" : "oklch(0.95 0.02 40)", width: "fit-content", minWidth: 80 }}>
          <span className="text-xs font-bold" style={{ color: darkMode ? "oklch(0.8 0.2 45)" : "oklch(0.5 0.2 45)" }}>ATP SOFTWARE</span>
        </div>
        <p className="font-semibold text-sm mb-1.5">Xin chào &lt;customer_name&gt;,</p>
        <p className="text-xs leading-relaxed mb-2 opacity-80">{headingText}</p>
        <p className="text-xs leading-relaxed mb-3 opacity-80">{bodyText}</p>
      </div>
      {tableRows.length > 0 && (
        <div className="mx-4 mb-3 rounded overflow-hidden border" style={{ borderColor: border }}>
          {tableRows.map((r, i) => (
            <div key={i} className="flex text-xs" style={{ background: i % 2 === 1 ? rowAlt : "transparent", borderTop: i > 0 ? `1px solid ${border}` : undefined }}>
              <div className="w-1/2 px-2.5 py-1.5 font-medium">{r.title}</div>
              <div className="w-1/2 px-2.5 py-1.5 opacity-70">{r.value}</div>
            </div>
          ))}
        </div>
      )}
      {buttonText && (
        <div className="px-4 pb-4">
          <button className="w-full rounded py-2 text-sm font-medium text-white" style={{ background: "oklch(0.488 0.243 264.376)" }}>
            {buttonText}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TaoTemplatePage() {
  const [step, setStep] = useState(1)

  // Step 1
  const [templateName, setTemplateName] = useState("Test Template")
  const [selectedApp,  setSelectedApp]  = useState("QC Test ZNS 4")
  const [selectedOA,   setSelectedOA]   = useState("Qc Test ZNS 4")

  // Step 2
  const [templateType,       setTemplateType]       = useState("tuy-chinh")
  const [purpose,            setPurpose]            = useState("cap1")
  const [darkMode,           setDarkMode]           = useState(false)
  const [logoOpen,           setLogoOpen]           = useState(true)
  const [contentOpen,        setContentOpen]        = useState(true)
  const [buttonOpen,         setButtonOpen]         = useState(true)
  const [headingText,        setHeadingText]        = useState("Cảm ơn bạn đã mua sản phẩm <product_name> tại cửa hàng chúng tôi.")
  const [bodyText,           setBodyText]           = useState("Chúng tôi rất vui vì trong rất nhiều lựa chọn, bạn đã luôn chọn sử dụng các sản phẩm của <company_name>.")
  const [tableRows,          setTableRows]          = useState([
    { title: "Mã đơn hàng", value: "<order_code>" },
    { title: "Trạng thái",  value: "<payment_status>" },
  ])
  const [selectedBtn,        setSelectedBtn]        = useState("oa-info")
  const [buttonText,         setButtonText]         = useState("Đến trang thông tin OA")
  const [showBtnDropdown,    setShowBtnDropdown]    = useState(false)

  // Step 3
  const [params, setParams] = useState([
    { name: "customer_name",  tech: "Tên khách hàng (30)",                example: "VD: Nguyễn Lê Minh Khoa" },
    { name: "product_name",   tech: "Tên sản phẩm / Thương hiệu (200)",   example: "VD: Bàn phím Razer" },
    { name: "company_name",   tech: "Tên sản phẩm / Thương hiệu (200)",   example: "VD: Bàn phím Razer" },
    { name: "order_code",     tech: "Tên khách hàng (30)",                example: "VD: Nguyễn Lê Minh Khoa" },
    { name: "payment_status", tech: "Tên khách hàng (30)",                example: "VD: Nguyễn Lê Minh Khoa" },
  ])
  const [reviewNote, setReviewNote] = useState("")
  const [agreed,     setAgreed]     = useState(false)

  const stepStatus = (s: number): "done" | "active" | "upcoming" =>
    step > s ? "done" : step === s ? "active" : "upcoming"

  // ── Render ──

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex h-10 items-center border-b border-border px-5 shrink-0">
        <Link href="/cong-cu/gui-tin" className="text-muted-foreground hover:text-foreground mr-3">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded" style={{ background: "oklch(0.488 0.243 264.376)" }}>
            <svg viewBox="0 0 24 20" className="h-4 w-4" fill="none"><path d="M2 4h20v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="white" strokeWidth="1.5"/><path d="M2 4l10 8 10-8" stroke="white" strokeWidth="1.5"/></svg>
          </div>
          <div className="leading-none">
            <div className="text-xs font-bold" style={{ color: "oklch(0.488 0.243 264.376)" }}>ZBS</div>
            <div className="text-[9px] text-muted-foreground">Template Message</div>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">TP</AvatarFallback>
          </Avatar>
          <div className="leading-none">
            <div className="text-xs font-medium">Trường Phát</div>
            <div className="text-[10px] text-muted-foreground">ZNSTest</div>
          </div>
        </div>
      </header>

      {/* Step bar */}
      <div className="flex items-center border-b border-border px-8 h-14 shrink-0">
        <div className="flex flex-1 items-center gap-3">
          <StepIndicator step={1} label="Thông tin chung"  status={stepStatus(1)} />
          <div className="flex-1 max-w-24 h-px" style={{ background: step > 1 ? "oklch(0.488 0.243 264.376)" : "oklch(0.88 0 0)" }} />
          <StepIndicator step={2} label="Khai báo nội dung" status={stepStatus(2)} />
          <div className="flex-1 max-w-24 h-px" style={{ background: step > 2 ? "oklch(0.488 0.243 264.376)" : "oklch(0.88 0 0)" }} />
          <StepIndicator step={3} label="Gửi duyệt"        status={stepStatus(3)} />
        </div>
        <Link href="/cong-cu/gui-tin" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground ml-8">
          <X className="h-4 w-4" />
          {step === 1 ? "Thoát" : "Lưu và thoát"}
        </Link>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left form ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Step 1 */}
          {step === 1 && (
            <div className="p-10 max-w-2xl">
              <h1 className="text-2xl font-bold mb-1">Thông tin chung</h1>
              <p className="text-sm text-muted-foreground mb-8">Khai báo các thông tin bên dưới để tạo Template</p>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Tên mẫu Template <span className="text-red-500">*</span>
                  </label>
                  <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="max-w-xl" />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Chọn App bạn muốn dùng để tạo Template <Info className="inline h-3.5 w-3.5 text-muted-foreground align-middle" /> <span className="text-red-500">*</span>
                  </label>
                  <div className="relative max-w-xl">
                    <select value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)} className="w-full appearance-none border border-border rounded px-3 py-2 text-sm bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {APPS.map((a) => <option key={a}>{a}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Chọn OA bạn muốn dùng để gửi tin <span className="text-red-500">*</span>
                  </label>
                  <div className="relative max-w-xl">
                    <select value={selectedOA} onChange={(e) => setSelectedOA(e.target.value)} className="w-full appearance-none border border-border rounded px-3 py-2 text-sm bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {OAS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Khai báo nội dung</h1>
                  <p className="text-sm text-muted-foreground">Chọn loại Template, mục đích và các thành phần cần thiết trong nội dung tin ZBS</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 shrink-0 ml-4">
                  <FileText className="h-4 w-4" />
                  Chọn từ thư viện Template
                </Button>
              </div>

              {/* Template type */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Chọn loại Template</h3>
                <div className="grid grid-cols-4 gap-3">
                  {TEMPLATE_TYPES.map((t) => (
                    <button key={t.id} onClick={() => setTemplateType(t.id)}
                      className={`relative flex flex-col items-start p-3 rounded border-2 text-left transition-colors ${templateType === t.id ? "border-blue-600 bg-blue-50" : "border-border hover:border-blue-300"}`}
                    >
                      {templateType === t.id && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full flex items-center justify-center" style={{ background: "oklch(0.488 0.243 264.376)" }}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <t.icon className={`h-5 w-5 mb-2 ${templateType === t.id ? "text-blue-600" : "text-muted-foreground"}`} />
                      <span className="text-xs font-semibold leading-tight">{t.label}</span>
                      <span className="text-xs text-blue-600 mt-0.5">{t.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">
                  Chọn mục đích gửi tin ZBS <Info className="inline h-3.5 w-3.5 text-muted-foreground align-middle" />
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {PURPOSES.map((p) => (
                    <button key={p.id} onClick={() => setPurpose(p.id)}
                      className={`relative flex flex-col items-start p-4 rounded border-2 text-left transition-colors ${purpose === p.id ? "border-blue-600 bg-blue-50" : "border-border hover:border-blue-300"}`}
                    >
                      {purpose === p.id && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full flex items-center justify-center" style={{ background: "oklch(0.488 0.243 264.376)" }}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <Info className="h-4 w-4 text-muted-foreground absolute top-3 right-9" />
                      <p className="text-sm font-semibold">{p.level}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo section */}
              <div className="border border-border rounded mb-4">
                <button className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold" onClick={() => setLogoOpen((o) => !o)}>
                  <span>Logo, hình ảnh <span className="text-red-500">*</span></span>
                  {logoOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {logoOpen && (
                  <div className="px-4 pb-4">
                    <p className="text-xs text-muted-foreground mb-4">Chỉ được thêm tối đa 1 logo hoặc tối đa 3 hình ảnh</p>
                    <div className="rounded border border-border p-4 mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Logo</span>
                        <button className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">Logo sau khi được duyệt sẽ được tự động cập nhật cho các mẫu ZBS của OA, xem gợi ý thiết kế logo <span className="text-blue-600 cursor-pointer">tại đây</span></p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium mb-2">Giao diện sáng <span className="text-red-500">*</span></p>
                          <div className="h-24 rounded border border-border flex items-center justify-center" style={{ background: "oklch(0.96 0.02 45)" }}>
                            <span className="text-sm font-bold" style={{ color: "oklch(0.5 0.2 45)" }}>ATP SOFTWARE</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium mb-2">Giao diện tối <span className="text-red-500">*</span></p>
                          <div className="h-24 rounded border border-border flex items-center justify-center" style={{ background: "oklch(0.15 0 0)" }}>
                            <span className="text-sm font-bold" style={{ color: "oklch(0.8 0.2 45)" }}>ATP SOFTWARE</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                        <Plus className="h-4 w-4" />Logo
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                        <ImageIcon className="h-4 w-4" />Hình ảnh
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Content section */}
              <div className="border border-border rounded mb-4">
                <button className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold" onClick={() => setContentOpen((o) => !o)}>
                  <span>Nội dung Template</span>
                  {contentOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {contentOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    {/* Heading block */}
                    <div className="rounded border border-border p-3">
                      <textarea value={headingText} onChange={(e) => setHeadingText(e.target.value)} rows={2} maxLength={400} className="w-full text-sm resize-none focus:outline-none" placeholder="Nhập nội dung tiêu đề..." />
                      <div className="text-right text-xs text-muted-foreground">{headingText.length}/400</div>
                    </div>
                    {/* Văn bản block */}
                    <div className="rounded border border-border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Văn bản</span>
                        <button className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <textarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} rows={3} maxLength={400} className="w-full text-sm resize-none focus:outline-none" placeholder="Nhập nội dung..." />
                      <div className="text-right text-xs text-muted-foreground">{bodyText.length}/400</div>
                    </div>
                    {/* Bảng block */}
                    <div className="rounded border border-border p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Bảng</span>
                        <button className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">Vui lòng thêm tiêu đề và nội dung từng hàng của bảng, nhấn nút "Thêm hàng" để thêm hàng mới.</p>
                      <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-2 px-1">
                        <span>Tiêu đề</span><span>Nội dung</span>
                      </div>
                      <div className="space-y-2">
                        {tableRows.map((row, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Input value={row.title} onChange={(e) => { const r = [...tableRows]; r[i] = { ...r[i], title: e.target.value }; setTableRows(r) }} className="flex-1 text-xs h-8" />
                            <Input value={row.value} onChange={(e) => { const r = [...tableRows]; r[i] = { ...r[i], value: e.target.value }; setTableRows(r) }} className="flex-1 text-xs h-8" />
                            <button onClick={() => setTableRows((r) => r.filter((_, j) => j !== i))} className="shrink-0 h-5 w-5 rounded-full border-2 border-red-400 flex items-center justify-center text-red-400 hover:text-red-600">
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setTableRows((r) => [...r, { title: "", value: "" }])} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mt-3">
                        <Plus className="h-4 w-4" />Thêm hàng
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex items-center gap-1.5 text-sm text-blue-600 border border-blue-200 rounded px-3 py-1.5 hover:bg-blue-50">
                        <Plus className="h-4 w-4" />Văn bản
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-blue-600 border border-blue-200 rounded px-3 py-1.5 hover:bg-blue-50">
                        Bảng
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Button section */}
              <div className="border border-border rounded">
                <button className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold" onClick={() => setButtonOpen((o) => !o)}>
                  <span>Nút thao tác</span>
                  {buttonOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {buttonOpen && (
                  <div className="px-4 pb-4">
                    <div className="rounded border border-border p-4 mb-3">
                      <p className="text-sm font-medium mb-3">Nút thao tác 1</p>
                      <div className="mb-3">
                        <label className="text-xs font-medium block mb-1">Loại nút</label>
                        <div className="relative">
                          <button onClick={() => setShowBtnDropdown((o) => !o)} className="w-full flex items-center justify-between border border-border rounded px-3 py-2 text-sm bg-white hover:bg-gray-50">
                            <span className="font-semibold truncate">{getButtonLabel(selectedBtn)}</span>
                            <ChevronDown className="h-4 w-4 shrink-0 ml-2 text-muted-foreground" />
                          </button>
                          {showBtnDropdown && (
                            <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded border border-border bg-white shadow-lg max-h-72 overflow-y-auto">
                              {BUTTON_GROUPS.map((g) => (
                                <div key={g.group}>
                                  <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wide bg-gray-50">{g.group}</div>
                                  {g.options.map((opt) => (
                                    <button key={opt.id} onClick={() => { setSelectedBtn(opt.id); setButtonText(opt.label.replace(/ \(.*?\)$/, "")); setShowBtnDropdown(false) }}
                                      className={`w-full text-left px-3 py-2.5 hover:bg-blue-50 ${selectedBtn === opt.id ? "bg-blue-50" : ""}`}
                                    >
                                      <p className="text-sm font-semibold">{opt.label}</p>
                                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-1">Nội dung nút</label>
                        <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="text-sm" />
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 text-sm text-blue-600 border border-blue-200 rounded px-3 py-1.5 hover:bg-blue-50">
                      <Plus className="h-4 w-4" />Nút thao tác
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="p-8 max-w-3xl">
              <h1 className="text-2xl font-bold mb-1">Gửi duyệt</h1>
              <p className="text-sm text-muted-foreground mb-8">Chọn cài đặt tham số tương ứng và điền ghi chú nhằm hỗ trợ kiểm duyệt chính xác</p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Tham số <Info className="inline h-3.5 w-3.5 text-muted-foreground align-middle" /></h3>
                <div className="border border-border rounded overflow-hidden">
                  <div className="grid grid-cols-[180px_1fr_1fr_28px] bg-gray-50 px-4 py-2 text-xs font-semibold border-b border-border gap-3">
                    <span>Tên tham số</span>
                    <span>Cài đặt kỹ thuật <Info className="inline h-3 w-3 text-muted-foreground" /></span>
                    <span>Nội dung tham số * <Info className="inline h-3 w-3 text-muted-foreground" /></span>
                    <span />
                  </div>
                  {params.map((p, i) => (
                    <div key={i} className={`grid grid-cols-[180px_1fr_1fr_28px] gap-3 items-center px-4 py-3 ${i < params.length - 1 ? "border-b border-border" : ""}`}>
                      <span className="text-sm text-muted-foreground font-mono text-xs">{p.name}</span>
                      <div className="relative">
                        <select value={p.tech} onChange={(e) => { const n = [...params]; n[i] = { ...n[i], tech: e.target.value }; setParams(n) }}
                          className="w-full appearance-none border border-border rounded px-2 py-1.5 text-sm font-semibold text-blue-600 bg-white pr-6 focus:outline-none"
                        >
                          {TECH_SETTINGS.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="relative">
                        <Input value={p.example} onChange={(e) => { const n = [...params]; n[i] = { ...n[i], example: e.target.value }; setParams(n) }} className="text-sm h-8 pr-7" />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          <Tag className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2">Ghi chú cho kiểm duyệt</h3>
                <textarea value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} rows={4}
                  className="w-full border border-border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập ghi chú cho nội dung"
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4" />
                <span className="text-sm">
                  Tôi đã đọc và đồng ý với <span className="text-blue-600 cursor-pointer hover:underline">Điều khoản và Chính sách sử dụng</span> của Zalo Business Solutions.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="w-72 border-l border-border bg-gray-50 overflow-y-auto p-5 shrink-0">
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-xl" style={{ background: "oklch(0.93 0.08 70)" }}>💡</div>
                <span className="text-sm font-semibold">Gợi ý khi tạo Template</span>
              </div>
              <ul className="space-y-4 text-xs text-muted-foreground leading-relaxed">
                <li className="flex gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Bạn sẽ cần liên kết ứng dụng và OA của doanh nghiệp để bắt đầu gửi tin qua SĐT. Đọc và làm theo hướng dẫn <span className="text-blue-600 cursor-pointer">tại đây.</span></span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Trong trường hợp không chọn được OA, vui lòng đọc thêm <span className="text-blue-600 cursor-pointer">tại đây.</span></span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Đặt tên mẫu Template giúp bạn quản lý các mẫu đã tạo thuận tiện hơn.</span>
                </li>
              </ul>
            </div>
          )}

          {step >= 2 && (
            <div>
              <p className="text-sm font-semibold mb-3">Xem trước Template</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">Giao diện tối</span>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <TemplatePreview darkMode={darkMode} headingText={headingText} bodyText={bodyText} tableRows={tableRows} buttonText={buttonText} />
              <div className="mt-4 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mẫu tuỳ chỉnh</span>
                  <span className="font-semibold">300 VND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nút thao tác 1</span>
                  <span className="font-semibold">0 VND</span>
                </div>
                <div className="pt-1 border-t border-border mt-2">
                  <span className="text-xs font-semibold">Đơn giá dự kiến <Info className="inline h-3 w-3 text-muted-foreground" /></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gửi qua SĐT</span>
                  <span className="font-semibold">300 VND/tin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gửi qua UID</span>
                  <span className="font-semibold">210 VND/tin</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full mt-4 text-xs" style={{ background: "oklch(0.88 0.06 260)", color: "oklch(0.488 0.243 264.376)" }}>
                Gửi thử mẫu ZBS
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-8 py-4 shrink-0 bg-white">
        {step === 1 ? (
          <Button variant="outline" asChild>
            <Link href="/cong-cu/gui-tin">Hủy</Link>
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)}>Quay lại</Button>
        )}
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)} className="text-white px-8" style={{ background: "oklch(0.488 0.243 264.376)" }}>
            Tiếp tục
          </Button>
        ) : (
          <Button className="text-white px-8" style={{ background: "oklch(0.488 0.243 264.376)" }}>
            Hoàn thành
          </Button>
        )}
      </div>
    </div>
  )
}
