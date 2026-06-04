"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ZbsHeader from "@/components/zbs-header"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────

type MethodId = "chuyen-khoan" | "zalopay" | "atm" | "visa"
type InvoiceOption = "no" | "yes"

// ── Data ────────────────────────────────────────────────────────────────────

const ATM_BANKS = [
  { id: "vietinbank",  name: "VietinBank",  color: "#0066B3" },
  { id: "vietcombank", name: "Vietcombank", color: "#007A3D" },
  { id: "sacombank",   name: "Sacombank",   color: "#E31E24" },
  { id: "eximbank",    name: "EXIMBANK",    color: "#003087" },
  { id: "bidv",        name: "BIDV",        color: "#CC0000" },
  { id: "donga",       name: "DongA Bank",  color: "#F58020" },
  { id: "acb",         name: "ACB",         color: "#005BAB" },
  { id: "mb",          name: "MBBank",      color: "#7B2D8B" },
  { id: "techcombank", name: "Techcombank", color: "#EE0033" },
  { id: "vpbank",      name: "VPBank",      color: "#00A651" },
  { id: "hdbank",      name: "HDBank",      color: "#FFD700" },
  { id: "oceanbank",   name: "OceanBank",   color: "#00ADB5" },
  { id: "shb",         name: "SHB",         color: "#E31837" },
  { id: "seabank",     name: "SeABank",     color: "#E8192C" },
  { id: "abbank",      name: "ABBank",      color: "#003087" },
  { id: "tpbank",      name: "TPBank",      color: "#5C2D91" },
  { id: "saigonbank",  name: "SaigonBank",  color: "#003087" },
  { id: "namabank",    name: "Nam A Bank",  color: "#003087" },
  { id: "vietabank",   name: "VietABank",   color: "#CC0000" },
  { id: "gpbank",      name: "GP Bank",     color: "#003087" },
  { id: "bacabank",    name: "Bac A Bank",  color: "#FFD700" },
  { id: "agribank",    name: "Agribank",    color: "#CC0000" },
  { id: "msb",         name: "MSB",         color: "#E31837" },
]

const ROOT_SECTIONS = new Set(["cong-cu", "chi-tieu", "cai-dat", "giao-dich", "bao-cao", ""])

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ"
}

