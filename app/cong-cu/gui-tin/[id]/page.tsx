import TemplateDetailClient from "./_client"

export function generateStaticParams() {
  return ["1","2","3","4","5","6","7","8"].map((id) => ({ id }))
}

export default function TemplateDetailPage() {
  return <TemplateDetailClient />
}
