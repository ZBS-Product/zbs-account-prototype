# 🎨 ZBS Account UI — Prototype

> Prototype giao diện quản lý tài khoản Zalo Business Solutions.  
> Dành cho PM/Designer — không cần biết code.

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

Gõ hoặc paste yêu cầu bằng tiếng Việt bình thường. Ví dụ:

**🖼️ Thêm trang mới — paste screenshot Figma kèm mô tả:**
```
Làm trang này theo design: [kéo thả ảnh Figma vào đây]
Trang đặt tại /giao-dich/hoa-don, thêm vào sidebar
```

**🎨 Chỉnh UI:**
```
Card "Tổng chi tiêu" font số tiền quá nhỏ, tăng lên và thêm viền cam bên trái
```

**📊 Thêm dữ liệu:**
```
Thêm 10 dòng vào bảng Lịch sử giao dịch, mix đủ 3 trạng thái
```

**🌿 Làm trên branch riêng** (khuyến nghị trước mỗi thử nghiệm mới):
```
Tạo branch prototype/ten-tinh-nang rồi thêm trang ...
```

---

## 📸 Screenshots

### Tổng quan
![Tổng quan](docs/screenshots/tong-quan.png)

### Chi tiêu tin Template
![Chi tiêu tin Template](docs/screenshots/chi-tieu-tin-template.png)

### Dịch vụ gửi tin
![Gửi theo chiến dịch](docs/screenshots/gui-tin.png)

### Lịch sử giao dịch
![Lịch sử giao dịch](docs/screenshots/lich-su-giao-dich.png)

---

## 🗂️ Trang đã có

| Route | Tên trang |
|---|---|
| `/` | 📊 Tổng quan |
| `/chi-tieu/tin-template` | 📨 Chi tiêu tin Template |
| `/chi-tieu/oa` | 📡 Chi tiêu OA |
| `/cong-cu/gui-tin` | 📤 Dịch vụ gửi tin |
| `/giao-dich/lich-su` | 🧾 Lịch sử giao dịch |
| `/giao-dich/hoa-don` | 🧾 Quản lý hóa đơn |
| `/cai-dat/tai-san` | 🔗 Quản lý tài sản |
| `/cai-dat/thanh-vien` | 👥 Quản lý thành viên |
| `/cai-dat/thong-bao` | 🔔 Quản lý thông báo |

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
