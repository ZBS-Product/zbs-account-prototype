"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

// Redirect về quan-ly-template, giữ nguyên prototype prefix trong URL
// /base/cong-cu/gui-tin → /base/cong-cu/gui-tin/quan-ly-template
// /viht2/cong-cu/gui-tin → /viht2/cong-cu/gui-tin/quan-ly-template
export default function GuiTinRoot() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    router.replace(`${pathname}/quan-ly-template`)
  }, [pathname, router])

  return null
}
