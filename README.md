# 🎨 ZBS Account UI — Prototype

> Prototype giao diện quản lý tài khoản Zalo Business Solutions.  
> Dành cho PM/Designer — không cần biết code.

---

## 🌐 Multi-prototype

Mỗi người có một URL riêng, chạy song song mà không ảnh hưởng nhau:

| URL | Prototype |
|---|---|
| `/base` | Bản gốc — tham chiếu chuẩn |
| `/phatnt11` | Fork của Phát |
| `/viht2` | Fork của Vi |
| `/hainlb` | Fork của Hải |

Góc trên cùng có thanh **Prototype Switcher** để chuyển nhanh giữa các môi trường, tự động giữ nguyên trang đang xem.

> Trang nào chưa có bản riêng sẽ tự động dùng lại bản `/base`.

---

## 🚀 Bắt đầu

### 📦 Bước 1 — Cài Claude Code (chỉ làm 1 lần)

Tải và cài **Claude Code** tại: **[claude.ai/code](https://claude.ai/code)**

---

### ⚡ Bước 2 — Mở Terminal, gõ `claude`, rồi paste prompt này

```
Setup prototype ZBS Account UI cho mình:
- Clone repo https://github.com/ZBS-Product/zbs-account-prototype.git vào ~/code/zbs-account-ui (nếu chưa có)
- Cài Node.js LTS và pnpm nếu chưa có trên máy
- Chạy pnpm install
- Chạy dev server
Sau đó mở http://localhost:3000 và cho mình biết đang thấy gì.
```

Claude Code sẽ tự cài đặt, clone repo, và chạy — không cần làm gì thêm. 🎉

---

### 🔁 Lần sau (đã setup rồi)

Mở Terminal, gõ `claude`, paste:

```
Vào ~/code/zbs-account-ui, chạy dev server
```

---

## 💬 Làm gì với Claude Code?

> **Quan trọng:** Luôn nói rõ bạn đang làm trên prototype nào để Claude không edit nhầm file của người khác.

### ✏️ Làm tính năng trên prototype của bạn

```
Mình đang làm prototype viht2.
Thêm trang Báo cáo tổng hợp vào /viht2/bao-cao — chỉ tạo file trong app/viht2/, không đụng app/base/
```

### 🖼️ Thêm trang mới từ Figma

```
Mình đang làm prototype viht2.
Làm trang này theo design: [kéo thả ảnh Figma vào đây]
Trang đặt tại /viht2/giao-dich/hoa-don
```

### 🎨 Chỉnh UI

```
Card "Tổng chi tiêu" font số tiền quá nhỏ, tăng lên và thêm viền cam bên trái
(đây là trang /viht2/...)
```

### 🌿 Luôn làm trên branch riêng

```
Tạo branch prototype/viht2-ten-tinh-nang rồi làm ...
```

---

## 🗂️ Trang đã có (bản base)

Tất cả trang đều có dạng `/<username>/...` — thay `base` bằng username của bạn.

| Route | Tên trang |
|---|---|
| `/base` | 📊 Tổng quan |
| `/base/chi-tieu/tin-template` | 📨 Chi tiêu tin Template |
| `/base/chi-tieu/oa` | 📡 Chi tiêu OA |
| `/base/chi-tieu/ngan-sach` | 💰 Quản lý Ngân sách |
| `/base/cong-cu/gui-tin` | 📤 Dịch vụ gửi tin |
| `/base/cong-cu/gui-tin/quan-ly-template` | 📋 Quản lý Template |
| `/base/cong-cu/gui-tin/tao-template` | ➕ Tạo Template (wizard 3 bước) |
| `/base/cong-cu/gui-tin/chat-luong-gui-tin` | 📶 Chất lượng gửi tin SĐT |
| `/base/cong-cu/gui-tin/quan-ly-logo` | 🖼️ Quản lý Logo |
| `/base/cong-cu/gui-tin/gui-theo-chien-dich` | 🎯 Gửi theo chiến dịch |
| `/base/giao-dich/lich-su` | 🧾 Lịch sử giao dịch |
| `/base/giao-dich/hoa-don` | 🧾 Quản lý hóa đơn |
| `/base/cai-dat/tai-khoan` | 👤 Thông tin tài khoản |
| `/base/cai-dat/tai-san` | 🔗 Quản lý tài sản |
| `/base/cai-dat/thanh-vien` | 👥 Quản lý thành viên |
| `/base/cai-dat/thong-bao` | 🔔 Quản lý thông báo |

---

## 🔒 Ai được sửa gì?

| Scope | Người chịu trách nhiệm |
|---|---|
| `app/base/`, `components/`, `globals.css` | Base maintainer (`@patrickphat`) |
| `app/phatnt11/` | phatnt11 |
| `app/viht2/` | viht2 |
| `app/hainlb/` | hainlb |

Git hook sẽ chặn push thẳng lên `main` — mọi thay đổi phải qua branch + Pull Request.

---

<details>
<summary>🛠️ Tech stack</summary>

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Charts | Recharts 3 |
| Language | TypeScript |
| Package Manager | pnpm |

</details>
