/** @type {import('next').NextConfig} */

// Fork users — thêm username mới vào đây khi có người join
const FORK_USERS = ["phatnt11", "viht2", "hainlb"]

const isDeploy = process.env.DEPLOY === "1"

const nextConfig = {
  // Static export cho surge.sh — bật bằng DEPLOY=1 pnpm build
  ...(isDeploy ? {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  } : {
    // Dev: rewrite fallback cho multi-prototype
    async rewrites() {
      return {
        fallback: FORK_USERS.flatMap((user) => [
          { source: `/${user}/:path*`, destination: `/base/:path*` },
        ]),
      }
    },
  }),
}

export default nextConfig
