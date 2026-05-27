"use client"

import { useState } from "react"
import { ArrowLeft, Check, ChevronRight, X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import ZbsHeader from "@/components/zbs-header"

// ── Mock templates ────────────────────────────────────────────────────────────

type Industry = "Tất cả" | "Thương mại điện tử" | "Y tế & Sức khỏe" | "F&B" | "Tài chính" | "Khác"
type TemplateType = "Tuỳ chỉnh" | "Xác thực" | "Đánh giá" | "Thanh toán" | "Voucher"

interface Template {
  id: string
  name: string
  type: TemplateType
  industry: Exclude<Industry, "Tất cả">
  emoji: string
  title: string
  body: string
  buttons: { label: string; kind: "primary" | "secondary" }[]
}

const INDUSTRY_COLORS: Record<Exclude<Industry, "Tất cả">, string> = {
  "Thương mại điện tử": "oklch(0.88 0.12 265)",
  "Y tế & Sức khỏe":   "oklch(0.88 0.12 165)",
  "F&B":               "oklch(0.85 0.15 50)",
  "Tài chính":         "oklch(0.88 0.12 220)",
  "Khác":              "oklch(0.88 0.08 300)",
}

const TYPE_BADGE_STYLE: Record<TemplateType, string> = {
  "Tuỳ chỉnh":  "bg-blue-100 text-blue-700",
  "Xác thực":   "bg-purple-100 text-purple-700",
  "Đánh giá":   "bg-yellow-100 text-yellow-700",
  "Thanh toán": "bg-green-100 text-green-700",
  "Voucher":    "bg-orange-100 text-orange-700",
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: "t1",
    name: "Xác nhận đơn hàng",
    type: "Tuỳ chỉnh",
    industry: "Thương mại điện tử",
    emoji: "📦",
    title: "Đơn hàng <order_id> đã xác nhận",
    body: "Xin chào <customer_name>, đơn hàng <order_id> của bạn đã được xác nhận thành công. Chúng tôi sẽ xử lý và giao hàng trong 2-3 ngày làm việc.",
    buttons: [{ label: "Xem đơn hàng", kind: "primary" }],
  },
  {
    id: "t2",
    name: "Mã OTP đăng nhập",
    type: "Xác thực",
    industry: "Khác",
    emoji: "🔐",
    title: "",
    body: "Mã xác minh của bạn là <otp>. Tuyệt đối KHÔNG chia sẻ mã này cho bất kỳ ai. Mã có hiệu lực trong 5 phút.",
    buttons: [{ label: "Sao chép mã", kind: "primary" }],
  },
  {
    id: "t3",
    name: "Đánh giá đơn hàng",
    type: "Đánh giá",
    industry: "Thương mại điện tử",
    emoji: "⭐",
    title: "Đánh giá trải nghiệm của bạn",
    body: "Xin chào <customer_name>, đơn hàng <order_id> đã được giao thành công. Bạn có hài lòng về sản phẩm không? Hãy để lại đánh giá để chúng tôi phục vụ bạn tốt hơn.",
    buttons: [{ label: "Đánh giá ngay", kind: "primary" }, { label: "Để sau", kind: "secondary" }],
  },
  {
    id: "t4",
    name: "Nhắc thanh toán hoá đơn",
    type: "Thanh toán",
    industry: "Tài chính",
    emoji: "💳",
    title: "Thông báo thanh toán hoá đơn",
    body: "Kính gửi <customer_name>, hoá đơn <invoice_id> của bạn đến hạn thanh toán vào ngày <due_date>. Số tiền cần thanh toán: <amount>đ.",
    buttons: [{ label: "Thanh toán ngay", kind: "primary" }, { label: "Xem chi tiết", kind: "secondary" }],
  },
  {
    id: "t5",
    name: "Mã giảm giá sinh nhật",
    type: "Voucher",
    industry: "Thương mại điện tử",
    emoji: "🎂",
    title: "Quà sinh nhật đặc biệt dành cho bạn 🎉",
    body: "Chúc mừng sinh nhật <customer_name>! Chúng tôi tặng bạn mã giảm giá <voucher_code> — giảm ngay 70.000đ cho đơn hàng trên 200.000đ. HSD: <expire>.",
    buttons: [{ label: "Dùng ngay", kind: "primary" }],
  },
  {
    id: "t6",
    name: "Xác nhận lịch khám",
    type: "Tuỳ chỉnh",
    industry: "Y tế & Sức khỏe",
    emoji: "🏥",
    title: "Xác nhận lịch khám bệnh",
    body: "Xin chào <patient_name>, lịch khám của bạn tại <clinic_name> đã được xác nhận vào <appointment_time>. Vui lòng đến trước 15 phút để làm thủ tục.",
    buttons: [{ label: "Xem lịch hẹn", kind: "primary" }, { label: "Đổi lịch", kind: "secondary" }],
  },
  {
    id: "t7",
    name: "Nhắc uống thuốc",
    type: "Tuỳ chỉnh",
    industry: "Y tế & Sức khỏe",
    emoji: "💊",
    title: "Nhắc nhở uống thuốc",
    body: "Xin chào <patient_name>, đã đến giờ uống thuốc <medicine_name> (<dosage>). Hãy uống thuốc đúng giờ để điều trị hiệu quả.",
    buttons: [{ label: "Đã uống thuốc", kind: "primary" }],
  },
  {
    id: "t8",
    name: "Đặt bàn thành công",
    type: "Tuỳ chỉnh",
    industry: "F&B",
    emoji: "🍽️",
    title: "Đặt bàn thành công tại <restaurant_name>",
    body: "Xin chào <customer_name>, bàn của bạn tại <restaurant_name> đã được xác nhận vào lúc <booking_time> cho <guests> khách. Chúng tôi mong được phục vụ bạn!",
    buttons: [{ label: "Xem chi tiết", kind: "primary" }, { label: "Huỷ đặt bàn", kind: "secondary" }],
  },
  {
    id: "t9",
    name: "Tích điểm thành viên",
    type: "Đánh giá",
    industry: "F&B",
    emoji: "🌟",
    title: "Bạn vừa tích thêm điểm thưởng!",
    body: "Xin chào <customer_name>, bạn vừa tích được <points> điểm từ đơn hàng <order_id>. Tổng điểm tích lũy: <total_points>. Tiếp tục mua sắm để đổi quà hấp dẫn!",
    buttons: [{ label: "Xem ưu đãi", kind: "primary" }],
  },
  {
    id: "t10",
    name: "Sao kê tài khoản",
    type: "Thanh toán",
    industry: "Tài chính",
    emoji: "📊",
    title: "Sao kê tài khoản tháng <month>",
    body: "Kính gửi <customer_name>, sao kê tài khoản <account_number> tháng <month> đã sẵn sàng. Số dư cuối kỳ: <balance>đ. Tổng giao dịch: <transaction_count> lần.",
    buttons: [{ label: "Xem sao kê", kind: "primary" }, { label: "Tải về PDF", kind: "secondary" }],
  },
  {
    id: "t11",
    name: "Giao hàng thành công",
    type: "Tuỳ chỉnh",
    industry: "Thương mại điện tử",
    emoji: "✅",
    title: "Đơn hàng đã giao thành công",
    body: "Xin chào <customer_name>, đơn hàng <order_id> đã được giao thành công vào lúc <delivery_time>. Cảm ơn bạn đã tin tưởng mua sắm tại chúng tôi!",
    buttons: [{ label: "Đánh giá đơn hàng", kind: "primary" }, { label: "Mua lại", kind: "secondary" }],
  },
  {
    id: "t12",
    name: "Kết quả xét nghiệm sẵn",
    type: "Tuỳ chỉnh",
    industry: "Y tế & Sức khỏe",
    emoji: "🧪",
    title: "Kết quả xét nghiệm của bạn đã sẵn sàng",
    body: "Xin chào <patient_name>, kết quả xét nghiệm <test_type> ngày <test_date> của bạn tại <clinic_name> đã có. Vui lòng liên hệ bác sĩ để được tư vấn.",
    buttons: [{ label: "Xem kết quả", kind: "primary" }, { label: "Đặt lịch tư vấn", kind: "secondary" }],
  },
]

