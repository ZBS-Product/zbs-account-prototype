import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import PrototypeSwitcher from "@/components/prototype-switcher"
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
            <PrototypeSwitcher />
            {/* pt-[68px] = 32px PrototypeSwitcher + 36px GlobalHeader */}
            <div className="pt-[68px]">
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
