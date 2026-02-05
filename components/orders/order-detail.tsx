"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MessageCircle,
  CreditCard,
  Check,
  X,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  CircleDot,
  ZoomIn,
} from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { CustomerServiceIM } from "@/components/studio/customer-service-im"
import type { Order, CustomServiceOrder } from "@/lib/types/order"
import { isCustomServiceOrder } from "@/lib/types/order"

// Mock data - in real app, fetch from API
const mockOrdersMap: Record<string, Order> = {
  "1": {
    id: "1",
    orderNumber: "ORD-2024-001",
    userId: "user1",
    type: "manual_service",
    status: "paid",
    amount: 700,
    createdAt: new Date("2024-12-01T10:30:00"),
    updatedAt: new Date("2024-12-01T10:35:00"),
    statusHistory: [
      { status: "pending_payment", timestamp: new Date("2024-12-01T10:30:00"), note: "Order created" },
      { status: "paid", timestamp: new Date("2024-12-01T10:35:00"), note: "Payment completed" },
    ],
    sessionId: "session1",
  },
  "2": {
    id: "2",
    orderNumber: "ORD-2024-002",
    userId: "user1",
    type: "custom_service",
    status: "design_pending_confirm",
    amount: 5000,
    createdAt: new Date("2024-12-05T14:00:00"),
    updatedAt: new Date("2024-12-08T16:30:00"),
    statusHistory: [
      { status: "pending_deposit", timestamp: new Date("2024-12-05T14:00:00"), note: "Order created" },
      { status: "deposit_paid", timestamp: new Date("2024-12-05T14:15:00"), note: "Deposit payment completed" },
      { status: "designing", timestamp: new Date("2024-12-06T09:00:00"), note: "Designer started working" },
      { status: "design_pending_confirm", timestamp: new Date("2024-12-08T16:30:00"), note: "Design uploaded, waiting for confirmation" },
    ],
    designName: "Racing Sport Wheel",
    description: "Custom racing wheel with carbon fiber accents, aggressive spoke design",
    depositAmount: 1500,
    depositPaidAt: new Date("2024-12-05T14:15:00"),
    finalAmount: 3500,
    designImages: [
      { id: "d1", url: "/racing-wheel-design-lightweight-forged-aluminum.jpg", uploadedAt: new Date("2024-12-08T16:30:00") },
      { id: "d2", url: "/modern-minimalist-wheel-design-matte-black-clean-l.jpg", uploadedAt: new Date("2024-12-08T16:30:00") },
    ],
    sessionId: "session2",
  },
  "3": {
    id: "3",
    orderNumber: "ORD-2024-003",
    userId: "user1",
    type: "custom_service",
    status: "shipped",
    amount: 8000,
    createdAt: new Date("2024-11-20T11:00:00"),
    updatedAt: new Date("2024-12-10T09:00:00"),
    statusHistory: [
      { status: "pending_deposit", timestamp: new Date("2024-11-20T11:00:00"), note: "Order created" },
      { status: "deposit_paid", timestamp: new Date("2024-11-20T11:30:00"), note: "Deposit paid" },
      { status: "designing", timestamp: new Date("2024-11-22T10:00:00"), note: "Design in progress" },
      { status: "design_pending_confirm", timestamp: new Date("2024-11-25T15:00:00"), note: "Design ready for review" },
      { status: "design_confirmed", timestamp: new Date("2024-11-26T10:00:00"), note: "Customer confirmed design" },
      { status: "pending_final_payment", timestamp: new Date("2024-11-26T10:00:00"), note: "Waiting for final payment" },
      { status: "manufacturing", timestamp: new Date("2024-11-28T09:00:00"), note: "Production started" },
      { status: "ready_to_ship", timestamp: new Date("2024-12-08T14:00:00"), note: "Production completed" },
      { status: "shipped", timestamp: new Date("2024-12-10T09:00:00"), note: "Order shipped via SF Express" },
    ],
    designName: "Luxury Chrome Elite",
    description: "Premium luxury wheel with chrome finish and elegant spoke design",
    depositAmount: 2400,
    depositPaidAt: new Date("2024-11-20T11:30:00"),
    finalAmount: 5600,
    finalPaidAt: new Date("2024-11-28T08:30:00"),
    designImages: [
      { id: "d2", url: "/luxury-sport-wheel-design-metallic-silver-with-int.jpg", uploadedAt: new Date("2024-11-25T15:00:00"), isConfirmed: true },
    ],
    productionImages: [
      { id: "p1", url: "/elegant-luxury-wheel-gold-accents-premium.jpg", uploadedAt: new Date("2024-12-08T14:00:00") },
    ],
    logistics: {
      courier: "SF Express",
      trackingNumber: "SF1234567890",
      shippedAt: new Date("2024-12-10T09:00:00"),
    },
    sessionId: "session3",
  },
  "4": {
    id: "4",
    orderNumber: "ORD-2024-004",
    userId: "user1",
    type: "manual_service",
    status: "completed",
    amount: 700,
    createdAt: new Date("2024-11-15T08:00:00"),
    updatedAt: new Date("2024-11-20T17:00:00"),
    statusHistory: [
      { status: "pending_payment", timestamp: new Date("2024-11-15T08:00:00"), note: "Order created" },
      { status: "paid", timestamp: new Date("2024-11-15T08:10:00"), note: "Payment completed" },
      { status: "completed", timestamp: new Date("2024-11-20T17:00:00"), note: "Service completed" },
    ],
    sessionId: "session4",
  },
  "5": {
    id: "5",
    orderNumber: "ORD-2024-005",
    userId: "user1",
    type: "custom_service",
    status: "pending_deposit",
    amount: 6500,
    createdAt: new Date("2024-12-12T09:00:00"),
    updatedAt: new Date("2024-12-12T09:00:00"),
    statusHistory: [
      { status: "pending_deposit", timestamp: new Date("2024-12-12T09:00:00"), note: "Order created, waiting for deposit" },
    ],
    designName: "Modern Minimalist Pro",
    description: "Clean minimalist design with matte black finish",
    depositAmount: 1950,
    finalAmount: 4550,
    designImages: [],
    sessionId: "session5",
  },
}

