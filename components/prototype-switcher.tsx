"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export const PROTOTYPES = [
  { id: "base",     label: "Base",     color: "bg-blue-500",   textColor: "text-blue-400"   },
  { id: "phatnt11", label: "phatnt11", color: "bg-purple-500", textColor: "text-purple-400" },
  { id: "viht2",    label: "viht2",    color: "bg-emerald-500",textColor: "text-emerald-400"},
  { id: "hainlb",   label: "hainlb",   color: "bg-orange-500", textColor: "text-orange-400" },
]

function getProtoAndSubpath(pathname: string) {
  for (const p of PROTOTYPES) {
    if (pathname === `/${p.id}` || pathname.startsWith(`/${p.id}/`)) {
      const subPath = pathname.slice(`/${p.id}`.length) || "/"
      return { protoId: p.id, subPath }
    }
  }
  return { protoId: null, subPath: "/" }
}

export default function PrototypeSwitcher() {
  const pathname = usePathname()
  const { protoId: activeId, subPath } = getProtoAndSubpath(pathname)

  // Không hiện trên trang hub
  if (!activeId) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex h-8 items-center gap-1 bg-gray-950 px-3 text-xs">
      {/* Label */}
      <span className="text-gray-500 mr-2 shrink-0">🧪 Prototype:</span>

      {/* Toggle buttons */}
      <div className="flex items-center gap-1">
        {PROTOTYPES.map((p) => {
          const isActive = p.id === activeId
          const href = `/${p.id}${subPath === "/" ? "" : subPath}`
          return (
            <Link
              key={p.id}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-0.5 transition-colors font-medium",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", p.color)} />
              {p.label}
              {isActive && <span className="text-gray-500 font-normal">← current</span>}
            </Link>
          )
        })}
      </div>

      {/* Current path indicator */}
      <div className="ml-auto font-mono text-gray-600 truncate hidden sm:block">
        /{activeId}{subPath === "/" ? "" : subPath}
      </div>
    </div>
  )
}
