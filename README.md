# 🎨 ZBS Account UI — Prototype

> Prototype giao diện quản lý tài khoản Zalo Business Solutions.  
> Dành cho PM/Designer — không cần biết code.

---

## 🌐 Xem prototype online

**👉 https://zbs-prototype.surge.sh**

Mỗi người có một URL riêng, chạy song song mà không ảnh hưởng nhau:

| URL | Prototype |
|---|---|
| [/base](https://zbs-prototype.surge.sh/base) | Bản gốc — tham chiếu chuẩn |
| [/phatnt11](https://zbs-prototype.surge.sh/phatnt11) | Fork của Phát |
| [/viht2](https://zbs-prototype.surge.sh/viht2) | Fork của Vi |
| [/hainlb](https://zbs-prototype.surge.sh/hainlb) | Fork của Hải |

> Góc trên cùng có thanh **Prototype Switcher** để chuyển nhanh giữa các môi trường.  
> Trang nào chưa có bản riêng sẽ tự động dùng lại bản `/base`.

---

## 🚀 Chạy prototype trên máy (để chỉnh UI real-time)

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

Claude Code sẽ tự làm hết — không cần thêm bước nào. 🎉

### Lần sau *(đã setup rồi)*

```
Vào ~/code/zbs-account-ui, chạy dev server
```

---

## 💬 Làm gì với Claude Code?

> **Quan trọng:** Luôn nói rõ bạn đang làm prototype nào để Claude không sửa nhầm file người khác.

### ✏️ Thêm / chỉnh tính năng

```
Mình đang làm prototype viht2.
Thêm trang Báo cáo tổng hợp vào /viht2/bao-cao
```

### 🖼️ Làm trang từ Figma / screenshot

```
Mình đang làm prototype viht2.
Làm trang này theo design: [kéo thả ảnh vào đây]
Đặt tại /viht2/giao-dich/hoa-don
```

### 🚢 Deploy lên surge sau khi làm xong

```
Deploy prototype lên https://zbs-prototype.surge.sh
```

---

## 🗂️ Trang đã có (bản base)

Thay `base` bằng username của bạn để xem bản riêng.

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
| `/base/giao-dich/nap-tien` | 💳 Nạp tiền (4 hình thức) |
| `/base/giao-dich/nap-tien/chuyen-khoan` | 🏦 Hướng dẫn chuyển khoản |
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