interface OrderDetailProps {
  orderId: string
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const { t, language } = useLanguage()
  const [imOpen, setImOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const order = mockOrdersMap[orderId]

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{t.orders.noOrders}</h3>
          <Button asChild>
            <Link href="/profile/orders">{language === "zh" ? "返回订单列表" : "Back to Orders"}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  const getStatusText = (status: string) => {
    return t.orders.statuses[status as keyof typeof t.orders.statuses] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_payment: "bg-amber-100 text-amber-700 border-amber-200",
      pending_deposit: "bg-amber-100 text-amber-700 border-amber-200",
      paid: "bg-blue-100 text-blue-700 border-blue-200",
      deposit_paid: "bg-blue-100 text-blue-700 border-blue-200",
      designing: "bg-purple-100 text-purple-700 border-purple-200",
      design_pending_confirm: "bg-orange-100 text-orange-700 border-orange-200",
      design_rejected: "bg-red-100 text-red-700 border-red-200",
      design_confirmed: "bg-green-100 text-green-700 border-green-200",
      pending_final_payment: "bg-amber-100 text-amber-700 border-amber-200",
      manufacturing: "bg-indigo-100 text-indigo-700 border-indigo-200",
      ready_to_ship: "bg-cyan-100 text-cyan-700 border-cyan-200",
      shipped: "bg-teal-100 text-teal-700 border-teal-200",
      received: "bg-emerald-100 text-emerald-700 border-emerald-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-gray-100 text-gray-700 border-gray-200",
    }
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  const getStatusIcon = (status: string, isCurrent: boolean) => {
    if (status === "cancelled") return <XCircle className="h-5 w-5 text-gray-500" />
    if (status === "completed" || status === "received") return <CheckCircle2 className="h-5 w-5 text-green-500" />
    if (isCurrent) return <CircleDot className="h-5 w-5 text-primary animate-pulse" />
    return <Check className="h-5 w-5 text-green-500" />
  }

  const customOrder = isCustomServiceOrder(order) ? order as CustomServiceOrder : null

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 gap-2">
          <Link href="/profile/orders">
            <ArrowLeft className="h-4 w-4" />
            {language === "zh" ? "返回订单列表" : "Back to Orders"}
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
              <Badge className={`border ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </Badge>
            </div>
            {customOrder?.designName && (
              <h2 className="text-lg text-muted-foreground">{customOrder.designName}</h2>
            )}
          </div>

          {/* Always visible Contact Service button */}
          <Button onClick={() => setImOpen(true)} className="gap-2">
            <MessageCircle className="h-4 w-4" />
            {t.orders.contactService}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info Card */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "zh" ? "订单信息" : "Order Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t.orders.orderType}</span>
                  <p className="font-medium">
                    {t.orders.types[order.type as keyof typeof t.orders.types]}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t.orders.createdAt}</span>
                  <p className="font-medium">{formatDateTime(order.createdAt)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t.orders.totalAmount}</span>
                  <p className="font-semibold text-lg">{formatCurrency(order.amount)}</p>
                </div>
                {customOrder && (
                  <>
                    <div>
                      <span className="text-muted-foreground">{t.orders.deposit} (30%)</span>
                      <p className="font-medium">
                        {formatCurrency(customOrder.depositAmount)}
                        {customOrder.depositPaidAt && (
                          <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700">
                            {language === "zh" ? "已付" : "Paid"}
                          </Badge>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t.orders.finalPayment} (70%)</span>
                      <p className="font-medium">
                        {formatCurrency(customOrder.finalAmount)}
                        {customOrder.finalPaidAt && (
                          <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700">
                            {language === "zh" ? "已付" : "Paid"}
                          </Badge>
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {customOrder?.description && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {language === "zh" ? "设计说明" : "Description"}
                    </span>
                    <p className="mt-1">{customOrder.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Design Images */}
          {customOrder && customOrder.designImages.length > 0 && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">{t.orders.designImages}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {customOrder.designImages.map((design) => (
                    <Dialog key={design.id}>
                      <DialogTrigger asChild>
                        <div 
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                          onClick={() => setSelectedImage(design.url)}
                        >
                          <Image
                            src={design.url}
                            alt="Design"
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          {design.isConfirmed && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-500 text-white">
                                <Check className="h-3 w-3 mr-1" />
                                {language === "zh" ? "已确认" : "Confirmed"}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{language === "zh" ? "设计图预览" : "Design Preview"}</DialogTitle>
                        </DialogHeader>
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                          <Image
                            src={design.url}
                            alt="Design"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>

                {/* Confirm/Reject Design Actions */}
                {order.status === "design_pending_confirm" && (
                  <div className="flex gap-3 mt-6">
                    <Button className="flex-1 gap-2">
                      <Check className="h-4 w-4" />
                      {t.orders.confirmDesign}
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                      <X className="h-4 w-4" />
                      {t.orders.rejectDesign}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Production Images */}
          {customOrder?.productionImages && customOrder.productionImages.length > 0 && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "zh" ? "成品图" : "Production Images"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {customOrder.productionImages.map((img) => (
                    <Dialog key={img.id}>
                      <DialogTrigger asChild>
                        <div className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group">
                          <Image
                            src={img.url}
                            alt="Production"
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{language === "zh" ? "成品图预览" : "Production Preview"}</DialogTitle>
                        </DialogHeader>
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                          <Image
                            src={img.url}
                            alt="Production"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Logistics Info */}
          {customOrder?.logistics && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {t.orders.logistics}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t.orders.courier}</span>
                    <p className="font-medium">{customOrder.logistics.courier}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t.orders.trackingNumber}</span>
                    <p className="font-medium font-mono">{customOrder.logistics.trackingNumber}</p>
                  </div>
                </div>

                {order.status === "shipped" && (
                  <Button className="mt-4 w-full gap-2">
                    <Package className="h-4 w-4" />
                    {t.orders.confirmReceipt}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Timeline & Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">{t.orders.actions}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Pay buttons */}
              {(order.status === "pending_payment" || order.status === "pending_deposit") && (
                <Button className="w-full gap-2">
                  <CreditCard className="h-4 w-4" />
                  {order.status === "pending_deposit" ? t.orders.payDeposit : t.orders.pay}
                </Button>
              )}

              {customOrder && order.status === "pending_final_payment" && (
                <Button className="w-full gap-2">
                  <CreditCard className="h-4 w-4" />
                  {t.orders.payFinal}
                </Button>
              )}

              {customOrder && order.status === "design_pending_confirm" && (
                <>
                  <Button className="w-full gap-2">
                    <Check className="h-4 w-4" />
                    {t.orders.confirmDesign}
                  </Button>
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <X className="h-4 w-4" />
                    {t.orders.rejectDesign}
                  </Button>
                </>
              )}

              {customOrder && order.status === "shipped" && (
                <Button className="w-full gap-2">
                  <Package className="h-4 w-4" />
                  {t.orders.confirmReceipt}
                </Button>
              )}

              {/* Contact Service - Always visible */}
              <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => setImOpen(true)}>
                <MessageCircle className="h-4 w-4" />
                {t.orders.contactService}
              </Button>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t.orders.statusTimeline}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.statusHistory.map((history, index) => {
                  const isCurrent = index === order.statusHistory.length - 1
                  const isLast = index === order.statusHistory.length - 1

                  return (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(history.status, isCurrent)}
                        {!isLast && (
                          <div className="w-px h-full bg-border mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isCurrent ? "text-primary" : ""}`}>
                            {getStatusText(history.status)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDateTime(history.timestamp)}
                        </p>
                        {history.note && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {history.note}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Service IM */}
      {imOpen && (
        <CustomerServiceIM 
          onClose={() => setImOpen(false)} 
          onMinimize={() => setImOpen(false)}
          orderId={order.id}
          orderNumber={order.orderNumber}
        />
      )}
    </div>
  )
}