const CATEGORIES: Industry[] = ["Tất cả", "Thương mại điện tử", "Y tế & Sức khỏe", "F&B", "Tài chính", "Khác"]

// ── Template Card ─────────────────────────────────────────────────────────────

function TemplateCard({ tpl, onSelect }: { tpl: Template; onSelect: () => void }) {
  const bgColor = INDUSTRY_COLORS[tpl.industry]
  return (
    <div
      className="group relative bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer flex flex-col"
      onClick={onSelect}
    >
      {/* Mini preview */}
      <div
        className="h-[64px] flex items-center gap-2.5 px-4 shrink-0"
        style={{ background: bgColor }}
      >
        <span className="text-2xl">{tpl.emoji}</span>
        <span className="text-[11px] font-bold text-gray-800 leading-tight line-clamp-2">{tpl.name}</span>
      </div>

      {/* Card body */}
      <div className="px-3 py-2.5 flex flex-col gap-1.5 flex-1">
        <p className="text-[13px] font-semibold text-foreground leading-snug line-clamp-1">{tpl.name}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold", TYPE_BADGE_STYLE[tpl.type])}>
            {tpl.type}
          </span>
          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-500 px-2 py-0.5 text-[10px]">
            {tpl.industry}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">{tpl.body}</p>
      </div>

      {/* Hover CTA */}
      <div className="px-3 pb-3">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="w-full py-1.5 rounded-lg text-[11px] font-semibold text-white flex items-center justify-center gap-1"
            style={{ background: "oklch(0.45 0.22 265)" }}
          >
            Dùng mẫu này <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Gallery Screen ────────────────────────────────────────────────────────────

function GalleryScreen({ onSelect, onScratch }: {
  onSelect: (tpl: Template) => void
  onScratch: () => void
}) {
  const [activeCategory, setActiveCategory] = useState<Industry>("Tất cả")

  const filtered = activeCategory === "Tất cả"
    ? MOCK_TEMPLATES
    : MOCK_TEMPLATES.filter((t) => t.industry === activeCategory)

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero */}
      <div className="bg-white border-b border-border px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Chọn mẫu để bắt đầu</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Khởi đầu nhanh với mẫu có sẵn phù hợp với ngành của bạn
        </p>
        <button
          onClick={onScratch}
          className="text-sm font-medium inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
        >
          Hoặc tạo từ đầu <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Category tabs */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-6 overflow-x-auto">
        <div className="flex gap-1 py-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                activeCategory === cat
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
              )}
              style={activeCategory === cat ? { background: "oklch(0.45 0.22 265)" } : undefined}
            >
              {cat}
              {cat !== "Tất cả" && (
                <span className={cn("ml-1.5 text-[10px]", activeCategory === cat ? "text-blue-200" : "text-muted-foreground")}>
                  {MOCK_TEMPLATES.filter((t) => t.industry === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-4 gap-4">
          {filtered.map((tpl) => (
            <TemplateCard key={tpl.id} tpl={tpl} onSelect={() => onSelect(tpl)} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-border">
        <button
          onClick={onScratch}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Tạo từ đầu không dùng mẫu →
        </button>
      </div>
    </div>
  )
}

// ── Composer Screen ───────────────────────────────────────────────────────────

const TEMPLATE_TYPES = [
  { id: "tuy-chinh",   label: "Tuỳ chỉnh",  icon: "✏️" },
  { id: "xac-thuc",   label: "Xác thực",   icon: "🔐" },
  { id: "danh-gia",   label: "Đánh giá",   icon: "⭐" },
  { id: "thanh-toan", label: "Thanh toán", icon: "💳" },
  { id: "voucher",    label: "Voucher",    icon: "🎟️" },
]

const TYPE_MAP: Record<TemplateType, string> = {
  "Tuỳ chỉnh": "tuy-chinh",
  "Xác thực":  "xac-thuc",
  "Đánh giá":  "danh-gia",
  "Thanh toán":"thanh-toan",
  "Voucher":   "voucher",
}

interface ComposerBtn { id: number; label: string }
let _nextId = 1
function nid() { return _nextId++ }

function ComposerScreen({ template, onBack }: {
  template: Template | null
  onBack: () => void
}) {
  const initType   = template ? TYPE_MAP[template.type]  : "tuy-chinh"
  const initTitle  = template?.title  ?? ""
  const initBody   = template?.body   ?? ""
  const initBtns   = template
    ? template.buttons.map((b) => ({ id: nid(), label: b.label }))
    : []

  const [templateType, setTemplateType] = useState(initType)
  const [title, setTitle]               = useState(initTitle)
  const [body, setBody]                 = useState(initBody)
  const [buttons, setButtons]           = useState<ComposerBtn[]>(initBtns)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [dark, setDark]                 = useState(false)

  function addButton() {
    if (buttons.length >= 3) return
    setButtons([...buttons, { id: nid(), label: "" }])
  }
  function deleteButton(id: number) {
    setButtons(buttons.filter((b) => b.id !== id))
  }
  function updateButton(id: number, label: string) {
    setButtons(buttons.map((b) => b.id === id ? { ...b, label } : b))
  }

  const muted = dark ? "text-gray-400" : "text-gray-500"
  const showTitle = templateType !== "xac-thuc"

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Breadcrumb */}
      <div className="px-6 py-2.5 bg-white border-b border-border flex items-center gap-2 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Thư viện mẫu
        </button>
        {template && (
          <>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs font-medium text-foreground">{template.name}</span>
          </>
        )}
        {!template && (
          <>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs font-medium text-foreground">Tạo từ đầu</span>
          </>
        )}
      </div>

      {/* Banner */}
      {template && !bannerDismissed && (
        <div className="mx-6 mt-4 shrink-0 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
            <Check className="h-4 w-4 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-teal-800">Bắt đầu từ mẫu: {template.name}</p>
            <p className="text-[11px] text-teal-600">Nội dung đã được điền sẵn — bạn có thể chỉnh sửa tự do</p>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="p-1 rounded-full hover:bg-teal-100 transition-colors shrink-0"
          >
            <X className="h-3.5 w-3.5 text-teal-500" />
          </button>
        </div>
      )}

      {/* 2-column layout */}
      <div className="flex flex-1 overflow-hidden gap-0 mt-4 px-6 pb-6">
        {/* Left — form */}
        <div className="flex-1 overflow-y-auto pr-4 space-y-4">
          {/* Type selector */}
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Loại template</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATE_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplateType(t.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    templateType === t.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-border text-muted-foreground hover:border-blue-300 hover:text-foreground"
                  )}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          {showTitle && (
            <div className="bg-white rounded-xl border border-border p-4">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Tiêu đề</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề tin nhắn..."
                className="w-full text-sm font-semibold border-0 outline-none bg-transparent placeholder:text-gray-300"
              />
            </div>
          )}

          {/* Body */}
          <div className="bg-white rounded-xl border border-border p-4">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Nội dung</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Nhập nội dung... Dùng <tên_tham_số> để chèn biến động"
              rows={5}
              className="w-full text-sm border-0 outline-none resize-none bg-transparent placeholder:text-gray-300 leading-relaxed"
            />
            {body && /<[^>]+>/.test(body) && (
              <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-border">
                {[...new Set(Array.from(body.matchAll(/<([^>]+)>/g), (m) => m[1]))].map((p) => (
                  <span key={p} className="text-[10px] font-mono text-blue-600 bg-blue-50 rounded px-1.5 py-0.5 border border-blue-100">
                    &lt;{p}&gt;
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Nút hành động</p>
              <span className="text-[10px] text-muted-foreground">{buttons.length}/3 tối đa</span>
            </div>
            <div className="space-y-2">
              {buttons.map((btn, i) => (
                <div key={btn.id} className="flex items-center gap-2 group/btn">
                  <span className="h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: i === 0 ? "oklch(0.45 0.22 265)" : "oklch(0.65 0.04 265)" }}>
                    {i + 1}
                  </span>
                  <input
                    value={btn.label}
                    onChange={(e) => updateButton(btn.id, e.target.value)}
                    placeholder={`Nhãn nút ${i + 1}...`}
                    className="flex-1 text-sm border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <button
                    onClick={() => deleteButton(btn.id)}
                    className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover/btn:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {buttons.length < 3 && (
              <button
                onClick={addButton}
                className="mt-2 flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Thêm nút
              </button>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-1">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Lưu nháp</button>
            <div className="flex gap-2">
              <button className="text-sm font-medium px-5 py-2 rounded-lg border border-border hover:bg-gray-50 transition-colors bg-white">
                Xem trước
              </button>
              <button
                className="text-sm font-semibold px-5 py-2 rounded-lg text-white transition-colors"
                style={{ background: "oklch(0.45 0.22 265)" }}
              >
                Gửi duyệt
              </button>
            </div>
          </div>
        </div>

        {/* Right — preview */}
        <div className="w-[260px] shrink-0 flex flex-col gap-3">
          <div className="bg-white rounded-xl border border-border p-3 flex items-center justify-between">
            <span className="text-xs font-semibold">Xem trước</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Tối</span>
              <button
                onClick={() => setDark(!dark)}
                className={cn("relative rounded-full transition-colors shrink-0")}
                style={{ height: "18px", width: "32px", background: dark ? "oklch(0.45 0.22 265)" : "oklch(0.8 0 0)" }}
              >
                <span
                  className="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                  style={{ transform: dark ? "translateX(14px)" : "translateX(2px)" }}
                />
              </button>
            </div>
          </div>

          {/* Phone mockup */}
          <div className={cn("rounded-2xl border overflow-hidden shadow-sm text-sm", dark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-border text-gray-900")}>
            {/* Header bar */}
            <div className={cn("px-4 pt-4 pb-2.5", dark ? "bg-gray-800" : "bg-orange-50")}>
              <p className="text-sm font-extrabold">
                <span className={dark ? "text-orange-400" : "text-orange-500"}>ATP </span>
                <span className={dark ? "text-white" : "text-gray-900"}>SOFTWARE</span>
              </p>
            </div>

            <div className="px-4 py-3 space-y-2">
              {/* OTP special case */}
              {templateType === "xac-thuc" ? (
                <>
                  <p className="text-[13px] font-semibold leading-snug">Mã xác minh của bạn là</p>
                  <div className={cn("text-center py-3 rounded-lg", dark ? "bg-gray-800" : "bg-blue-50")}>
                    <span className="text-xl font-bold tracking-widest" style={{ color: "oklch(0.488 0.243 264.376)" }}>&lt;otp&gt;</span>
                  </div>
                  <p className={cn("text-[11px] leading-relaxed", muted)}>
                    {body || "Tuyệt đối KHÔNG chia sẻ mã xác thực cho bất kỳ ai. Mã có hiệu lực trong 5 phút."}
                  </p>
                </>
              ) : (
                <>
                  {title && <p className="text-[13px] font-semibold leading-snug">{title}</p>}
                  {body && (
                    <p className={cn("text-[12px] leading-relaxed", dark ? "text-gray-300" : "text-gray-700")}>
                      {body}
                    </p>
                  )}
                  {!title && !body && (
                    <p className="text-[12px] italic text-gray-300">Nội dung hiển thị ở đây...</p>
                  )}
                </>
              )}

              {/* Buttons */}
              {buttons.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {buttons.map((btn, i) => (
                    <button
                      key={btn.id}
                      className={cn("w-full py-2 rounded text-xs font-semibold", i > 0 && (dark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"))}
                      style={i === 0 ? { background: "oklch(0.488 0.243 264.376)", color: "white" } : undefined}
                    >
                      {btn.label || `Nút ${i + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Send test */}
          <button className="w-full text-xs font-medium py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors bg-white">
            Gửi thử mẫu ZBS
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type Screen = "gallery" | "composer"

export default function TaoTemplateCPage() {
  const [screen, setScreen]       = useState<Screen>("gallery")
  const [selectedTpl, setSelectedTpl] = useState<Template | null>(null)

  function handleSelectTemplate(tpl: Template) {
    setSelectedTpl(tpl)
    setScreen("composer")
  }

  function handleScratch() {
    setSelectedTpl(null)
    setScreen("composer")
  }

  function handleBack() {
    setScreen("gallery")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ZbsHeader standalone />

      {/* Option badge bar */}
      <div className="sticky top-[68px] z-40 bg-white border-b border-border px-6 py-2.5 flex items-center gap-3 shrink-0">
        <span className="inline-flex items-center rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">
          Option C
        </span>
        <span className="text-sm font-semibold text-foreground">Tạo Template ZNS</span>
        <span className="text-xs text-muted-foreground">· Gallery First</span>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
          <Check className="h-3 w-3 text-green-500" />
          Prototype — mock data only
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden" style={{ height: "calc(100vh - 68px - 44px)" }}>
        {screen === "gallery" && (
          <GalleryScreen onSelect={handleSelectTemplate} onScratch={handleScratch} />
        )}
        {screen === "composer" && (
          <ComposerScreen template={selectedTpl} onBack={handleBack} />
        )}
      </div>
    </div>
  )
}
