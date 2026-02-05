"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, MessageSquare, MoreHorizontal, Archive, Trash2, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/language-context"

const mockSessions = [
  { id: 1, name: "Racing Wheel Concept", nameZh: "竞速轮毂概念", date: "Today", dateZh: "今天", messages: 12 },
  { id: 2, name: "Luxury SUV Design", nameZh: "豪华SUV设计", date: "Today", dateZh: "今天", messages: 8 },
  { id: 3, name: "Vintage Chrome Style", nameZh: "复古镀铬风格", date: "Yesterday", dateZh: "昨天", messages: 15 },
  { id: 4, name: "Minimalist Modern", nameZh: "极简现代", date: "Dec 7", dateZh: "12月7日", messages: 6 },
  { id: 5, name: "Cyberpunk Concept", nameZh: "赛博朋克概念", date: "Dec 5", dateZh: "12月5日", messages: 23 },
]

interface SessionSidebarProps {
  onCreateSession: () => void
}

export function SessionSidebar({ onCreateSession }: SessionSidebarProps) {
  const [activeSession, setActiveSession] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const { t, language } = useLanguage()

  const filteredSessions = mockSessions.filter((session) => {
    const name = language === "zh" ? session.nameZh : session.name
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <Button className="w-full justify-start gap-2 glow-primary-sm" size="sm" onClick={onCreateSession}>
          <Plus className="h-4 w-4" />
          {t.studio.newSession}
        </Button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.studio.searchSessions}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-white border-gray-200"
          />
        </div>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="space-y-1">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                activeSession === session.id ? "bg-primary/10 text-primary" : "hover:bg-white text-foreground"
              }`}
              onClick={() => setActiveSession(session.id)}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{language === "zh" ? session.nameZh : session.name}</div>
                <div className="text-xs text-muted-foreground">
                  {language === "zh" ? session.dateZh : session.date} · {session.messages}{" "}
                  {language === "zh" ? "条消息" : "messages"}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-apple-lg">
                  <DropdownMenuItem>{t.studio.rename}</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="h-4 w-4 mr-2" />
                    {t.studio.archive}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t.studio.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>

      {/* Archived Section */}
      <div className="p-3 border-t border-gray-100">
        
      </div>
    </div>
  )
}
