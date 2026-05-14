# ZBS Account UI — Prototype

Prototype giao diện quản lý tài khoản cho **Zalo Business Solutions**, xây dựng bằng Next.js 16, shadcn/ui và Tailwind CSS v4.

---

## Screenshots

### Tổng quan
![Tổng quan](docs/screenshots/tong-quan.png)

### Chi tiêu tin Template
![Chi tiêu tin Template](docs/screenshots/chi-tieu-tin-template.png)

### Dịch vụ gửi tin — Gửi theo chiến dịch
![Gửi theo chiến dịch](docs/screenshots/gui-tin.png)

---

## Tech Stack

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Charts | [Recharts 3](https://recharts.org) |
| Icons | [Lucide React](https://lucide.dev) |
| Language | TypeScript |
| Package Manager | pnpm |

---

## Trang đã có

| Route | Tên trang | Mô tả |
|---|---|---|
| `/` | Tổng quan | Dashboard chi tiêu tổng hợp theo ngày/tuần/tháng, biểu đồ stacked bar và pie |
| `/chi-tieu/tin-template` | Chi tiêu tin Template | KPI cards, combo chart, pie charts theo ứng dụng/OA, bảng lịch sử |
| `/cong-cu/gui-tin` | Dịch vụ gửi tin | Danh sách chiến dịch, filter trạng thái & CSKH, tạo chiến dịch |

---

## Cài đặt & Chạy

```bash
# Cài dependencies
pnpm install

# Chạy dev server
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

---

## Cấu trúc thư mục

```
app/
├── page.tsx                        # Tổng quan (/)
├── chi-tieu/
│   └── tin-template/page.tsx       # Chi tiêu tin Template
└── cong-cu/
    └── gui-tin/page.tsx            # Dịch vụ gửi tin
components/
├── zbs-sidebar.tsx                 # Sidebar điều hướng
├── zbs-header.tsx                  # Header (nạp tiền, user info, sidebar toggle)
└── ui/                             # shadcn/ui components
```
