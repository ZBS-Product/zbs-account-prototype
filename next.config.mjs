/** @type {import('next').NextConfig} */

// Fork users — thêm username mới vào đây khi có người join
const FORK_USERS = ["phatnt11", "viht2", "hainlb"] // thêm username mới vào đây

const nextConfig = {
  async rewrites() {
    return {
      // fallback: chỉ chạy khi KHÔNG tìm thấy page của user
      // → /phatnt11/cong-cu/gui-tin/... tự động phục vụ từ /base/cong-cu/gui-tin/...
      fallback: FORK_USERS.flatMap((user) => [
        {
          source: `/${user}/:path*`,
          destination: `/base/:path*`,
        },
      ]),
    }
  },
}

export default nextConfig
