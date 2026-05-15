# ZBS Account UI — Project Brief

Prototype giao diện quản lý tài khoản Zalo Business Solutions. Mục đích: test UX/UI nhanh với PM/Designer, không phải production code.

## Stack

- **Next.js 16** App Router, Turbopack, `"use client"` trên mọi page
- **Tailwind CSS v4** — dùng `oklch()` cho màu sắc, không dùng hex
- **shadcn/ui** — components ở `components/ui/`
- **Recharts 3** — cho mọi biểu đồ
- **pnpm** — package manager

## Multi-prototype architecture

Landing hub tại `/` liệt kê tất cả prototypes. Mỗi người có URL riêng:

- `/base` — prototype gốc, tham chiếu chuẩn
- `/phatnt11` — fork của Phát
- `/[username]` — thêm người mới bằng cách tạo `app/[username]/`

### Thêm người mới

1. Tạo `app/[username]/page.tsx` — copy từ `app/base/page.tsx`, đổi `basePath="/base"` → `basePath="/[username]"`
2. Thêm entry vào mảng `prototypes` trong `app/page.tsx`
3. Để override một trang cụ thể: tạo `app/[username]/chi-tieu/tin-template/page.tsx` với component tùy chỉnh và `<ZbsSidebar basePath="/[username]" />`
4. Các trang chưa override sẽ dùng lại component từ `app/base/` (import trực tiếp)

### ZbsSidebar basePath

`ZbsSidebar` nhận prop `basePath?: string` — prefix mọi href trong sidebar:

```tsx
<ZbsSidebar basePath="/base" />      // sidebar dẫn tới /base/chi-tieu/...
<ZbsSidebar basePath="/phatnt11" />  // sidebar dẫn tới /phatnt11/chi-tieu/...
```

## Global header

`components/global-header.tsx` — thanh dark `ZBS Product` fixed trên **tất cả mọi trang**, chứa quote PM (tự đổi 30s, click đổi ngay) và đồng hồ. Không xóa/di chuyển component này.

- Height: **36px**, fixed tại `top: 2rem` (32px của PrototypeSwitcher), z-index 45
- Tổng chiều cao fixed header = **68px** (32 + 36)
- Quotes được hardcode trong file — ~170 PM quotes, không dùng API ngoài

## Layout pattern — áp dụng cho mọi page thường (có sidebar)

