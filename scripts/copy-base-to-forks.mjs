/**
 * Post-build script: copy các trang từ out/base/ sang out/<user>/
 * cho những path mà fork user chưa có file riêng.
 *
 * Thêm user mới: cập nhật mảng FORK_USERS bên dưới.
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, "..", "out")

const FORK_USERS = ["phatnt11", "viht2", "hainlb"]

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      // Không ghi đè nếu fork user đã có file riêng
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath)
      }
    }
  }
}

const baseDir = path.join(OUT_DIR, "base")
if (!fs.existsSync(baseDir)) {
  console.error("❌  out/base/ không tồn tại — chạy `next build` trước.")
  process.exit(1)
}

for (const user of FORK_USERS) {
  const userDir = path.join(OUT_DIR, user)
  copyDir(baseDir, userDir)
  console.log(`✅  Copied base → ${user}`)
}

console.log("🎉  Done — static files ready for surge.")
