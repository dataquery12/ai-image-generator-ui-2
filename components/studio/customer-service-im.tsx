"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Minus, ImagePlus, Send, User, Package, CreditCard, ChevronRight, Check, Clock } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import Image from "next/image"
import Link from "next/link"

interface OrderCardData {
  orderId: string
  orderNumber: string
  totalAmount: number
  depositAmount: number
  description: string
  status: string
}

interface DesignCardData {
  images: string[]
  description: string
}

interface Message {
  id: number
  type: "user" | "service" | "system"
  content: string
  image?: string
  orderCard?: OrderCardData
  designCard?: DesignCardData
  timestamp: Date
}

interface CustomerServiceIMProps {
  onClose: () => void
  onMinimize: () => void
  orderId?: string
  orderNumber?: string
}

export function CustomerServiceIM({ onClose, onMinimize, orderId, orderNumber }: CustomerServiceIMProps) {
  const { t, language } = useLanguage()
  
  const getInitialMessages = (): Message[] => {
    const welcomeMessage: Message = {
      id: 1,
      type: "service",
      content: language === "zh" 
        ? "您好！我是您的专属设计师。有什么可以帮助您的吗？"
        : "Hello! I'm your dedicated designer. How can I help you with your wheel design today?",
      timestamp: new Date(),
    }
    
    if (orderId && orderNumber) {
      return [
        welcomeMessage,
        {
          id: 2,
          type: "system",
          content: language === "zh" 
            ? `已关联订单：${orderNumber}` 
            : `Connected to order: ${orderNumber}`,
          timestamp: new Date(),
        },
      ]
    }
    
    return [welcomeMessage]
  }
  
  const [messages, setMessages] = useState<Message[]>(getInitialMessages())
  const [input, setInput] = useState("")
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
        {messages.map((message) => {
          // System message
          if (message.type === "system") {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-gray-200 px-4 py-2 rounded-full text-xs text-gray-600 flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {message.content}
                </div>
              </div>
            )
          }

          return (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] space-y-2`}>
                {/* Order Card */}
                {message.orderCard && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-sm">
                        {language === "zh" ? "订单卡片" : "Order Card"}
                      </span>
                      <Badge variant="outline" className="text-xs ml-auto">
                        {message.orderCard.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{language === "zh" ? "订单号" : "Order No."}</span>
                        <span className="font-mono">{message.orderCard.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{language === "zh" ? "总金额" : "Total"}</span>
                        <span className="font-semibold">
                          {language === "zh" ? "¥" : "$"}{message.orderCard.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{language === "zh" ? "定金 (30%)" : "Deposit (30%)"}</span>
                        <span>
                          {language === "zh" ? "¥" : "$"}{message.orderCard.depositAmount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-500 pt-2 border-t border-gray-100 mt-2">
                        {message.orderCard.description}
                      </p>
                    </div>
                    <Button className="w-full mt-4" size="sm" asChild>
                      <Link href={`/profile/orders/${message.orderCard.orderId}`}>
                        {language === "zh" ? "查看详情" : "View Details"}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Design Card */}
                {message.designCard && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <ImagePlus className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-sm">
                        {language === "zh" ? "设计图已上传" : "Design Images"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {message.designCard.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                          <Image src={img} alt={`Design ${idx + 1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{message.designCard.description}</p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1 gap-1">
                        <Check className="h-4 w-4" />
                        {language === "zh" ? "确认设计" : "Confirm"}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        {language === "zh" ? "驳回" : "Reject"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Regular text message */}
                {!message.orderCard && !message.designCard && (
                  <div
                    className={`px-4 py-3 rounded-2xl ${
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
                  </div>
                )}

                <span className="text-xs text-gray-400 block">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          )
        })}
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
