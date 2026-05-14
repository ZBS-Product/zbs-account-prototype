# Hướng dẫn Prototype với Claude Code

Tài liệu này dành cho **PM / Designer** muốn tự thêm trang, chỉnh UI, hoặc thử ý tưởng mà không cần biết lập trình.

---

## 1. Cài đặt lần đầu (chỉ làm 1 lần)

| Công cụ | Link tải | Kiểm tra |
|---|---|---|
| Node.js 18+ | https://nodejs.org | `node -v` |
| pnpm | `npm i -g pnpm` | `pnpm -v` |
| Claude Code | https://claude.ai/code | `claude -v` |

---

## 2. Bắt đầu chỉ với một lệnh

Copy và chạy lệnh này trong Terminal:

```bash
git clone git@github.com:ZBS-Product/zbs-account-prototype.git zbs-prototype && cd zbs-prototype && pnpm install && pnpm dev & sleep 3 && claude
```

Lệnh này tự động:
1. Clone repo về máy (thư mục `zbs-prototype`)
2. Cài dependencies
3. Khởi động dev server tại http://localhost:3000
4. Mở Claude Code — sẵn sàng nhận yêu cầu ngay

> **Lần sau** (đã có sẵn repo), chỉ cần vào thư mục và chạy:
> ```bash
> cd zbs-prototype && pnpm dev & sleep 3 && claude
> ```

> **Tip:** Mở thêm tab trình duyệt vào http://localhost:3000 để thấy thay đổi realtime khi Claude đang code.

---

## 3. Những gì bạn có thể yêu cầu Claude

### Thêm trang mới

```
Bổ sung trang "Quản lý hóa đơn" tại /giao-dich/hoa-don.
Trang có bảng danh sách hóa đơn gồm: số hóa đơn, ngày tạo, 
tổng tiền, trạng thái (Đã thanh toán / Chờ thanh toán / Quá hạn),
và nút tải PDF. Có filter theo trạng thái ở bên phải.
```

### Chỉnh màu sắc / layout

```
Đổi màu nền sidebar từ trắng sang xám nhạt (#f8f9fa).
```

```
Card "Tổng chi tiêu" trên trang Tổng quan đang quá nhỏ, 
tăng font số tiền lên và thêm icon xu ở góc phải.
```

### Thêm dữ liệu mock

```
Thêm 5 dòng dữ liệu nữa vào bảng Lịch sử giao dịch, 
mix các trạng thái Thành công / Đang xử lý / Thất bại.
```

### Thêm tính năng filter / search

```
Trang Lịch sử giao dịch: khi nhập mã giao dịch vào ô search,
lọc real-time mà không cần nhấn Enter.
```

### Chỉnh component có sẵn

```
Nút "Tạo chiến dịch" trên trang Dịch vụ gửi tin: 
đổi thành outline style (viền xanh, nền trắng).
```

---

## 4. Workflow khuyên dùng

```
1. Chụp màn hình design (Figma / Zeplin / bất kỳ tool nào)
2. Dán screenshot vào Claude Code
3. Gõ: "Làm trang này trông giống design này"
4. Claude Code sẽ build và bạn thấy kết quả ngay trên localhost
5. Góp ý tiếp: "Chỉnh lại phần X", "Thêm Y vào đây"...
```

---

## 5. Luôn làm việc trên branch riêng

> ⚠️ **Quy tắc quan trọng:** Không bao giờ prototype trực tiếp trên `main`.

Mỗi ý tưởng / trang mới = một branch riêng:

```bash
# Tạo branch mới trước khi bắt đầu
git checkout -b prototype/ten-tinh-nang
# Ví dụ:
git checkout -b prototype/quan-ly-hoa-don
git checkout -b prototype/cai-dat-tai-khoan
```

Hoặc yêu cầu Claude Code:
```
Tạo branch mới tên "prototype/quan-ly-hoa-don" rồi thêm trang đó
```

**Tại sao cần branch riêng?**
- `main` luôn ở trạng thái "demo được" — có thể show bất cứ lúc nào
- Dễ so sánh và discard nếu ý tưởng không ổn
- Nhiều người có thể prototype song song không conflict

**Merge khi đã duyệt:**
```bash
git checkout main
git merge prototype/quan-ly-hoa-don
git push
```

## 6. Commit thay đổi lên GitHub

Sau khi hài lòng với prototype, yêu cầu Claude Code commit:

```
Commit tất cả thay đổi lên GitHub với message "Add invoice page"
```

Hoặc tự chạy:

```bash
git add .
git commit -m "Add: trang quản lý hóa đơn"
git push
```

---

## 6. Các câu hỏi hay gặp

**Q: Tôi lỡ xóa file quan trọng, lấy lại được không?**  
A: Có. Yêu cầu Claude: `"Khôi phục file app/page.tsx về commit trước"` hoặc chạy `git checkout HEAD -- app/page.tsx`.

**Q: Muốn test trên điện thoại?**  
A: Tìm địa chỉ IP máy tính (`ifconfig | grep inet`), sau đó truy cập `http://<IP>:3000` trên điện thoại (cùng WiFi).

**Q: Trang mới tôi thêm không xuất hiện trên sidebar?**  
A: Yêu cầu Claude: `"Thêm trang /giao-dich/hoa-don vào sidebar với tên Quản lý hóa đơn"`.

**Q: Claude Code có tự push lên GitHub không?**  
A: Không, trừ khi bạn yêu cầu rõ ràng. Mọi thay đổi chỉ là local cho đến khi bạn nói `"push lên GitHub"`.
