"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Send,
  ImagePlus,
  Plus,
  Package,
  Upload,
  Truck,
  CheckCircle,
  Search,
  MoreVertical,
  Phone,
  Video,
  User,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

// Mock customer conversations
const mockCustomers = [
  {
    id: "1",
    name: "John Smith",
    nameZh: "约翰·史密斯",
    avatar: "/avatar-man-professional.jpg",
    lastMessage: "I'm interested in the racing wheel design",
    lastMessageZh: "我对竞速轮毂设计很感兴趣",
    timestamp: new Date("2024-12-12T14:30:00"),
    unread: 2,
    orderId: "ORD-2024-002",
    orderStatus: "design_pending_confirm",
  },
  {
    id: "2",
    name: "Sarah Chen",
    nameZh: "陈莎拉",
    avatar: "/avatar-woman-elegant.jpg",
    lastMessage: "When will my order be shipped?",
    lastMessageZh: "我的订单什么时候发货？",
    timestamp: new Date("2024-12-12T12:15:00"),
    unread: 0,
    orderId: "ORD-2024-003",
    orderStatus: "shipped",
  },
  {
    id: "3",
    name: "Mike Johnson",
    nameZh: "迈克·约翰逊",
    avatar: "/avatar-man-casual.jpg",
    lastMessage: "Thanks for the design update!",
    lastMessageZh: "感谢设计更新！",
    timestamp: new Date("2024-12-11T16:45:00"),
    unread: 0,
    orderId: null,
    orderStatus: null,
  },
  {
    id: "4",
    name: "Emily Wang",
    nameZh: "王艾米",
    avatar: "/avatar-woman-creative.jpg",
    lastMessage: "I just paid the deposit",
    lastMessageZh: "我刚付了定金",
    timestamp: new Date("2024-12-12T10:00:00"),
    unread: 1,
    orderId: "ORD-2024-005",
    orderStatus: "deposit_paid",
  },
]

interface ChatMessage {
  id: string
  senderId: string
  type: "text" | "image" | "order_card" | "design_card" | "system"
  content: string
  imageUrl?: string
  orderData?: {
    orderId: string
    totalAmount: number
    depositAmount: number
    description: string
  }
  designData?: {
    images: string[]
    description: string
  }
  timestamp: Date
}

// Mock chat messages for selected customer
const mockMessages: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "m1",
      senderId: "customer",
      type: "text",
      content: "Hi, I saw your wheel designs and I'm very interested!",
      timestamp: new Date("2024-12-12T14:00:00"),
    },
    {
      id: "m2",
      senderId: "merchant",
      type: "text",
      content: "Hello! Thank you for your interest. What kind of design are you looking for?",
      timestamp: new Date("2024-12-12T14:05:00"),
    },
    {
      id: "m3",
      senderId: "customer",
      type: "text",
      content: "I want a racing-style wheel with carbon fiber accents for my sports car.",
      timestamp: new Date("2024-12-12T14:10:00"),
    },
    {
      id: "m4",
      senderId: "merchant",
      type: "order_card",
      content: "Order Created",
      orderData: {
        orderId: "ORD-2024-002",
        totalAmount: 5000,
        depositAmount: 1500,
        description: "Racing Sport Wheel with Carbon Fiber Accents",
      },
      timestamp: new Date("2024-12-12T14:15:00"),
    },
    {
      id: "m5",
      senderId: "system",
      type: "system",
      content: "Customer paid the deposit ($1,500)",
      timestamp: new Date("2024-12-12T14:20:00"),
    },
    {
      id: "m6",
      senderId: "merchant",
      type: "design_card",
      content: "Design Uploaded",
      designData: {
        images: [
          "/racing-wheel-design-lightweight-forged-aluminum.jpg",
          "/modern-minimalist-wheel-design-matte-black-clean-l.jpg",
        ],
        description: "Here are the initial design concepts for your racing wheel.",
      },
      timestamp: new Date("2024-12-12T14:25:00"),
    },
    {
      id: "m7",
      senderId: "customer",
      type: "text",
      content: "I'm interested in the racing wheel design",
      timestamp: new Date("2024-12-12T14:30:00"),
    },
  ],
  "2": [
    {
      id: "m1",
      senderId: "customer",
      type: "text",
      content: "When will my order be shipped?",
      timestamp: new Date("2024-12-12T12:15:00"),
    },
    {
      id: "m2",
      senderId: "merchant",
      type: "text",
      content: "Your order has been shipped! Tracking number: SF1234567890",
      timestamp: new Date("2024-12-12T12:20:00"),
    },
  ],
  "4": [
    {
      id: "m1",
      senderId: "customer",
      type: "text",
      content: "I just paid the deposit for my custom wheel order.",
      timestamp: new Date("2024-12-12T10:00:00"),
    },
  ],
}

