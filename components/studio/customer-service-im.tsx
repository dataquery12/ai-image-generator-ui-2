"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Minus, ImagePlus, Send, User } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import Image from "next/image"

interface Message {
  id: number
  type: "user" | "service"
  content: string
  image?: string
  timestamp: Date
}

interface CustomerServiceIMProps {
  onClose: () => void
  onMinimize: () => void
}

export function CustomerServiceIM({ onClose, onMinimize }: CustomerServiceIMProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "service",
      content: "Hello! I'm your dedicated designer. How can I help you with your wheel design today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
    setInput("")

    // Simulate service response
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        type: "service",
        content: "Thank you for your message. I'll review your request and get back to you shortly.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    }, 1500)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  return (
    <div
      className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {/* Title Bar - Draggable */}
      <div
        className="h-16 bg-gradient-to-r from-blue-500 to-purple-500 px-6 flex items-center justify-between cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{t.custom.customService.customerService}</h3>
            <p className="text-white/80 text-xs">{language === "zh" ? "在线" : "Online"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
            onClick={onMinimize}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 scrollbar-hide">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white border border-gray-200 text-foreground"
              }`}
            >
              {message.image && (
                <div className="mb-2 relative w-full h-32 rounded-xl overflow-hidden">
                  <Image src={message.image || "/placeholder.svg"} alt="Attachment" fill className="object-cover" />
                </div>
              )}
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative">
          <Textarea
            placeholder={t.custom.customService.typeMessage}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="min-h-[80px] resize-none bg-gray-50 border-0 rounded-2xl pr-24 focus-visible:ring-2 focus-visible:ring-primary/20"
          />
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-muted"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4" />
            </Button>
            <Button size="icon" className="h-9 w-9 rounded-xl" onClick={handleSend} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
