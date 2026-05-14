"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft, Send, Copy, Download, Pencil, Trash2, AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

type TemplateStatus = "Nháp" | "Đang duyệt" | "Đã duyệt" | "Bị từ chối" | "Bị khóa"

type Param = { name: string; technical: string; dataType: string; content: string }

type TemplateDetail = {
  id: string
  name: string
  zbsId: string
  status: TemplateStatus
  type: string
  oaName: string
  oaColor: string
  appName: string
  pricePhone: string
  priceUID: string
  note: string
  sent: string
  createdAt: string
  purpose: string
  ztime: number
  params: Param[]
  codeExample: string
  previewTitle: string
  previewBody: string[]
  previewButton?: string
  previewLogoText: string
  previewLogoBg: string
}

const detailMap: Record<string, TemplateDetail> = {
  "1": {
    id: "1", name: "Test Template", zbsId: "578634", status: "Bị từ chối",
    type: "Mẫu tuỳ chỉnh", oaName: "Qc Test ZNS 4", oaColor: "#1a1a1a",
    appName: "QC Test ZNS 1", pricePhone: "300 đ/tin", priceUID: "210 đ/tin",
    note: "", sent: "5 tin SĐT", createdAt: "16h39 12/05/2026", purpose: "Giao dịch", ztime: 7200,
    params: [
      { name: "<customer_name>", technical: "Tên khách hàng (30)", dataType: "string", content: "Nguyễn Văn A" },
      { name: "<order_code>",    technical: "Tên khách hàng (30)", dataType: "string", content: "ORD-001" },
    ],
    codeExample: '{\n  "customer_name": "Nguyễn Văn A",\n  "order_code": "ORD-001"\n}',
    previewTitle: "Xác nhận đơn hàng", previewLogoBg: "#1a1a1a", previewLogoText: "QC",
    previewBody: [
      "Xin chào <customer_name>,",
      "Đơn hàng <order_code> của bạn đã được xác nhận.",
    ],
    previewButton: "Xem đơn hàng",
  },
  "2": {
    id: "2", name: "Test template webhook", zbsId: "578321", status: "Đã duyệt",
    type: "Mẫu tuỳ chỉnh", oaName: "Qc Test ZNS 4", oaColor: "#1a1a1a",
    appName: "QC Test ZNS 1", pricePhone: "300 đ/tin", priceUID: "210 đ/tin",
    note: "", sent: "12 tin SĐT", createdAt: "13h54 12/05/2026", purpose: "Giao dịch", ztime: 7200,
    params: [
      { name: "<customer_name>", technical: "Tên khách hàng (30)", dataType: "string", content: "Sample" },
      { name: "<amount>",        technical: "Tiền tệ (VNĐ) (12)",  dataType: "currency", content: "Sample" },
    ],
    codeExample: '{\n  "customer_name": "Sample",\n  "amount": 50000\n}',
    previewTitle: "Thông báo webhook", previewLogoBg: "#1a1a1a", previewLogoText: "QC",
    previewBody: ["Xin chào <customer_name>,", "Sự kiện mới đã được ghi nhận.", "Số tiền: <amount>đ"],
    previewButton: "Xem chi tiết",
  },
  "3": {
    id: "3", name: "test create temp", zbsId: "578303", status: "Đã duyệt",
    type: "Mẫu OTP", oaName: "Qc Test ZNS 4", oaColor: "#1a1a1a",
    appName: "QC Test ZNS 4", pricePhone: "300 đ/tin", priceUID: "210 đ/tin",
    note: "", sent: "38 tin SĐT", createdAt: "13h32 12/05/2026", purpose: "Giao dịch", ztime: 300,
    params: [
      { name: "<otp_code>", technical: "Mã OTP (6)", dataType: "string", content: "123456" },
    ],
    codeExample: '{\n  "otp_code": "123456"\n}',
    previewTitle: "Mã OTP đăng nhập", previewLogoBg: "#1a1a1a", previewLogoText: "QC",
    previewBody: ["Mã OTP của bạn là: <otp_code>", "Mã có hiệu lực trong 5 phút. Không chia sẻ mã này."],
  },
  "4": {
    id: "4", name: "Con cua củ quả 1", zbsId: "578569", status: "Nháp",
    type: "Mẫu tuỳ chỉnh", oaName: "Doanh nghiệp KCX Tân Thuận", oaColor: "oklch(0.55 0.18 30)",
    appName: "Thinh OA ZBA Test 1208", pricePhone: "300 đ/tin", priceUID: "210 đ/tin",
    note: "", sent: "", createdAt: "17h11 11/05/2026", purpose: "Chăm sóc khách hàng", ztime: 7200,
    params: [
      { name: "<customer_name>", technical: "Tên khách hàng (30)", dataType: "string", content: "Sample" },
    ],
    codeExample: '{\n  "customer_name": "Sample"\n}',
    previewTitle: "Chăm sóc khách hàng", previewLogoBg: "oklch(0.55 0.18 30)", previewLogoText: "DN",
    previewBody: ["Xin chào <customer_name>,", "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi."],
    previewButton: "Liên hệ ngay",
  },
  "5": {
    id: "5", name: "Testingáasdasdsa", zbsId: "", status: "Nháp",
    type: "Mẫu tuỳ chỉnh", oaName: "Doanh nghiệp KCX Tân Thuận", oaColor: "oklch(0.55 0.18 30)",
    appName: "ZOA", pricePhone: "300 đ/tin", priceUID: "210 đ/tin",
    note: "", sent: "", createdAt: "21h25 08/05/2026", purpose: "Giao dịch", ztime: 7200,
    params: [
      { name: "<customer_name>", technical: "Tên khách hàng (30)",           dataType: "string", content: "Nguyễn Lê Minh Khoa" },
      { name: "<product_name>",  technical: "Tên sản phẩm / Thương hiệu (200)", dataType: "string", content: "Bàn phím Razer" },
      { name: "<company_name>",  technical: "Tên sản phẩm / Thương hiệu (200)", dataType: "string", content: "Bàn phím Razer" },
      { name: "<order_code>",    technical: "Tên khách hàng (30)",           dataType: "string", content: "Nguyễn Lê Minh Khoa" },
      { name: "<payment_status>",technical: "Tên khách hàng (30)",           dataType: "string", content: "Nguyễn Lê Minh Khoa" },
    ],
    codeExample: '{\n  "customer_name": "Nguyễn Lê Minh Khoa",\n  "product_name": "Bàn phím Razer",\n  "company_name": "Bàn phím Razer",\n  "order_code": "ORD-2026",\n  "payment_status": "Đã thanh toán"\n}',
    previewTitle: "Xin chào <customer_name>,", previewLogoBg: "oklch(0.55 0.18 30)", previewLogoText: "SU",
    previewBody: [
      "Cảm ơn bạn đã mua sản phẩm <product_name> tại cửa hàng chúng tôi.",
      "Chúng tôi rất vui vì trong rất nhiều lựa chọn, bạn đã luôn chọn sử dụng các sản phẩm của <company_name>.",
    ],
    previewButton: "Đến trang thông tin OA",
  },
  "6": {
    id: "6", name: "Mẫu thanh toán VIP", zbsId: "577890", status: "Đã duyệt",
    type: "Mẫu yêu cầu thanh toán", oaName: "Zalo Business Solutions", oaColor: "oklch(0.45 0.22 265)",
    appName: "Test ZBS App", pricePhone: "300 đ/tin", priceUID: "210 đ/tin",
    note: "", sent: "1 tin SĐT", createdAt: "09h10 07/05/2026", purpose: "Giao dịch", ztime: 7200,
    params: [
      { name: "<customer_name>",    technical: "Tên khách hàng (30)",    dataType: "string",             content: "Sample" },
      { name: "<contract_number>",  technical: "Tên khách hàng (30)",    dataType: "string",             content: "Sample" },
      { name: "<price>",            technical: "Tên khách hàng (30)",    dataType: "string",             content: "Sample" },
      { name: "<transfer_amount>",  technical: "Tiền tệ (VNĐ) (12)",    dataType: "currency",           content: "Sample" },
      { name: "<bank_transfer_note>", technical: "Bank Transfer Note (90)", dataType: "bank_transfer_note", content: "Sample" },
    ],
    codeExample: '{\n  "contract_number": "contract_number",\n  "transfer_amount": 15000,\n  "price": "price",\n  "customer_name": "customer_name",\n  "bank_transfer_note": "bank_transfer_note"\n}',
    previewTitle: "Thông tin thanh toán", previewLogoBg: "oklch(0.45 0.22 265)", previewLogoText: "ZBS",
    previewBody: [
      "OA name trân trọng thông báo đến Quý khách cước phí như sau:",
    ],
    previewButton: "Thanh toán ngay",
  },
  "7": {
    id: "7", name: "Voucher ưu đãi hè", zbsId: "577201", status: "Đang duyệt",
    type: "Mẫu Voucher", oaName: "Zalo Business Solutions", oaColor: "oklch(0.45 0.22 265)",
    appName: "Test ZBS App", pricePhone: "300 đ/tin", priceUID: "210 đ/tin",
    note: "Voucher hè 2026 cho khách hàng VIP", sent: "", createdAt: "14h30 06/05/2026", purpose: "Hậu mãi", ztime: 86400,
    params: [
      { name: "<customer_name>", technical: "Tên khách hàng (30)", dataType: "string",  content: "Nguyễn Văn A" },
      { name: "<voucher_code>",  technical: "Mã voucher (20)",     dataType: "string",  content: "SUMMER2026" },
      { name: "<discount>",      technical: "Tỷ lệ giảm giá",     dataType: "string",  content: "30%" },
    ],
    codeExample: '{\n  "customer_name": "Nguyễn Văn A",\n  "voucher_code": "SUMMER2026",\n  "discount": "30%"\n}',
    previewTitle: "Ưu đãi hè dành riêng cho bạn", previewLogoBg: "oklch(0.45 0.22 265)", previewLogoText: "ZBS",
    previewBody: ["Xin chào <customer_name>,", "Bạn nhận được voucher <voucher_code> giảm <discount> cho đơn hàng tiếp theo."],
    previewButton: "Dùng ngay",
  },
  "8": {
    id: "8", name: "OTP đăng nhập", zbsId: "576544", status: "Bị khóa",
    type: "Mẫu OTP", oaName: "Qc Test ZNS 4", oaColor: "#1a1a1a",
    appName: "QC Test ZNS 1", pricePhone: "300 đ/tin", priceUID: "210 đ/tin",
    note: "", sent: "204 tin SĐT", createdAt: "08h00 05/05/2026", purpose: "Giao dịch", ztime: 300,
    params: [
      { name: "<otp_code>", technical: "Mã OTP (6)", dataType: "string", content: "654321" },
    ],
    codeExample: '{\n  "otp_code": "654321"\n}',
    previewTitle: "Xác thực đăng nhập", previewLogoBg: "#1a1a1a", previewLogoText: "QC",
    previewBody: ["Mã xác thực đăng nhập của bạn là: <otp_code>", "Mã hết hạn sau 5 phút."],
  },
}