function parseAmount(s: string): number {
  return parseInt(s.replace(/[^0-9]/g, ""), 10) || 0
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NapTienPage() {
  const pathname = usePathname()
  const router = useRouter()
  const seg = pathname.split("/")[1] ?? ""
  const basePath = ROOT_SECTIONS.has(seg) ? "" : `/${seg}`

  const [method, setMethod] = useState<MethodId>("chuyen-khoan")
  const [amountStr, setAmountStr] = useState("500,000")
  const [invoice, setInvoice] = useState<InvoiceOption>("no")
  const [selectedBank, setSelectedBank] = useState<string | null>(null)

  const amount = parseAmount(amountStr)

  function handleAmountChange(v: string) {
    const digits = v.replace(/[^0-9]/g, "")
    if (!digits) { setAmountStr(""); return }
    setAmountStr(Number(digits).toLocaleString("vi-VN"))
  }

  function handleContinue() {
    if (method === "chuyen-khoan") {
      router.push(`${basePath}/giao-dich/nap-tien/chuyen-khoan`)
    }
  }

  const methodLabel: Record<MethodId, string> = {
    "chuyen-khoan": "Chuyển khoản QR",
    "zalopay":      "Ví Zalopay",
    "atm":          "Thẻ ATM",
    "visa":         "Visa / Mastercard / JCB",
  }

  const showNguonTien = method === "zalopay" || method === "atm" || method === "visa"
  const nguonTienLabel: Record<MethodId, string> = {
    "chuyen-khoan": "",
    "zalopay":      "Ví Zalopay",
    "atm":          selectedBank ? ATM_BANKS.find(b => b.id === selectedBank)?.name ?? "—" : "Chọn nguồn tiền",
    "visa":         "Chọn nguồn tiền",
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <ZbsHeader standalone />

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col items-center py-8 px-4">
        <h1 className="text-xl font-bold mb-6">Chọn hình thức nạp tiền</h1>

        <div className="flex gap-5 w-full max-w-5xl items-start">
          {/* Left — method list */}
          <div className="flex-1 space-y-3">

            {/* Method: Chuyển khoản */}
            <MethodCard
              selected={method === "chuyen-khoan"}
              onSelect={() => setMethod("chuyen-khoan")}
              icon={
                <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ background: "oklch(0.92 0.05 265)" }}>
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="oklch(0.45 0.22 265)" strokeWidth={2}>
                    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
              }
              title="Chuyển khoản"
              desc="Chuyển khoản trực tiếp từ ngân hàng đến tài khoản của ZBS Account"
            >
              <div className="pt-4 border-t border-border mt-2">
                <p className="text-sm font-medium mb-3">Thông tin nạp tiền</p>
                <div className="rounded-lg border border-border bg-blue-50/40 p-4 space-y-2">
                  <label className="text-xs text-muted-foreground font-medium">Số tiền nạp</label>
                  <Input
                    value={amountStr}
                    onChange={e => handleAmountChange(e.target.value)}
                    className="bg-white text-sm"
                    placeholder="Nhập số tiền"
                  />
                  <p className="text-xs text-muted-foreground">Số tiền nạp tối thiểu 50,000đ, tối đa 250,000,000đ</p>
                </div>
              </div>
              <InvoiceSection invoice={invoice} onChange={setInvoice} />
            </MethodCard>

            {/* Method: Zalopay */}
            <MethodCard
              selected={method === "zalopay"}
              onSelect={() => setMethod("zalopay")}
              icon={
                <div className="h-9 w-9 rounded overflow-hidden bg-white border border-border flex items-center justify-center">
                  <span className="text-[10px] font-bold leading-tight text-center text-blue-600">Zalo<br/>pay</span>
                </div>
              }
              title="Ứng dụng Zalopay"
              desc="Nạp tiền bằng cách quét mã QR qua Ứng dụng Zalopay trên điện thoại"
            >
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                <div className="h-5 w-5 rounded flex items-center justify-center shrink-0 bg-amber-100">
                  <span className="text-[9px] font-bold text-amber-700">ZP</span>
                </div>
                <p className="text-xs text-amber-800">Vui lòng tải ứng dụng Zalo hoặc tải ứng dụng Zalopay để thanh toán bằng cách quét mã QR</p>
              </div>
              <div className="pt-4 border-t border-border mt-4">
                <p className="text-sm font-medium mb-3">Thông tin nạp tiền</p>
                <div className="rounded-lg border border-border bg-blue-50/40 p-4 space-y-2">
                  <label className="text-xs text-muted-foreground font-medium">Số tiền nạp</label>
                  <Input value={amountStr} onChange={e => handleAmountChange(e.target.value)} className="bg-white text-sm" />
                  <p className="text-xs text-muted-foreground">Số tiền nạp tối thiểu 50,000đ, tối đa 250,000,000đ</p>
                </div>
              </div>
              <InvoiceSection invoice={invoice} onChange={setInvoice} />
            </MethodCard>

            {/* Method: ATM */}
            <MethodCard
              selected={method === "atm"}
              onSelect={() => setMethod("atm")}
              icon={
                <div className="h-9 w-9 rounded border border-border bg-white flex items-center justify-center">
                  <span className="text-[9px] font-bold text-gray-600">ATM</span>
                </div>
              }
              title="Thẻ ATM (qua Cổng Zalopay)"
              desc="Nạp tiền qua thẻ ATM nội địa liên kết qua Cổng Zalopay"
            >
              <div className="grid grid-cols-5 gap-2 mt-3">
                {ATM_BANKS.map(bank => (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    className={cn(
                      "rounded-lg border bg-white px-1 py-2 text-[10px] font-semibold text-center transition-all hover:border-blue-400",
                      selectedBank === bank.id
                        ? "border-blue-500 ring-1 ring-blue-400"
                        : "border-border"
                    )}
                    style={{ color: bank.color }}
                  >
                    {bank.name}
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-border mt-4">
                <p className="text-sm font-medium mb-3">Thông tin nạp tiền</p>
                <div className="rounded-lg border border-border bg-blue-50/40 p-4 space-y-2">
                  <label className="text-xs text-muted-foreground font-medium">Số tiền nạp</label>
                  <Input value={amountStr} onChange={e => handleAmountChange(e.target.value)} className="bg-white text-sm" />
                  <p className="text-xs text-muted-foreground">Số tiền nạp tối thiểu 50,000đ, tối đa 250,000,000đ</p>
                </div>
              </div>
            </MethodCard>

            {/* Method: Visa/Master/JCB */}
            <MethodCard
              selected={method === "visa"}
              onSelect={() => setMethod("visa")}
              icon={
                <div className="h-9 w-9 rounded border border-border bg-white flex items-center justify-center">
                  <span className="text-[9px] font-bold" style={{ color: "#1a1f71" }}>VISA</span>
                </div>
              }
              title="Visa, Master, JCB (qua Cổng Zalopay)"
              desc="Nạp tiền qua thẻ thanh toán quốc tế qua Cổng Zalopay"
            >
              <div className="flex gap-3 mt-3">
                {[
                  { label: "VISA",       bg: "#1a1f71", text: "white",   sub: "" },
                  { label: "MasterCard", bg: "white",   text: "#EB001B", sub: "🔴🟠" },
                  { label: "JCB",        bg: "white",   text: "#003087", sub: "" },
                ].map(card => (
                  <div key={card.label}
                    className="flex-1 rounded-lg border border-border bg-white h-14 flex items-center justify-center text-sm font-bold"
                    style={{ color: card.text }}
                  >
                    {card.label}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-border mt-4">
                <p className="text-sm font-medium mb-3">Thông tin nạp tiền</p>
                <div className="rounded-lg border border-border bg-blue-50/40 p-4 space-y-2">
                  <label className="text-xs text-muted-foreground font-medium">Số tiền nạp</label>
                  <Input value={amountStr} onChange={e => handleAmountChange(e.target.value)} className="bg-white text-sm" />
                  <p className="text-xs text-muted-foreground">Số tiền nạp tối thiểu 50,000đ, tối đa 250,000,000đ</p>
                </div>
              </div>
              <InvoiceSection invoice={invoice} onChange={setInvoice} />
            </MethodCard>

          </div>

          {/* Right — summary panel */}
          <div className="w-[260px] shrink-0 sticky top-4">
            <div className="rounded-xl border border-border bg-white p-5 space-y-3">
              <h3 className="font-semibold text-sm">Chi tiết nạp tiền</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hình thức</span>
                  <span className="font-medium text-right max-w-[140px]">{methodLabel[method]}</span>
                </div>
                {showNguonTien && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nguồn tiền</span>
                    <span className={cn("font-medium", nguonTienLabel[method] === "Chọn nguồn tiền" && "text-muted-foreground italic text-xs")}>
                      {nguonTienLabel[method]}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số tiền nạp</span>
                  <span className="font-medium">{amount > 0 ? formatVnd(amount) : "—"}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="text-muted-foreground">Số tiền thanh toán</span>
                  <span className="font-semibold text-green-600">{amount > 0 ? formatVnd(amount) : "—"}</span>
                </div>
              </div>
              <Button
                className="w-full text-sm font-semibold"
                style={{ background: "oklch(0.45 0.22 265)" }}
                onClick={handleContinue}
                disabled={amount < 50000}
              >
                {method === "chuyen-khoan"
                  ? "Tiếp tục"
                  : amount > 0 ? `Thanh toán ${formatVnd(amount)}` : "Thanh toán"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function MethodCard({
  selected, onSelect, icon, title, desc, children,
}: {
  selected: boolean
  onSelect: () => void
  icon: React.ReactNode
  title: string
  desc: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4 cursor-pointer transition-all",
        selected ? "border-blue-500 ring-1 ring-blue-400" : "border-border hover:border-gray-300"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div className="flex-1">
          <p className={cn("text-sm font-semibold", selected && "text-blue-700")}>{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
        <div className={cn(
          "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
          selected ? "border-blue-600 bg-blue-600" : "border-gray-300"
        )}>
          {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </div>
      </div>
      {selected && children && (
        <div onClick={e => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  )
}

function InvoiceSection({ invoice, onChange }: { invoice: "no" | "yes"; onChange: (v: "no" | "yes") => void }) {
  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="text-sm font-medium mb-3">Yêu cầu hóa đơn</p>
      <div className="flex gap-6">
        {(["no", "yes"] as const).map(v => (
          <label key={v} className="flex items-center gap-2 cursor-pointer">
            <div
              className={cn(
                "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                invoice === v ? "border-blue-600" : "border-gray-300"
              )}
              onClick={() => onChange(v)}
            >
              {invoice === v && <div className="h-2 w-2 rounded-full bg-blue-600" />}
            </div>
            <span className="text-sm">{v === "no" ? "Không xuất hóa đơn" : "Xuất hóa đơn"}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
