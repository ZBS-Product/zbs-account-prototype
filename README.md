# 🎨 ZBS Account UI — Prototype

> Prototype giao diện quản lý tài khoản Zalo Business Solutions.  
> Dành cho PM/Designer — không cần biết code.

---

## 🌐 Xem prototype online

**👉 https://zbs-prod.vercel.app**

---

## 🗂️ Trang đã có

| Route | Tên trang |
|---|---|
| `/` | 📊 Tổng quan |
| `/chi-tieu/tin-template` | 📨 Chi tiêu tin Template |
| `/chi-tieu/oa` | 📡 Chi tiêu OA |
| `/chi-tieu/ngan-sach` | 💰 Quản lý Ngân sách |
| `/cong-cu/gui-tin` | 📤 Dịch vụ gửi tin |
| `/cong-cu/gui-tin/quan-ly-template` | 📋 Quản lý Template |
| `/cong-cu/gui-tin/tao-template` | ➕ Tạo Template (wizard 3 bước) |
| `/cong-cu/gui-tin/chat-luong-gui-tin` | 📶 Chất lượng gửi tin SĐT |
| `/cong-cu/gui-tin/quan-ly-logo` | 🖼️ Quản lý Logo |
| `/cong-cu/gui-tin/gui-theo-chien-dich` | 🎯 Gửi theo chiến dịch |
| `/giao-dich/nap-tien` | 💳 Nạp tiền (4 hình thức) |
| `/giao-dich/nap-tien/chuyen-khoan` | 🏦 Hướng dẫn chuyển khoản |
| `/giao-dich/lich-su` | 🧾 Lịch sử giao dịch |
| `/giao-dich/hoa-don` | 🧾 Quản lý hóa đơn |
| `/cai-dat/tai-khoan` | 👤 Thông tin tài khoản |
| `/cai-dat/tai-san` | 🔗 Quản lý tài sản |
| `/cai-dat/thanh-vien` | 👥 Quản lý thành viên |
| `/cai-dat/thong-bao` | 🔔 Quản lý thông báo |

---

## 🚀 Chạy prototype trên máy

> Cần làm nếu muốn thấy thay đổi ngay lập tức khi Claude Code chỉnh code.  
> Nếu chỉ xem — dùng link online ở trên là đủ.

### Bước 1 — Cài Claude Code *(chỉ làm 1 lần)*

Tải và cài tại: **[claude.ai/code](https://claude.ai/code)**

### Bước 2 — Mở Terminal, gõ `claude`, paste prompt này

```
Setup prototype ZBS Account UI cho mình:
- Clone repo https://github.com/ZBS-Product/zbs-account-prototype.git vào ~/code/zbs-account-ui (nếu chưa có)
- Cài Node.js LTS và pnpm nếu chưa có
- Chạy pnpm install
- Chạy dev server
Sau đó mở http://localhost:3000 và cho mình biết đang thấy gì.
```

### Lần sau *(đã setup rồi)*

```
Vào ~/code/zbs-account-ui, chạy dev server
```

---

## 💬 Làm gì với Claude Code?

### ✏️ Thêm / chỉnh tính năng

```
Thêm trang Báo cáo tổng hợp vào /bao-cao
```

### 🖼️ Làm trang từ Figma / screenshot

```
Làm trang này theo design: [kéo thả ảnh vào đây]
Đặt tại /giao-dich/hoa-don
```

### 🚢 Deploy lên surge sau khi làm xong

```
Deploy prototype lên https://zbs-prod.vercel.app
```

---

<details>
<summary>🛠️ Tech stack</summary>

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Charts | Recharts 3 |
| Language | TypeScript |
| Package manager | pnpm |
| Hosting | surge.sh |

</details>
