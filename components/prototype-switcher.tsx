"use client"

import { usePathname, useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"

export const PROTOTYPES = [
  { id: "base",     label: "Base",     color: "bg-blue-500"    },
  { id: "phatnt11", label: "phatnt11", color: "bg-purple-500"  },
  { id: "viht2",    label: "viht2",    color: "bg-emerald-500" },
  { id: "hainlb",   label: "hainlb",   color: "bg-orange-500"  },
]

const DOT_COLORS: Record<string, string> = {
  base:     "#3b82f6",
  phatnt11: "#a855f7",
  viht2:    "#10b981",
  hainlb:   "#f97316",
}

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
  const router = useRouter()
  const { protoId: activeId, subPath } = getProtoAndSubpath(pathname)

  // Không hiện trên trang hub
  if (!activeId) return null

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newId = e.target.value
    const dest = `/${newId}${subPath === "/" ? "" : subPath}`
    router.push(dest)
  }

  const dotColor = DOT_COLORS[activeId] ?? "#6b7280"

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex h-8 items-center gap-2 bg-gray-950 px-3 text-xs">
      {/* Label */}
      <span className="text-gray-500 shrink-0">🧪 Prototype:</span>

      {/* Select dropdown */}
      <div className="relative flex items-center">
        {/* Colored dot for current proto */}
        <span
          className="absolute left-2 h-2 w-2 rounded-full shrink-0 pointer-events-none z-10"
          style={{ background: dotColor }}
        />
        <select
          value={activeId}
          onChange={handleChange}
          className="appearance-none bg-white/10 text-white text-xs pl-6 pr-6 h-6 rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20 border-0"
          style={{ colorScheme: "dark" }}
        >
          {PROTOTYPES.map((p) => (
            <option key={p.id} value={p.id} className="bg-gray-900 text-white">
              {p.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-1.5 h-3 w-3 text-gray-400 pointer-events-none" />
      </div>

      {/* Current path */}
      <div className="ml-auto font-mono text-gray-600 truncate hidden sm:block">
        /{activeId}{subPath === "/" ? "" : subPath}
      </div>
    </div>
  )
}
