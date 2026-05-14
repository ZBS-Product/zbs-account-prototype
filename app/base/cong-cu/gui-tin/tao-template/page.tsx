"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, Image, Smartphone, FileText, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────────────────

type TemplateType = "giao-dich" | "cskh" | "hau-mai" | null
type OAOption = { id: string; name: string; app: string }

const OA_OPTIONS: OAOption[] = [
  { id: "1001243054065825554", name: "Trợ lý tin doanh nghiệp", app: "ZNS Service" },
  { id: "3042881048992527255", name: "Qc Test ZNS 4", app: "ZNS Service" },
  { id: "1088627745287650843", name: "ZBS Account", app: "ZNS Service" },
  { id: "450688169741866628", name: "Zalo Business Solutions", app: "Test ZBS App" },
]

const TEMPLATE_TYPES = [
  {
    id: "giao-dich" as TemplateType,
    label: "Tin giao dịch",
    desc: "Xác nhận đơn hàng, thanh toán, vận chuyển",
    icon: FileText,
    color: "oklch(0.45 0.22 265)",
  },
  {
    id: "cskh" as TemplateType,
    label: "Tin CSKH",
    desc: "Chăm sóc khách hàng, nhắc lịch, thông báo dịch vụ",
    icon: Smartphone,
    color: "oklch(0.55 0.15 185)",
  },
  {
    id: "hau-mai" as TemplateType,
    label: "Tin hậu mãi",
    desc: "Khuyến mãi, ưu đãi, tích điểm thành viên",
    icon: Image,
    color: "oklch(0.6 0.18 55)",
  },
]

// ── Step indicators ───────────────────────────────────────────────────────────

