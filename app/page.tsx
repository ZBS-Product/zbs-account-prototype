import Link from "next/link"

const prototypes = [
  {
    id: "base",
    name: "Base",
    path: "/base",
    description: "Bản gốc — ZBS Account UI prototype chuẩn",
    color: "bg-blue-500",
    initials: "B",
  },
  {
    id: "phatnt11",
    name: "phatnt11",
    path: "/phatnt11",
    description: "Prototype của Phát",
    color: "bg-purple-500",
    initials: "P",
  },
  {
    id: "viht2",
    name: "viht2",
    path: "/viht2",
    description: "Prototype của Vih",
    color: "bg-emerald-500",
    initials: "V",
  },
  {
    id: "hainlb",
    name: "hainlb",
    path: "/hainlb",
    description: "Prototype của Hải",
    color: "bg-orange-500",
    initials: "H",
  },
]

export default function PrototypeHub() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ZBS Prototype Hub</h1>
            <p className="text-sm text-gray-500">Chọn prototype để xem</p>
          </div>
        </div>

        {/* Prototype cards */}
        <div className="grid gap-3">
          {prototypes.map((p) => (
            <Link
              key={p.id}
              href={p.path}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className={`h-10 w-10 rounded-full ${p.color} flex items-center justify-center shrink-0`}>
                <span className="text-white font-semibold text-sm">{p.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{p.name}</span>
                  <span className="text-xs text-gray-400 font-mono">{p.path}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 truncate">{p.description}</p>
              </div>
              <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-lg">→</span>
            </Link>
          ))}
        </div>

        {/* Add new */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Thêm prototype mới: tạo folder <code className="bg-gray-100 px-1 rounded">app/[username]/</code> và thêm vào danh sách trên
        </p>
      </div>
    </div>
  )
}