const designPresets = [
  { id: "1", name: "Racing Sport", nameZh: "竞速运动", image: "/racing-wheel-design-lightweight-forged-aluminum.jpg" },
  { id: "2", name: "Luxury Chrome", nameZh: "豪华镀铬", image: "/luxury-sport-wheel-design-metallic-silver-with-int.jpg" },
  { id: "3", name: "Modern Minimal", nameZh: "现代极简", image: "/modern-minimalist-wheel-design-matte-black-clean-l.jpg" },
  { id: "4", name: "Cyberpunk", nameZh: "赛博朋克", image: "/cyberpunk-futuristic-wheel-design-neon-accents.jpg" },
]

export function MerchantChatDashboard() {
  const { t, language } = useLanguage()
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0])
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages["1"] || [])
  const [inputMessage, setInputMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Dialog states
  const [createOrderOpen, setCreateOrderOpen] = useState(false)
  const [uploadDesignOpen, setUploadDesignOpen] = useState(false)
  const [shipOrderOpen, setShipOrderOpen] = useState(false)

  // Form states
  const [orderAmount, setOrderAmount] = useState("")
  const [orderDescription, setOrderDescription] = useState("")
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([])
  const [designDescription, setDesignDescription] = useState("")
  const [courier, setCourier] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    setMessages(mockMessages[selectedCustomer.id] || [])
  }, [selectedCustomer])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "merchant",
      type: "text",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")
  }

  const handleCreateOrder = () => {
    if (!orderAmount) return

    const amount = parseFloat(orderAmount)
    const depositAmount = amount * 0.3

    const orderMessage: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "merchant",
      type: "order_card",
      content: "Order Created",
      orderData: {
        orderId: `ORD-2024-${String(Date.now()).slice(-3)}`,
        totalAmount: amount,
        depositAmount: depositAmount,
        description: orderDescription || "Custom Wheel Design",
      },
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, orderMessage])
    setCreateOrderOpen(false)
    setOrderAmount("")
    setOrderDescription("")
  }

  const handleUploadDesign = () => {
    if (selectedDesigns.length === 0) return

    const designMessage: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "merchant",
      type: "design_card",
      content: "Design Uploaded",
      designData: {
        images: selectedDesigns,
        description: designDescription || "Design concepts for your review",
      },
      timestamp: new Date(),
    }

    const systemMessage: ChatMessage = {
      id: `m${Date.now() + 1}`,
      senderId: "system",
      type: "system",
      content: language === "zh" ? "设计图已上传，等待客户确认" : "Design uploaded, waiting for customer confirmation",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, designMessage, systemMessage])
    setUploadDesignOpen(false)
    setSelectedDesigns([])
    setDesignDescription("")
  }

  const handleShipOrder = () => {
    if (!courier || !trackingNumber) return

    const systemMessage: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "system",
      type: "system",
      content: `${language === "zh" ? "订单已发货" : "Order shipped"} - ${courier}: ${trackingNumber}`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, systemMessage])
    setShipOrderOpen(false)
    setCourier("")
    setTrackingNumber("")
  }

  const handleCompleteProduction = () => {
    const systemMessage: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "system",
      type: "system",
      content: language === "zh" ? "生产已完成，准备发货" : "Production completed, ready to ship",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, systemMessage])
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US", {
      style: "currency",
      currency: language === "zh" ? "CNY" : "USD",
    }).format(amount)
  }

  const toggleDesignSelection = (image: string) => {
    setSelectedDesigns((prev) =>
      prev.includes(image) ? prev.filter((d) => d !== image) : [...prev, image]
    )
  }

  const getStatusBadge = (status: string | null) => {
    if (!status) return null
    const statusText = t.orders?.statuses?.[status as keyof typeof t.orders.statuses] || status
    return (
      <Badge variant="outline" className="text-xs">
        {statusText}
      </Badge>
    )
  }

  const filteredCustomers = mockCustomers.filter((customer) => {
    if (!searchQuery) return true
    const name = language === "zh" ? customer.nameZh : customer.name
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex h-screen bg-background">
      {/* Customer List Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold mb-4">{t.merchant?.title || "Merchant Dashboard"}</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === "zh" ? "搜索客户..." : "Search customers..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50"
            />
          </div>
        </div>

        {/* Customer List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                className={`w-full p-3 rounded-xl flex items-start gap-3 transition-colors ${
                  selectedCustomer.id === customer.id
                    ? "bg-primary/10"
                    : "hover:bg-secondary/50"
                }`}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={customer.avatar} alt={customer.name} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">
                      {language === "zh" ? customer.nameZh : customer.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(customer.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {language === "zh" ? customer.lastMessageZh : customer.lastMessage}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {customer.orderId && (
                      <Badge variant="outline" className="text-xs">
                        {customer.orderId}
                      </Badge>
                    )}
                    {customer.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {customer.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-background">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">
                {language === "zh" ? selectedCustomer.nameZh : selectedCustomer.name}
              </h2>
              <div className="flex items-center gap-2">
                {selectedCustomer.orderId && (
                  <span className="text-xs text-muted-foreground">
                    {selectedCustomer.orderId}
                  </span>
                )}
                {getStatusBadge(selectedCustomer.orderStatus)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-3 border-b border-border flex gap-2 flex-wrap bg-muted/30">
          {/* Create Order */}
          <Dialog open={createOrderOpen} onOpenChange={setCreateOrderOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t.merchant?.createOrder || "Create Order"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.merchant?.orderForm?.title || "Create New Order"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>{t.merchant?.orderForm?.totalAmount || "Total Amount"}</Label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                  />
                  {orderAmount && (
                    <p className="text-sm text-muted-foreground">
                      {t.merchant?.orderForm?.depositAmount || "Deposit"}: {formatCurrency(parseFloat(orderAmount) * 0.3)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>{t.merchant?.orderForm?.description || "Description"}</Label>
                  <Textarea
                    placeholder={language === "zh" ? "订单描述..." : "Order description..."}
                    value={orderDescription}
                    onChange={(e) => setOrderDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateOrder} className="w-full">
                  {t.merchant?.orderForm?.submit || "Send Order"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Upload Design - Show when status is deposit_paid or design_rejected */}
          {(selectedCustomer.orderStatus === "deposit_paid" || 
            selectedCustomer.orderStatus === "design_rejected" ||
            selectedCustomer.orderStatus === "design_pending_confirm") && (
            <Dialog open={uploadDesignOpen} onOpenChange={setUploadDesignOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  {t.merchant?.uploadDesign || "Upload Design"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t.merchant?.designUpload?.title || "Upload Design"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>{t.merchant?.designUpload?.selectDesign || "Select Design"}</Label>
                    <div className="grid grid-cols-4 gap-3">
                      {designPresets.map((design) => (
                        <div
                          key={design.id}
                          onClick={() => toggleDesignSelection(design.image)}
                          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                            selectedDesigns.includes(design.image)
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-transparent hover:border-border"
                          }`}
                        >
                          <Image
                            src={design.image}
                            alt={design.name}
                            fill
                            className="object-cover"
                          />
                          {selectedDesigns.includes(design.image) && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <CheckCircle className="h-8 w-8 text-primary" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-xs text-center">
                            {language === "zh" ? design.nameZh : design.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t.merchant?.orderForm?.description || "Description"}</Label>
                    <Textarea
                      placeholder={language === "zh" ? "设计说明..." : "Design description..."}
                      value={designDescription}
                      onChange={(e) => setDesignDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleUploadDesign} className="w-full" disabled={selectedDesigns.length === 0}>
                    {t.merchant?.designUpload?.submit || "Send Design"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Complete Production - Show when status is manufacturing */}
          {selectedCustomer.orderStatus === "manufacturing" && (
            <Button size="sm" variant="outline" className="gap-2 bg-transparent" onClick={handleCompleteProduction}>
              <CheckCircle className="h-4 w-4" />
              {t.merchant?.completeProduction || "Complete Production"}
            </Button>
          )}

          {/* Ship Order - Show when status is ready_to_ship */}
          {selectedCustomer.orderStatus === "ready_to_ship" && (
            <Dialog open={shipOrderOpen} onOpenChange={setShipOrderOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                  <Truck className="h-4 w-4" />
                  {t.merchant?.shipOrder || "Ship Order"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.merchant?.shipping?.title || "Ship Order"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>{t.merchant?.shipping?.courier || "Courier Company"}</Label>
                    <Select value={courier} onValueChange={setCourier}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === "zh" ? "选择物流公司" : "Select courier"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sf">SF Express</SelectItem>
                        <SelectItem value="fedex">FedEx</SelectItem>
                        <SelectItem value="ups">UPS</SelectItem>
                        <SelectItem value="dhl">DHL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t.merchant?.shipping?.trackingNumber || "Tracking Number"}</Label>
                    <Input
                      placeholder="SF1234567890"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleShipOrder} className="w-full" disabled={!courier || !trackingNumber}>
                    {t.merchant?.shipping?.submit || "Confirm Shipment"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => {
              const isCustomer = message.senderId === "customer"
              const isSystem = message.type === "system"

              if (isSystem) {
                return (
                  <div key={message.id} className="flex justify-center">
                    <div className="bg-muted px-4 py-2 rounded-full text-sm text-muted-foreground">
                      {message.content}
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={message.id}
                  className={`flex ${isCustomer ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[70%] ${isCustomer ? "items-start" : "items-end"}`}>
                    {/* Regular text message */}
                    {message.type === "text" && (
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          isCustomer
                            ? "bg-muted text-foreground rounded-tl-md"
                            : "bg-primary text-primary-foreground rounded-tr-md"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    )}

                    {/* Order Card */}
                    {message.type === "order_card" && message.orderData && (
                      <div className="bg-card border border-border rounded-xl p-4 shadow-sm w-72">
                        <div className="flex items-center gap-2 mb-3">
                          <Package className="h-5 w-5 text-primary" />
                          <span className="font-semibold">
                            {language === "zh" ? "订单卡片" : "Order Card"}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t.orders?.orderNumber || "Order No."}</span>
                            <span className="font-mono">{message.orderData.orderId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t.orders?.totalAmount || "Total"}</span>
                            <span className="font-semibold">{formatCurrency(message.orderData.totalAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t.orders?.deposit || "Deposit"} (30%)</span>
                            <span>{formatCurrency(message.orderData.depositAmount)}</span>
                          </div>
                          <p className="text-muted-foreground pt-2 border-t border-border mt-2">
                            {message.orderData.description}
                          </p>
                        </div>
                        <Button className="w-full mt-4" size="sm">
                          {t.orders?.viewDetails || "View Details"}
                        </Button>
                      </div>
                    )}

                    {/* Design Card */}
                    {message.type === "design_card" && message.designData && (
                      <div className="bg-card border border-border rounded-xl p-4 shadow-sm w-80">
                        <div className="flex items-center gap-2 mb-3">
                          <ImagePlus className="h-5 w-5 text-primary" />
                          <span className="font-semibold">
                            {language === "zh" ? "设计图" : "Design Images"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {message.designData.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                              <Image src={img} alt={`Design ${idx + 1}`} fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{message.designData.description}</p>
                      </div>
                    )}

                    <span className="text-xs text-muted-foreground mt-1 block">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background">
          <div className="max-w-3xl mx-auto flex items-end gap-3">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ImagePlus className="h-5 w-5" />
            </Button>
            <Textarea
              placeholder={language === "zh" ? "输入消息..." : "Type a message..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim()} className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