const statusStyle: Record<TemplateStatus, string> = {
  "Nháp":        "bg-gray-100 text-gray-500 border border-gray-300",
  "Đang duyệt":  "bg-yellow-50 text-yellow-700 border border-yellow-300",
  "Đã duyệt":    "bg-green-50 text-green-700 border border-green-300",
  "Bị từ chối":  "bg-red-50 text-red-600 border border-red-200",
  "Bị khóa":     "bg-gray-200 text-gray-500 border border-gray-300",
}

function OaAvatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white shrink-0" style={{ backgroundColor: color }}>
      {initials}
    </span>
  )
}

function TemplatePreview({ t, dark }: { t: TemplateDetail; dark: boolean }) {
  return (
    <div className={cn("rounded-lg border p-4 text-sm space-y-3 transition-colors", dark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-border text-foreground")}>
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-16 items-center justify-center rounded text-[10px] font-bold text-white" style={{ background: t.previewLogoBg }}>
          {t.previewLogoText}
        </div>
      </div>
      {/* Title */}
      <p className="font-semibold text-sm">{t.previewTitle}</p>
      {/* Body */}
      {t.previewBody.map((line, i) => (
        <p key={i} className={cn("text-xs leading-relaxed", dark ? "text-zinc-300" : "text-muted-foreground")}
          dangerouslySetInnerHTML={{ __html: line.replace(/<([^>]+)>/g, '<strong class="font-semibold ' + (dark ? 'text-white' : 'text-foreground') + '">&lt;$1&gt;</strong>') }}
        />
      ))}
      {/* Button */}
      {t.previewButton && (
        <button className="w-full rounded py-2 text-xs font-semibold text-white mt-2" style={{ background: "oklch(0.488 0.243 264.376)" }}>
          {t.previewButton}
        </button>
      )}
    </div>
  )
}

export default function TemplateDetailPage() {
  const params = useParams()
  const pathname = usePathname()
  const basePath = `/${pathname.split("/")[1]}`
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const t = detailMap[id ?? "1"] ?? detailMap["1"]
  const [dark, setDark] = useState(false)

  const fieldRows = [
    { label: "ID mẫu ZBS",             value: t.zbsId || <span className="text-muted-foreground">—</span> },
    { label: "Loại mẫu",               value: t.type },
    { label: "OA gửi",                 value: <div className="flex items-center gap-2"><OaAvatar name={t.oaName} color={t.oaColor} />{t.oaName}</div> },
    { label: "Ứng dụng",               value: t.appName },
    { label: "Đơn giá gửi qua SĐT",   value: <span style={{ color: "oklch(0.488 0.243 264.376)" }}>{t.pricePhone}</span> },
    { label: "Đơn giá gửi qua UID",   value: <span style={{ color: "oklch(0.488 0.243 264.376)" }}>{t.priceUID}</span> },
    { label: "Ghi chú cho kiểm duyệt", value: t.note || "" },
    { label: "Đã gửi",                 value: t.sent || "" },
    { label: "Thời gian tạo",          value: t.createdAt },
    { label: "Mục đích gửi",           value: t.purpose },
    { label: "Ztime (s)",              value: t.ztime },
  ]

  return (
    <div className="flex-1 overflow-y-auto">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-white">
            <Link href={`${basePath}/cong-cu/gui-tin/quan-ly-template`} className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-bold flex-1">Chi tiết mẫu Template</h1>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Send className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Download className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Body */}
          <div className="flex gap-0 h-[calc(100%-65px)]">
            {/* Left — detail */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Draft warning */}
              {t.status === "Nháp" && (
                <div className="flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-700">Mẫu ZBS chưa hoàn thành</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-blue-700 border-blue-300 hover:bg-blue-100 text-xs">
                    Tiếp tục tạo
                  </Button>
                </div>
              )}

              {/* Name + status */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-white shrink-0">
                  <span className="text-muted-foreground text-sm">⬜</span>
                </div>
                <span className="font-semibold text-base">{t.name}</span>
                <span className={cn("rounded px-2.5 py-0.5 text-xs font-medium ml-auto", statusStyle[t.status])}>
                  {t.status}
                </span>
              </div>

              {/* Fields */}
              <div className="rounded border border-border bg-white overflow-hidden">
                {fieldRows.map((row, i) => (
                  <div key={i} className={cn("grid grid-cols-[200px_1fr] px-5 py-3 text-sm", i < fieldRows.length - 1 ? "border-b border-border" : "")}>
                    <span className="font-semibold">{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}

                {/* Tham số */}
                <div className="grid grid-cols-[200px_1fr] px-5 py-3 text-sm border-t border-border items-start">
                  <span className="font-semibold pt-1">Tham số</span>
                  <div className="rounded border border-border overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-gray-50">
                          <th className="px-3 py-2 text-left font-semibold">Tên tham số</th>
                          <th className="px-3 py-2 text-left font-semibold">Cài đặt kỹ thuật</th>
                          <th className="px-3 py-2 text-left font-semibold">Loại dữ liệu</th>
                          <th className="px-3 py-2 text-left font-semibold">Nội dung tham số</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.params.map((p, j) => (
                          <tr key={j} className={j < t.params.length - 1 ? "border-b border-border" : ""}>
                            <td className="px-3 py-2 font-mono text-muted-foreground">{p.name}</td>
                            <td className="px-3 py-2">{p.technical}</td>
                            <td className="px-3 py-2">{p.dataType}</td>
                            <td className="px-3 py-2">{p.content}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Code example */}
              <div className="rounded border border-border bg-white overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                  <h3 className="text-sm font-semibold">Mẫu code ví dụ</h3>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="bg-zinc-900 text-green-400 text-xs p-5 overflow-x-auto leading-relaxed font-mono">
                  {t.codeExample}
                </pre>
              </div>
            </div>

            {/* Right — preview */}
            <div className="w-72 shrink-0 border-l border-border bg-gray-50 overflow-y-auto p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Xem trước Template</h3>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Giao diện tối</span>
                <Switch checked={dark} onCheckedChange={setDark} size="sm" />
              </div>
              <TemplatePreview t={t} dark={dark} />
            </div>
          </div>
    </div>
  )
}
