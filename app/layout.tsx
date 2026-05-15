import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import GlobalHeader from "@/components/global-header"
import GlobalPhonePanel from "@/components/global-phone-panel"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata = { title: "Zalo Business Solutions" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={cn("antialiased", inter.variable, "font-sans")}>
      <body>
        <ThemeProvider>
          <TooltipProvider>
            {/* pt-[36px] = 36px GlobalHeader */}
            <div id="app-content" className="pt-[36px]" style={{ transition: "padding-right 300ms ease" }}>
              {/* Global header — hiện trên mọi trang */}
              <GlobalHeader />
              {children}
            </div>
            {/* Global phone panel — toggle từ GlobalHeader, dùng được mọi trang */}
            <GlobalPhonePanel />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
