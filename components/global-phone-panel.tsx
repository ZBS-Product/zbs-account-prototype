"use client"

import { useEffect, useRef, useState } from "react"
import {
  X, ChevronLeft, Phone, Menu, Smile, Mic, Sticker,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────

export type PhoneMessage = {
  oaName: string
  oaColor: string
  logoText: string
  logoBg: string
  title: string
  body: string[]
  tableRows?: { label: string; value: string }[]
  button?: string
}

type SentMessage = PhoneMessage & { sentAt: string; id: number }

// ── Event helpers (used by other pages) ───────────────────────────────────────

export function openPhone() {
  window.dispatchEvent(new CustomEvent("phone:open"))
}

export function sendToPhone(msg: PhoneMessage) {
  window.dispatchEvent(new CustomEvent("phone:send", { detail: msg }))
}

// ── Push / restore layout ─────────────────────────────────────────────────────

const PANEL_W = 300

function pushLayout(open: boolean) {
  const el = document.getElementById("app-content")
  if (el) el.style.paddingRight = open ? `${PANEL_W}px` : "0px"
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GlobalPhonePanel() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<SentMessage[]>([])
  const [animId, setAnimId]     = useState<number | null>(null)
  const msgCounter              = useRef(0)
  const chatRef                 = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    function onOpen() {
      setOpen(v => {
        const next = !v
        pushLayout(next)
        return next
      })
    }
    function onSend(e: Event) {
      const msg = (e as CustomEvent<PhoneMessage>).detail
      const id  = ++msgCounter.current
      const now = new Date()
      const sentAt = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`

      // Show panel if not open
      setOpen(prev => {
        if (!prev) pushLayout(true)
        return true
      })

      // Append message, animate after 600ms
      setMessages(prev => [...prev, { ...msg, sentAt, id }])
      setTimeout(() => setAnimId(id), 50)   // tiny delay so CSS transition fires
    }

    window.addEventListener("phone:open", onOpen)
    window.addEventListener("phone:send", onSend)
    return () => {
      window.removeEventListener("phone:open", onOpen)
      window.removeEventListener("phone:send", onSend)
    }
  }, [])

  function handleClose() {
    setOpen(false)
    pushLayout(false)
  }

  const now = new Date()
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`

  // OA info from the last message (for the chat header)
  const lastMsg = messages[messages.length - 1]

  return (
    <div
      className={cn(
        "fixed top-[36px] right-0 bottom-0 z-[44] flex flex-col bg-gray-100 border-l border-border transition-all duration-300 ease-in-out overflow-hidden",
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{ width: open ? PANEL_W : 0 }}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-white shrink-0">
        <span className="text-sm font-semibold">Điện thoại thử nghiệm</span>
        <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Phone + content */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center py-5 px-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-3">
            <PhoneEmpty timeStr={timeStr} />
            <p className="text-xs text-muted-foreground/70 text-center px-2">
              Vào chi tiết Template và nhấn <strong>Gửi thử</strong> để xem tin hiển thị trên điện thoại.
            </p>
          </div>
        ) : (
          <PhoneMockup
            messages={messages}
            animId={animId}
            timeStr={timeStr}
            oaName={lastMsg.oaName}
            oaColor={lastMsg.oaColor}
            chatRef={chatRef}
          />
        )}
      </div>
    </div>
  )
}

// ── Phone empty state ─────────────────────────────────────────────────────────

function PhoneEmpty({ timeStr }: { timeStr: string }) {
  return (
    <div className="relative w-[240px] rounded-[30px] border-[6px] border-zinc-800 bg-zinc-800 shadow-2xl overflow-hidden">
      {/* Dynamic Island pill */}
      <div className="absolute top-[6px] left-1/2 -translate-x-1/2 z-10 h-[13px] w-[50px] bg-zinc-950 rounded-full flex items-center justify-end pr-[4px] gap-[2px]">
        <div className="h-[5px] w-[5px] rounded-full bg-zinc-700/80" />
        <div className="h-[3px] w-[3px] rounded-full bg-blue-400/40" />
      </div>
      <div className="bg-white flex flex-col rounded-[24px] overflow-hidden" style={{ minHeight: 480 }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-2 pb-0.5 bg-[#0068FF] text-white text-[10px] font-medium">
          <span>{timeStr}</span>
          <div className="flex items-center gap-0.5">
            <svg viewBox="0 0 16 12" className="h-2 w-3 fill-white"><rect x="0" y="4" width="3" height="8" rx="0.5"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5"/><rect x="9" y="1" width="3" height="11" rx="0.5"/><rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.4"/></svg>
            <svg viewBox="0 0 16 12" className="h-2 w-3 fill-white"><path d="M8 2.4C5.3 2.4 2.9 3.5 1.2 5.3L0 4C2.1 1.7 5 0.3 8 0.3s5.9 1.4 8 3.7L14.8 5.3C13.1 3.5 10.7 2.4 8 2.4z"/><path d="M8 5.5c-1.8 0-3.4.8-4.5 2L2.1 6.2C3.6 4.7 5.7 3.7 8 3.7s4.4 1 5.9 2.5L12.5 7.5C11.4 6.3 9.8 5.5 8 5.5z"/><circle cx="8" cy="10.5" r="1.5"/></svg>
            <svg viewBox="0 0 20 12" className="h-2 w-3.5 fill-white"><rect x="0" y="1" width="17" height="10" rx="2" stroke="white" strokeWidth="1.2" fill="none"/><rect x="1.5" y="2.5" width="11" height="7" rx="1" fill="white"/><rect x="18" y="4" width="2" height="4" rx="1" fill="white" opacity="0.6"/></svg>
          </div>
        </div>
        {/* Chat header placeholder */}
        <div className="flex items-center gap-1.5 px-2 py-2 bg-[#0068FF] text-white shrink-0">
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <div className="h-6 w-6 rounded-full bg-white/20 shrink-0" />
          <div className="flex-1 min-w-0 space-y-0.5">
            <div className="h-2 w-20 bg-white/30 rounded" />
            <div className="h-1.5 w-14 bg-white/20 rounded" />
          </div>
          <Phone className="h-3 w-3 shrink-0 opacity-50" />
          <Menu className="h-3 w-3 shrink-0 opacity-50" />
        </div>
        {/* Empty chat body */}
        <div className="flex-1 bg-[#EBF0F5] flex flex-col items-center justify-center gap-2 px-4">
          <div className="h-10 w-10 rounded-full bg-white/60 flex items-center justify-center">
            <Phone className="h-4 w-4 text-gray-300" />
          </div>
          <p className="text-[9px] text-gray-400 text-center leading-relaxed">Chưa có tin nhắn nào</p>
        </div>
        {/* Input bar */}
        <div className="flex items-center gap-1 px-2 py-1.5 bg-white border-t border-gray-200 shrink-0">
          <Smile className="h-3.5 w-3.5 text-gray-300 shrink-0" />
          <div className="flex-1 rounded-full bg-gray-100 px-2 py-0.5 text-[9px] text-gray-300">Message</div>
          <span className="text-gray-300 text-[9px]">•••</span>
          <Mic className="h-3.5 w-3.5 text-gray-300 shrink-0" />
          <Sticker className="h-3.5 w-3.5 text-gray-300 shrink-0" />
        </div>
      </div>
    </div>
  )
}

// ── Phone mockup ──────────────────────────────────────────────────────────────

function PhoneMockup({
  messages, animId, timeStr, oaName, oaColor, chatRef,
}: {
  messages: SentMessage[]
  animId: number | null
  timeStr: string
  oaName: string
  oaColor: string
  chatRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="relative w-[240px] rounded-[30px] border-[6px] border-zinc-800 bg-zinc-800 shadow-2xl overflow-hidden">
      {/* Notch */}
      {/* Dynamic Island pill */}
      <div className="absolute top-[6px] left-1/2 -translate-x-1/2 z-10 h-[13px] w-[50px] bg-zinc-950 rounded-full flex items-center justify-end pr-[4px] gap-[2px]">
        <div className="h-[5px] w-[5px] rounded-full bg-zinc-700/80" />
        <div className="h-[3px] w-[3px] rounded-full bg-blue-400/40" />
      </div>

      {/* Screen */}
      <div className="bg-white flex flex-col rounded-[24px] overflow-hidden" style={{ minHeight: 480 }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-2 pb-0.5 bg-[#0068FF] text-white text-[10px] font-medium">
          <span>{timeStr}</span>
          <div className="flex items-center gap-0.5">
            <svg viewBox="0 0 16 12" className="h-2 w-3 fill-white"><rect x="0" y="4" width="3" height="8" rx="0.5"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5"/><rect x="9" y="1" width="3" height="11" rx="0.5"/><rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.4"/></svg>
            <svg viewBox="0 0 16 12" className="h-2 w-3 fill-white"><path d="M8 2.4C5.3 2.4 2.9 3.5 1.2 5.3L0 4C2.1 1.7 5 0.3 8 0.3s5.9 1.4 8 3.7L14.8 5.3C13.1 3.5 10.7 2.4 8 2.4z"/><path d="M8 5.5c-1.8 0-3.4.8-4.5 2L2.1 6.2C3.6 4.7 5.7 3.7 8 3.7s4.4 1 5.9 2.5L12.5 7.5C11.4 6.3 9.8 5.5 8 5.5z"/><circle cx="8" cy="10.5" r="1.5"/></svg>
            <svg viewBox="0 0 20 12" className="h-2 w-3.5 fill-white"><rect x="0" y="1" width="17" height="10" rx="2" stroke="white" strokeWidth="1.2" fill="none"/><rect x="1.5" y="2.5" width="11" height="7" rx="1" fill="white"/><rect x="18" y="4" width="2" height="4" rx="1" fill="white" opacity="0.6"/></svg>
          </div>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-1.5 px-2 py-2 bg-[#0068FF] text-white shrink-0">
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <div className="h-6 w-6 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 text-white"
               style={{ background: oaColor }}>
            {oaName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-0.5 leading-none">
              <span className="text-[10px] font-semibold truncate leading-none">{oaName}</span>
              <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 shrink-0 fill-yellow-300"><circle cx="6" cy="6" r="6"/><path d="M4 6l1.5 1.5L8 4" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-[8px] opacity-70 leading-none mt-0.5 block">Official Account</span>
          </div>
          <Phone className="h-3 w-3 shrink-0 opacity-80" />
          <Menu className="h-3 w-3 shrink-0 opacity-80" />
        </div>

        {/* Chat body — scrollable, shows all messages */}
        <div ref={chatRef} className="flex-1 bg-[#EBF0F5] px-2 py-2 space-y-2 overflow-y-auto" style={{ maxHeight: 340 }}>
          {messages.map((msg, i) => {
            const isAnimated = animId !== null && msg.id <= animId
            const isFirst    = i === 0
            return (
              <div key={msg.id}>
                {/* Time separator: show for first, or if OA changes */}
                {(isFirst || messages[i - 1].oaName !== msg.oaName) && (
                  <div className="text-center text-[9px] text-gray-400 bg-white/70 rounded-full px-2 py-0.5 w-fit mx-auto mb-1">
                    {msg.sentAt} Today
                  </div>
                )}

                {/* ZNS card */}
                <div
                  className={cn(
                    "bg-white rounded-xl shadow-sm overflow-hidden mx-auto border border-gray-100 transition-all duration-500",
                    isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  )}
                  style={{ maxWidth: 210 }}
                >
                  <div className="px-2.5 pt-2.5 pb-1">
                    <div className="h-6 w-14 rounded flex items-center justify-center text-[8px] font-bold text-white"
                         style={{ background: msg.logoBg }}>
                      {msg.logoText}
                    </div>
                  </div>
                  <div className="px-2.5 pb-2.5 space-y-1">
                    <p className="text-[10px] font-bold text-gray-900 leading-snug">{msg.title}</p>
                    {msg.body.map((line, j) => (
                      <p key={j} className="text-[9px] text-gray-600 leading-relaxed">{line}</p>
                    ))}
                    {msg.tableRows && msg.tableRows.length > 0 && (
                      <div className="space-y-0.5 pt-0.5">
                        {msg.tableRows.map((row, j) => (
                          <div key={j} className="flex justify-between gap-2 text-[9px]">
                            <span className="text-gray-500 shrink-0">{row.label}</span>
                            <span className="font-semibold text-gray-800 text-right">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.button && (
                      <button className="w-full rounded py-1 text-[9px] font-semibold text-white mt-1"
                              style={{ background: "oklch(0.488 0.243 264.376)" }}>
                        {msg.button}
                      </button>
                    )}
                  </div>

                  {/* Timestamp below card */}
                  <div className="px-2.5 pb-1.5 text-[8px] text-gray-400 text-right">{msg.sentAt}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-1 px-2 py-1.5 bg-white border-t border-gray-200 shrink-0">
          <Smile className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <div className="flex-1 rounded-full bg-gray-100 px-2 py-0.5 text-[9px] text-gray-400">Message</div>
          <span className="text-gray-400 text-[9px]">•••</span>
          <Mic className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <Sticker className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        </div>
      </div>
    </div>
  )
}
