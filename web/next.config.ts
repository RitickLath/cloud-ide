import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@wterm/dom", "@wterm/react"],
}

export default nextConfig
