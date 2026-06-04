"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Copy, Check, ArrowLeft, TriangleAlert } from "lucide-react"
import ZbsHeader from "@/components/zbs-header"

const ROOT_SECTIONS = new Set(["cong-cu", "chi-tieu", "cai-dat", "giao-dich", "bao-cao", ""])

export default function ChuyenKhoanPage() {
  const pathname = usePathname()
  const router = useRouter()
  const seg = pathname.split("/")[1] ?? ""
  const basePath = ROOT_SECTIONS.has(seg) ? "" : `/${seg}`

  const [copiedAccount, setCopiedAccount] = useState(false)
  const [copiedName, setCopiedName] = useState(false)

  function copy(text: string, setCopied: (v: boolean) => void) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <ZbsHeader standalone />

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col items-center py-8 px-4">
        {/* Sub-nav */}
        <div className="w-full max-w-5xl mb-4">
          <button
            onClick={() => router.push(`${basePath}/giao-dich/nap-tien`)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Hình thức nạp tiền
          </button>
        </div>

        <h1 className="text-xl font-bold mb-6">Chuyển khoản</h1>

        <div className="flex gap-5 w-full max-w-5xl items-start">
          {/* Left — main card */}
          <div className="flex-1 space-y-4">
            <div className="rounded-xl border border-border bg-white p-6">
              <p className="font-semibold text-sm mb-4">Hướng dẫn nạp tiền qua chuyển khoản nhanh</p>

              <div className="grid grid-cols-2 gap-6">
                {/* Account info */}
                <div className="space-y-4 border-r border-border pr-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Số tài khoản thụ hưởng:</p>
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-border bg-gray-50 px-3 py-1 text-sm font-mono font-semibold">
                        ZBS206239001
                      </span>
                      <button
                        onClick={() => copy("ZBS206239001", setCopiedAccount)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {copiedAccount
                          ? <><Check className="h-3.5 w-3.5" /> Đã sao chép</>
                          : <><Copy className="h-3.5 w-3.5" /> Sao chép</>
                        }
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Ngân hàng thụ hưởng:</p>
                    <p className="text-sm font-semibold">MSB – Ngân hàng TMCP Hàng Hải Việt Nam – Chi nhánh Tân Bình</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tên tài khoản thụ hưởng:</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded border border-border bg-gray-50 px-3 py-1 text-xs font-mono font-semibold">
                        CONG TY TNHH ZALO PLATFORMS TK ZBS206239001
                      </span>
                      <button
                        onClick={() => copy("CONG TY TNHH ZALO PLATFORMS TK ZBS206239001", setCopiedName)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
                      >
                        {copiedName
                          ? <><Check className="h-3.5 w-3.5" /> Đã sao chép</>
                          : <><Copy className="h-3.5 w-3.5" /> Sao chép</>
                        }
                      </button>
                    </div>
                  </div>
                </div>

                {/* QR code */}
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="text-xs text-muted-foreground text-center">Hoặc quét mã QR bằng ứng dụng ngân hàng</p>
                  {/* Mock QR code */}
                  <div className="h-36 w-36 rounded-lg border-2 border-gray-300 bg-white flex items-center justify-center relative overflow-hidden">
                    <svg viewBox="0 0 100 100" className="h-full w-full p-2">
                      {/* Simplified QR pattern */}
                      <rect x="5" y="5" width="30" height="30" fill="none" stroke="#000" strokeWidth="3"/>
                      <rect x="12" y="12" width="16" height="16" fill="#000"/>
                      <rect x="65" y="5" width="30" height="30" fill="none" stroke="#000" strokeWidth="3"/>
                      <rect x="72" y="12" width="16" height="16" fill="#000"/>
                      <rect x="5" y="65" width="30" height="30" fill="none" stroke="#000" strokeWidth="3"/>
                      <rect x="12" y="72" width="16" height="16" fill="#000"/>
                      {[40,45,50,55,60].map(x => [40,45,50,55,60].map(y => (
                        Math.random() > 0.5
                          ? <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="#000"/>
                          : null
                      )))}
                      <rect x="40" y="40" width="20" height="20" fill="white"/>
                      <text x="50" y="54" textAnchor="middle" fontSize="10" fill="#E31837" fontWeight="bold">❤</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning note */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2 mb-2">
                <TriangleAlert className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm font-semibold text-amber-800">Lưu ý:</p>
              </div>
              <ul className="space-y-2 text-xs text-amber-900 ml-6 list-disc">
                <li>
                  Quý khách vui lòng <strong>quét mã QR để thanh toán</strong> hoặc <strong>nhập chính xác thông tin tài khoản</strong> được cung cấp như hướng dẫn bên trên để thực hiện nạp tiền. Xem thêm hướng dẫn sử dụng Chuyển khoản nhanh tại <a href="#" className="underline font-semibold">ĐÂY</a>
                </li>
                <li>
                  Trong trường hợp Quý khách <strong>chuyển khoản vào tài khoản chính của Zalo Platforms</strong> thay vì Tài khoản ZBS của doanh nghiệp, Chúng tôi sẽ chủ động liên hệ tới Quý khách và <strong>hoàn khoản tiền trước ngày làm việc cuối cùng của tháng kế tiếp</strong>. Chi tiết xem tại <a href="#" className="underline font-semibold">ĐÂY</a>
                </li>
                <li>
                  Zalo Business Solutions không chịu trách nhiệm cho bất kỳ tổn thất nào xảy ra nếu Quý khách không nhập đúng thông tin chuyển khoản.
                </li>
                <li>
                  Vui lòng <strong>giữ lại Uỷ nhiệm chi hoặc biên lai giao dịch</strong> để đối chứng khi cần thiết.
                </li>
              </ul>
            </div>
          </div>

          {/* Right — support panel */}
          <div className="w-[260px] shrink-0 sticky top-4">
            <div className="rounded-xl border border-border bg-white p-5 space-y-2">
              <h3 className="font-semibold text-sm">Thông tin hỗ trợ</h3>
              <p className="text-xs text-muted-foreground">
                Nếu quý khách cần hỗ trợ trong quá trình chuyển khoản, vui lòng nộp biểu mẫu hỗ trợ tại{" "}
                <a href="#" className="text-blue-600 underline font-semibold">ĐÂY</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
