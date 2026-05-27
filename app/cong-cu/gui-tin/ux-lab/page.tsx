"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, ExternalLink } from "lucide-react"

const ROOT_SECTIONS = new Set(["cong-cu", "chi-tieu", "cai-dat", "giao-dich", "bao-cao", ""])

const OPTIONS = [
  {
    id: "B",
    color: "oklch(0.488 0.243 264.376)",
    colorBg: "oklch(0.96 0.04 265)",
    colorBorder: "oklch(0.85 0.10 265)",
    href: "/tao-template-b",
    label: "Option B",
    title: "Sidebar Config + Full-width Composer",
    description: "Tách biệt hoàn toàn phần cài đặt meta (loại, mục đích, App/OA) ra sidebar trái, phần soạn nội dung được mở rộng ra chiếm phần lớn màn hình.",
    highlight: "Giảm cognitive load — user không bị distract bởi config khi đang soạn nội dung",
    pros: ["Ít thay đổi nhất so với flow hiện tại", "Composer rộng hơn, thoáng hơn", "Power user quen nhanh"],
    cons: ["3 cột hơi chật trên màn nhỏ", "Vẫn có cảm giác form"],
    preview: (
      <div className="h-28 rounded-lg overflow-hidden border border-border flex text-[9px]">
        <div className="w-16 bg-gray-50 border-r border-border p-1.5 space-y-1">
          <div className="h-2 bg-blue-200 rounded-full w-full" />
          <div className="h-1.5 bg-gray-200 rounded-full w-3/4" />
          <div className="h-1.5 bg-gray-200 rounded-full w-full" />
          <div className="h-1.5 bg-gray-200 rounded-full w-4/5" />
          <div className="mt-2 h-2 bg-gray-200 rounded-full w-full" />
          <div className="h-1.5 bg-gray-200 rounded-full w-3/4" />
        </div>
        <div className="flex-1 p-1.5 space-y-1">
          <div className="h-2 bg-blue-100 rounded w-full" />
          <div className="h-6 bg-gray-100 rounded w-full" />
          <div className="h-6 bg-gray-100 rounded w-full" />
          <div className="flex gap-1 mt-1">
            <div className="h-3 bg-gray-200 rounded flex-1" />
            <div className="h-3 bg-gray-200 rounded flex-1" />
          </div>
        </div>
        <div className="w-14 bg-gray-50 border-l border-border p-1.5 space-y-1">
          <div className="h-16 bg-white rounded border border-border" />
          <div className="h-3 rounded w-full" style={{ background: "oklch(0.488 0.243 264.376)" }} />
        </div>
      </div>
    ),
  },
  {
    id: "C",
    color: "oklch(0.55 0.16 165)",
    colorBg: "oklch(0.96 0.04 165)",
    colorBorder: "oklch(0.85 0.10 165)",
    href: "/tao-template-c",
    label: "Option C",
    title: "Template Gallery First",
    description: "Thay vì bắt đầu bằng form trắng, user chọn từ thư viện mẫu theo ngành (TMĐT, Y tế, F&B, Tài chính). Composer được pre-fill sẵn nội dung.",
    highlight: "Giảm thời gian tạo template đầu tiên — user \"chỉnh\" thay vì \"tạo từ đầu\"",
    pros: ["Onboarding nhanh cho user mới", "Giảm blank-canvas anxiety", "Dễ standardize content"],
    cons: ["Cần maintain thư viện mẫu", "Advanced user vẫn cần tạo từ đầu"],
    preview: (
      <div className="h-28 rounded-lg overflow-hidden border border-border">
        <div className="h-7 bg-green-50 border-b border-border px-2 flex items-center gap-1">
          <div className="h-2 bg-green-200 rounded-full w-16" />
          <div className="h-1.5 bg-gray-200 rounded-full w-10" />
        </div>
        <div className="p-1.5 grid grid-cols-4 gap-1">
          {["oklch(0.85 0.12 265)","oklch(0.85 0.12 165)","oklch(0.85 0.15 50)","oklch(0.85 0.12 220)",
            "oklch(0.85 0.12 265)","oklch(0.85 0.12 300)","oklch(0.85 0.12 165)","oklch(0.85 0.15 50)"].map((bg, i) => (
            <div key={i} className="rounded border border-border overflow-hidden">
              <div className="h-5" style={{ background: bg }} />
              <div className="p-0.5 space-y-0.5">
                <div className="h-1 bg-gray-300 rounded-full" />
                <div className="h-1 bg-gray-200 rounded-full w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "D",
    color: "oklch(0.5 0.18 185)",
    colorBg: "oklch(0.96 0.04 185)",
    colorBorder: "oklch(0.85 0.10 185)",
    href: "/tao-template-d",
    label: "Option D",
    title: "Canvas WYSIWYG",
    description: "Preview chính là canvas để edit. Click trực tiếp vào tiêu đề, văn bản, bảng, nút → chỉnh sửa tại chỗ. Panel phải là property inspector ngữ cảnh.",
    highlight: "\"Bạn thấy gì là bạn chỉnh cái đó\" — không có độ trễ nhận thức giữa form và preview",
    pros: ["Trải nghiệm tự nhiên nhất", "Không có khái niệm form", "Giảm back-and-forth trái/phải"],
    cons: ["Phức tạp nhất để implement đầy đủ", "Cần xử lý nhiều edge case inline-editing"],
    preview: (
      <div className="h-28 rounded-lg overflow-hidden border border-border flex">
        <div className="flex-1 flex items-center justify-center p-2" style={{ background: "oklch(0.94 0.02 265)" }}>
          <div className="w-full rounded-lg border-2 border-blue-400 bg-white p-1.5 space-y-1 shadow-md">
            <div className="h-2.5 bg-orange-100 rounded px-1 flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded bg-orange-400" />
              <div className="h-1 bg-orange-200 rounded-full flex-1" />
            </div>
            <div className="h-1.5 bg-blue-100 rounded-full w-full ring-1 ring-blue-400" />
            <div className="h-4 bg-gray-50 rounded border border-blue-200" />
            <div className="h-3 rounded w-full" style={{ background: "oklch(0.488 0.243 264.376)" }} />
          </div>
        </div>
        <div className="w-16 bg-white border-l border-border p-1.5 space-y-1">
          <div className="h-1.5 bg-gray-300 rounded-full w-3/4" />
          <div className="h-1.5 bg-blue-200 rounded w-full" />
          <div className="h-1.5 bg-blue-200 rounded w-full" />
          <div className="h-1.5 bg-blue-200 rounded w-4/5" />
          <div className="mt-1.5 h-1.5 bg-gray-300 rounded-full w-3/4" />
          <div className="h-3 bg-gray-100 rounded border border-border" />
          <div className="h-3 bg-gray-100 rounded border border-border" />
        </div>
      </div>
    ),
  },
]

export default function UxLabPage() {
  const pathname = usePathname()
  const seg = pathname.split("/")[1] ?? ""
  const basePath = ROOT_SECTIONS.has(seg) ? "" : `/${seg}`

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: "oklch(0.6 0.18 185)" }}>
            UX Lab
          </span>
          <span className="text-xs text-muted-foreground">Prototype · Không phải production</span>
        </div>
        <h1 className="text-xl font-bold mt-2">So sánh hướng redesign Tạo Template</h1>
        <p className="text-sm text-muted-foreground mt-1">
          3 approach khác nhau để tối ưu UX trang tạo ZNS Template. Click vào từng option để trải nghiệm trực tiếp.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        {OPTIONS.map(opt => (
          <div key={opt.id} className="rounded-xl border border-border bg-white overflow-hidden flex flex-col">
            {/* Badge + title */}
            <div className="px-4 pt-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: opt.colorBg, color: opt.color, border: `1px solid ${opt.colorBorder}` }}>
                  {opt.label}
                </span>
              </div>
              <h2 className="text-sm font-bold leading-snug">{opt.title}</h2>
            </div>

            {/* Preview diagram */}
            <div className="px-4 py-3">
              {opt.preview}
            </div>

            {/* Description */}
            <div className="px-4 pb-3 flex-1 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{opt.description}</p>

              {/* Highlight */}
              <div className="rounded-lg px-3 py-2 text-xs leading-snug font-medium" style={{ background: opt.colorBg, color: opt.color }}>
                💡 {opt.highlight}
              </div>

              {/* Pros / Cons */}
              <div className="space-y-1.5">
                {opt.pros.map(p => (
                  <div key={p} className="flex items-start gap-1.5 text-[11px] text-green-700">
                    <span className="shrink-0 mt-0.5">✓</span>
                    <span>{p}</span>
                  </div>
                ))}
                {opt.cons.map(c => (
                  <div key={c} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                    <span className="shrink-0 mt-0.5">·</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="px-4 pb-4">
              <Link
                href={`${basePath}/cong-cu/gui-tin${opt.href}`}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: opt.color }}
                target="_blank"
              >
                Xem prototype <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Compare table */}
      <div className="mt-6 rounded-xl border border-border bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">So sánh nhanh</h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="text-left px-5 py-2.5 font-medium text-muted-foreground">Tiêu chí</th>
              {OPTIONS.map(o => (
                <th key={o.id} className="text-center px-4 py-2.5 font-semibold" style={{ color: o.color }}>{o.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Phù hợp user mới", "★★★", "★★★★★", "★★★★"],
              ["Phù hợp power user", "★★★★★", "★★★", "★★★★"],
              ["Effort implement", "Thấp", "Trung bình", "Cao"],
              ["Giảm cảm giác form", "★★★", "★★★★", "★★★★★"],
              ["Tốc độ tạo template", "Trung bình", "Nhanh (mẫu sẵn)", "Trung bình"],
            ].map(([label, ...vals]) => (
              <tr key={label as string} className="border-b border-border last:border-0">
                <td className="px-5 py-2.5 text-muted-foreground">{label}</td>
                {vals.map((v, i) => (
                  <td key={i} className="text-center px-4 py-2.5 font-medium">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-muted-foreground mt-4 text-center">
        Prototype · Mock data · Không có API thật
      </p>
    </div>
  )
}
