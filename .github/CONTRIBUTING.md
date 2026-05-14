# Hướng dẫn contribute

## Khi mới clone repo

```bash
git clone git@github.com:ZBS-Product/zbs-account-prototype.git
cd zbs-account-prototype
pnpm install

# Checkout branch của bạn (thay viht2 bằng username của bạn)
git checkout -b prototype/viht2
# Nếu branch đã tồn tại:
# git checkout prototype/viht2
```

## Quy tắc

| Được làm | Không được làm |
|---|---|
| Edit `app/[username-của-bạn]/` | Edit `app/base/` |
| Edit `app/[username-của-bạn]/` | Edit folder của người khác |
| Tạo trang mới trong folder của bạn | Sửa `components/`, `next.config.mjs` trực tiếp trên `main` |
| Mở PR vào `main` khi muốn update base | Push thẳng vào `main` |

## Thêm trang mới cho prototype của bạn

```bash
# Tạo trang custom (ví dụ viht2 muốn sửa trang Tổng quan)
mkdir -p app/viht2/chi-tieu
cp app/base/chi-tieu/tin-template/page.tsx app/viht2/chi-tieu/tin-template/page.tsx
# → Sửa file vừa copy, đổi basePath="/base" thành basePath="/viht2"
```

## Commit & push

```bash
git add app/viht2/
git commit -m "viht2: custom trang chi-tieu tin-template"
git push origin prototype/viht2
```

## Muốn thêm tên mình vào landing hub `/`

Mở PR vào `main` với 2 thay đổi:
1. Thêm entry vào `prototypes` array trong `app/page.tsx`
2. Thêm username vào `FORK_USERS` trong `next.config.mjs`