const STEPS = ["Chọn loại tin", "Thiết kế nội dung", "Xem trước & Gửi duyệt"]

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors",
                  done
                    ? "border-blue-600 bg-blue-600 text-white"
                    : active
                    ? "border-blue-600 bg-white text-blue-600"
                    : "border-gray-300 bg-white text-gray-400"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("text-xs font-medium whitespace-nowrap", active ? "text-blue-600" : done ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-3 mb-5 transition-colors", done ? "bg-blue-600" : "bg-gray-200")} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Step 1 — chọn loại tin ────────────────────────────────────────────────────

function Step1({
  templateType,
  setTemplateType,
  selectedOA,
  setSelectedOA,
  onNext,
}: {
  templateType: TemplateType
  setTemplateType: (t: TemplateType) => void
  selectedOA: string
  setSelectedOA: (id: string) => void
  onNext: () => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold mb-1">Chọn OA gửi tin</h2>
        <p className="text-sm text-muted-foreground mb-3">Template sẽ được gắn với OA bạn chọn</p>
        <div className="relative w-full max-w-sm">
          <select
            value={selectedOA}
            onChange={(e) => setSelectedOA(e.target.value)}
            className="w-full appearance-none border border-border rounded-md px-3 py-2 text-sm pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn OA --</option>
            {OA_OPTIONS.map((oa) => (
              <option key={oa.id} value={oa.id}>{oa.name} ({oa.app})</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold mb-1">Chọn loại template</h2>
        <p className="text-sm text-muted-foreground mb-3">Mỗi loại có cấu trúc và quy tắc duyệt khác nhau</p>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATE_TYPES.map((t) => {
            const Icon = t.icon
            const selected = templateType === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTemplateType(t.id)}
                className={cn(
                  "flex flex-col items-start gap-3 rounded-lg border-2 p-4 text-left transition-all",
                  selected ? "border-blue-600 bg-blue-50" : "border-border bg-white hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in oklch, ${t.color} 15%, white)` }}>
                  <Icon className="h-5 w-5" style={{ color: t.color }} />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-0.5" style={{ color: selected ? "oklch(0.45 0.22 265)" : undefined }}>{t.label}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{t.desc}</div>
                </div>
                {selected && (
                  <div className="ml-auto mt-auto">
                    <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={onNext}
          disabled={!templateType || !selectedOA}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Tiếp theo <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ── Step 2 — thiết kế nội dung ────────────────────────────────────────────────

const PARAM_TYPES = ["Họ tên", "Số điện thoại", "Mã đơn hàng", "Số tiền", "Ngày giờ", "Địa chỉ", "Khác"]

function Step2({
  templateType,
  templateName, setTemplateName,
  content, setContent,
  onBack, onNext,
}: {
  templateType: TemplateType
  templateName: string; setTemplateName: (v: string) => void
  content: string; setContent: (v: string) => void
  onBack: () => void; onNext: () => void
}) {
  const typeLabel = TEMPLATE_TYPES.find((t) => t.id === templateType)?.label ?? ""

  function insertParam(param: string) {
    setContent((prev) => prev + `{{${param}}}`)
  }

  // Render preview content
  const previewContent = content.replace(/\{\{([^}]+)\}\}/g, (_, p) => `[${p}]`)

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      {/* Left — editor */}
      <div className="space-y-5">
        <div>
          <label className="text-sm font-semibold mb-1.5 block">Tên template</label>
          <Input
            placeholder="VD: Xác nhận đơn hàng thành công"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-1.5 block">
            Nội dung tin nhắn
            <span className="text-muted-foreground font-normal ml-2 text-xs">Loại: {typeLabel}</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung tin nhắn. Dùng {{Tên tham số}} để chèn thông tin động..."
            rows={8}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
          />
          <div className="flex items-center justify-between mt-1.5">
            <p className="text-xs text-muted-foreground">Chèn tham số động:</p>
            <span className="text-xs text-muted-foreground">{content.length} / 1000 ký tự</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {PARAM_TYPES.map((p) => (
              <button
                key={p}
                onClick={() => insertParam(p)}
                className="text-xs px-2 py-0.5 rounded-full border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                + {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Button>
          <Button
            onClick={onNext}
            disabled={!templateName.trim() || !content.trim()}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Xem trước <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right — phone preview */}
      <div className="flex flex-col items-center">
        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Xem trước</p>
        <div className="w-[220px] rounded-[28px] border-4 border-gray-800 bg-gray-100 overflow-hidden shadow-xl">
          {/* Phone status bar */}
          <div className="bg-gray-800 h-6 flex items-center justify-center">
            <div className="h-2 w-16 rounded-full bg-gray-600" />
          </div>
          {/* Chat header */}
          <div className="bg-blue-600 px-3 py-2 flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">Z</div>
            <div>
              <div className="text-white text-xs font-semibold">Zalo Business</div>
              <div className="text-blue-200 text-[9px]">Official Account</div>
            </div>
          </div>
          {/* Message bubble */}
          <div className="p-3 space-y-2">
            <div className="bg-white rounded-lg rounded-tl-none p-2.5 shadow-sm text-[11px] leading-relaxed text-gray-800 break-words min-h-[60px]">
              {previewContent || <span className="text-gray-400 italic">Nội dung tin nhắn sẽ hiển thị ở đây...</span>}
            </div>
            <div className="text-[9px] text-gray-400 text-right">Vừa xong</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Step 3 — xem trước & gửi duyệt ───────────────────────────────────────────

function Step3({
  templateType,
  selectedOA,
  templateName,
  content,
  onBack,
  onSubmit,
}: {
  templateType: TemplateType
  selectedOA: string
  templateName: string
  content: string
  onBack: () => void
  onSubmit: () => void
}) {
  const typeLabel = TEMPLATE_TYPES.find((t) => t.id === templateType)?.label ?? ""
  const oaInfo = OA_OPTIONS.find((o) => o.id === selectedOA)
  const previewContent = content.replace(/\{\{([^}]+)\}\}/g, (_, p) => `[${p}]`)

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-white p-5 space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Thông tin template</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Tên template</span>
            <p className="font-semibold mt-0.5">{templateName}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Loại tin</span>
            <p className="font-semibold mt-0.5">{typeLabel}</p>
          </div>
          <div>
            <span className="text-muted-foreground">OA gửi tin</span>
            <p className="font-semibold mt-0.5">{oaInfo?.name ?? selectedOA}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Ứng dụng</span>
            <p className="font-semibold mt-0.5">{oaInfo?.app ?? "—"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Nội dung tin nhắn</h3>
        <div className="grid grid-cols-[1fr_220px] gap-6 items-start">
          <div className="rounded-md bg-gray-50 border border-border p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap text-gray-800">
            {content}
          </div>
          {/* Phone preview */}
          <div className="flex flex-col items-center">
            <div className="w-[180px] rounded-[22px] border-4 border-gray-800 bg-gray-100 overflow-hidden shadow-lg">
              <div className="bg-gray-800 h-5 flex items-center justify-center">
                <div className="h-1.5 w-12 rounded-full bg-gray-600" />
              </div>
              <div className="bg-blue-600 px-2.5 py-1.5 flex items-center gap-1.5">
                <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-white text-[8px] font-bold">Z</div>
                <div className="text-white text-[10px] font-semibold">Zalo Business</div>
              </div>
              <div className="p-2.5">
                <div className="bg-white rounded-lg rounded-tl-none p-2 shadow-sm text-[10px] leading-relaxed text-gray-800 break-words">
                  {previewContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>Lưu ý:</strong> Template sẽ được gửi đến Zalo để xét duyệt. Thời gian duyệt thường từ 1–3 ngày làm việc.
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Quay lại chỉnh sửa
        </Button>
        <Button onClick={onSubmit} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6">
          <Check className="h-4 w-4" /> Gửi duyệt Template
        </Button>
      </div>
    </div>
  )
}

// ── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({ onReset, basePath }: { onReset: () => void; basePath: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-xl font-bold mb-2">Gửi duyệt thành công!</h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-sm">
        Template của bạn đã được gửi đến Zalo để xét duyệt. Bạn có thể theo dõi trạng thái tại trang Quản lý Template.
      </p>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onReset}>Tạo template khác</Button>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href={`${basePath}/cong-cu/gui-tin/quan-ly-template`}>Xem Quản lý Template</Link>
        </Button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TaoTemplatePage() {
  const pathname = usePathname()
  const basePath = `/${pathname.split("/")[1]}`

  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  // Step 1
  const [templateType, setTemplateType] = useState<TemplateType>(null)
  const [selectedOA, setSelectedOA] = useState("")

  // Step 2
  const [templateName, setTemplateName] = useState("")
  const [content, setContent] = useState("")

  function reset() {
    setStep(0); setDone(false)
    setTemplateType(null); setSelectedOA("")
    setTemplateName(""); setContent("")
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`${basePath}/cong-cu/gui-tin/quan-ly-template`} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Tạo Template mới</h1>
      </div>

      {done ? (
        <SuccessScreen onReset={reset} basePath={basePath} />
      ) : (
        <>
          <StepBar current={step} />

          {step === 0 && (
            <Step1
              templateType={templateType}
              setTemplateType={setTemplateType}
              selectedOA={selectedOA}
              setSelectedOA={setSelectedOA}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <Step2
              templateType={templateType}
              templateName={templateName} setTemplateName={setTemplateName}
              content={content} setContent={setContent}
              onBack={() => setStep(0)}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step3
              templateType={templateType}
              selectedOA={selectedOA}
              templateName={templateName}
              content={content}
              onBack={() => setStep(1)}
              onSubmit={() => setDone(true)}
            />
          )}
        </>
      )}
    </div>
  )
}
