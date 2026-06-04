import BaoCaoChiTietClient from "@/app/cong-cu/gui-tin/chat-luong-gui-tin/[id]/_client"

export function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({ id: String(i + 1) }))
}

export default function BaoCaoChiTietPage() {
  return <BaoCaoChiTietClient />
}
