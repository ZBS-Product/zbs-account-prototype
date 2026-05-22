/** @type {import('next').NextConfig} */

const isStaticExport = process.env.DEPLOY === "1"

const nextConfig = {
  ...(isStaticExport ? { output: "export", trailingSlash: true } : {}),
}

export default nextConfig