```tsx
export default function SomePage() {
  return (
    <SidebarProvider>
      <ZbsSidebar basePath="/base" />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-5 h-[calc(100vh-56px)]">
          {/* nội dung */}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

Không được thay đổi pattern này — sidebar toggle, layout gap fix đều phụ thuộc vào nó.

## Standalone pages (không có sidebar)

Dùng cho các flow multi-step (nạp tiền, tạo template…):

```tsx
export default function StandalonePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <ZbsHeader standalone />   {/* logo + user, sticky top-[68px], không có nút Nạp tiền */}
      <div className="...">
        {/* content */}
      </div>
    </div>
  )
}
```

`ZbsHeader` nhận prop `standalone?: boolean`:
- `standalone={true}` → hiện Zalo logo (click về trang chủ), **ẩn** nút Nạp tiền, `sticky top-[68px] z-40`
- Không truyền / `standalone={false}` → header bình thường với nút Nạp tiền

Các route standalone phải được thêm vào `STANDALONE_ROUTES` trong layout cha nếu có (ví dụ gui-tin layout).

## Màu sắc & design tokens

| Dùng cho | Giá trị |
|---|---|
| Primary blue | `oklch(0.45 0.22 265)` — sidebar active, badge, button |
| Orange accent | `oklch(0.7 0.2 50)` |
| Teal accent | `oklch(0.7 0.13 185)` |
| Text muted | `text-muted-foreground` |
| Border | `border-border` |
| Background cards | `bg-white` |

**Không dùng màu Tailwind tĩnh** (blue-600, gray-200...) cho các màu brand — dùng oklch hoặc CSS variable để đồng nhất.

## Sidebar navigation

Thêm trang mới vào `components/zbs-sidebar.tsx` trong mảng `navSections`. Cấu trúc:
```ts
{ label: "Tên hiển thị", href: "/duong-dan" }
// Hoặc với badge:
{ label: "Tên", href: "/duong-dan", badge: "Beta" }
// Hoặc external link:
{ label: "Tên", href: "/duong-dan", external: true }
```

## Tạo trang mới — checklist

1. Tạo file `app/<section>/<page>/page.tsx`
2. Thêm route vào sidebar (`components/zbs-sidebar.tsx`)
3. Dùng đúng layout pattern ở trên
4. Mock data: để inline trong file (prototype, không cần tách riêng)
5. Filter/search: implement client-side với `useState`

## Quy ước đặt tên file

```
app/base/chi-tieu/tin-template/page.tsx   ✓ kebab-case, dưới base/
app/base/giao-dich/lich-su/page.tsx       ✓
app/phatnt11/page.tsx                     ✓ fork theo username
components/zbs-sidebar.tsx                ✓ kebab-case
```

## Những thứ KHÔNG làm

- Không tách mock data ra file riêng — giữ inline để dễ đọc và chỉnh
- Không thêm API calls thật — prototype chỉ dùng mock data
- Không cài thêm thư viện chart ngoài Recharts
- Không tạo abstraction layer (custom hooks, context) trừ khi dùng ≥3 lần
- Không sửa `components/ui/` (shadcn components) — extend bằng wrapper nếu cần
- Không push thẳng lên `main` — luôn dùng branch `prototype/<tên>`

## Quyền chỉnh sửa theo prototype

Trước khi edit bất kỳ file nào, hãy xác định scope làm việc:

| Scope | Ai được edit |
|---|---|
| `app/base/` | Base maintainer (`@patrickphat`) |
| `components/` | Base maintainer |
| `app/globals.css`, `next.config.mjs` | Base maintainer |
| `app/phatnt11/` | phatnt11 hoặc base maintainer |
| `app/viht2/` | viht2 hoặc base maintainer |
| `app/hainlb/` | hainlb hoặc base maintainer |

**Nguyên tắc khi Claude hỗ trợ một prototype cụ thể:**

- **Tính năng riêng** → tạo/sửa file trong `app/<username>/` — không đụng vào `app/base/` hay `components/`
- **Bug ở shared code** (`components/`, `app/base/`, CSS) → cần xác nhận rõ ràng trước khi Claude edit, vì thay đổi ảnh hưởng tất cả prototypes
- **Khi không chắc** → hỏi lại "File này là shared code, sửa sẽ ảnh hưởng tất cả prototypes — bạn có muốn tiếp tục không?"

Git hook và CODEOWNERS là lớp bảo vệ thực sự — CLAUDE.md chỉ là hướng dẫn tư duy.

## Branch workflow

```bash
# Bắt đầu tính năng mới
git checkout -b prototype/<ten-tinh-nang>

# Merge vào main khi đã duyệt
git checkout main && git merge prototype/<ten-tinh-nang>
```

## Lưu ý CSS quan trọng

File `app/globals.css` có các override quan trọng — **không xóa**:

```css
/* Fix sidebar gap */
[data-slot="sidebar-gap"] { width: 220px !important; }
[data-slot="sidebar-container"] {
  width: 220px !important;
  top: 4.25rem !important;          /* 68px = 32px PrototypeSwitcher + 36px GlobalHeader */
  height: calc(100svh - 4.25rem) !important;
}

/* Fix sidebar collapse (Tailwind v4 không generate các class này) */
.group[data-collapsible="offcanvas"] [data-slot="sidebar-gap"] { width: 0 !important; }
.group[data-collapsible="offcanvas"] [data-slot="sidebar-container"][data-side="left"] { left: -220px !important; }
```

## Deploy lên surge.sh

**URL production:** https://zbs-prototype.surge.sh  
**Surge account:** patricknewyen@gmail.com (credentials đã lưu trên máy sau lần login đầu)

```bash
# Build static export + deploy (chạy từ thư mục gốc project)
pnpm build:surge && cp out/index.html out/200.html && surge out zbs-prototype.surge.sh
```

Hoặc dùng shortcut:
```bash
pnpm deploy
```

**Lưu ý:**
- Script `build:surge` set `DEPLOY=1` → next.config.mjs bật `output: "export"` và `trailingSlash: true`
- `cp out/index.html out/200.html` là bắt buộc để surge phục vụ đúng client-side routing
- Nếu surge hỏi login, credentials đã được lưu — chỉ cần nhấn Enter hoặc nhập lại email patricknewyen@gmail.com
- Sau deploy, verify tại https://zbs-prototype.surge.sh/base

## Setup môi trường dev

```bash
# Clone và cài (lần đầu)
git clone https://github.com/ZBS-Product/zbs-account-prototype.git ~/code/zbs-account-ui
cd ~/code/zbs-account-ui
pnpm install

# Chạy dev server (autoPort — tự tìm port trống nếu 3000 đã dùng)
pnpm dev
```

Dev server chạy tại http://localhost:3000 (hoặc port khác nếu 3000 bận — xem log terminal).
