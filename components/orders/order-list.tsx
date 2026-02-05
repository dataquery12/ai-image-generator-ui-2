"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Package, MessageCircle, CreditCard, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import Link from "next/link"
import type { Order, OrderType, OrderFilterType } from "@/lib/types/order"
import { getOrderStatusCategory, isCustomServiceOrder } from "@/lib/types/order"

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    userId: "user1",
    type: "manual_service",
    status: "paid",
    amount: 700,
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-01"),
    statusHistory: [
      { status: "pending_payment", timestamp: new Date("2024-12-01") },
      { status: "paid", timestamp: new Date("2024-12-01") },
    ],
    sessionId: "session1",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    userId: "user1",
    type: "custom_service",
    status: "design_pending_confirm",
    amount: 5000,
    createdAt: new Date("2024-12-05"),
    updatedAt: new Date("2024-12-08"),
    statusHistory: [
      { status: "pending_deposit", timestamp: new Date("2024-12-05") },
      { status: "deposit_paid", timestamp: new Date("2024-12-05") },
      { status: "designing", timestamp: new Date("2024-12-06") },
      { status: "design_pending_confirm", timestamp: new Date("2024-12-08") },
    ],
    designName: "Racing Sport Wheel",
    description: "Custom racing wheel with carbon fiber accents",
    depositAmount: 1500,
    depositPaidAt: new Date("2024-12-05"),
    finalAmount: 3500,
    designImages: [
      { id: "d1", url: "/racing-wheel-design-lightweight-forged-aluminum.jpg", uploadedAt: new Date("2024-12-08") },
    ],
    sessionId: "session2",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    userId: "user1",
    type: "custom_service",
    status: "shipped",
    amount: 8000,
    createdAt: new Date("2024-11-20"),
    updatedAt: new Date("2024-12-10"),
    statusHistory: [
      { status: "pending_deposit", timestamp: new Date("2024-11-20") },
      { status: "deposit_paid", timestamp: new Date("2024-11-20") },
      { status: "designing", timestamp: new Date("2024-11-22") },
      { status: "design_pending_confirm", timestamp: new Date("2024-11-25") },
      { status: "design_confirmed", timestamp: new Date("2024-11-26") },
      { status: "pending_final_payment", timestamp: new Date("2024-11-26") },
      { status: "manufacturing", timestamp: new Date("2024-11-28") },
      { status: "ready_to_ship", timestamp: new Date("2024-12-08") },
      { status: "shipped", timestamp: new Date("2024-12-10") },
    ],
    designName: "Luxury Chrome Elite",
    depositAmount: 2400,
    depositPaidAt: new Date("2024-11-20"),
    finalAmount: 5600,
    finalPaidAt: new Date("2024-11-28"),
    designImages: [
      { id: "d2", url: "/luxury-sport-wheel-design-metallic-silver-with-int.jpg", uploadedAt: new Date("2024-11-25"), isConfirmed: true },
    ],
    logistics: {
      courier: "SF Express",
      trackingNumber: "SF1234567890",
      shippedAt: new Date("2024-12-10"),
    },
    sessionId: "session3",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    userId: "user1",
    type: "manual_service",
    status: "completed",
    amount: 700,
    createdAt: new Date("2024-11-15"),
    updatedAt: new Date("2024-11-20"),
    statusHistory: [
      { status: "pending_payment", timestamp: new Date("2024-11-15") },
      { status: "paid", timestamp: new Date("2024-11-15") },
      { status: "completed", timestamp: new Date("2024-11-20") },
    ],
    sessionId: "session4",
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    userId: "user1",
    type: "custom_service",
    status: "pending_deposit",
    amount: 6500,
    createdAt: new Date("2024-12-12"),
    updatedAt: new Date("2024-12-12"),
    statusHistory: [
      { status: "pending_deposit", timestamp: new Date("2024-12-12") },
    ],
    designName: "Modern Minimalist Pro",
    depositAmount: 1950,
    finalAmount: 4550,
    designImages: [],
    sessionId: "session5",
  },
]

interface OrderListProps {
  onContactService?: (orderId: string) => void
}

export function OrderList({ onContactService }: OrderListProps) {
  const { t, language } = useLanguage()
  const [typeFilter, setTypeFilter] = useState<OrderType | "all">("all")
  const [statusFilter, setStatusFilter] = useState<OrderFilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOrders = mockOrders.filter((order) => {
    // Type filter
    if (typeFilter !== "all" && order.type !== typeFilter) return false
    
    // Status filter
    if (statusFilter !== "all" && getOrderStatusCategory(order.status) !== statusFilter) return false
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesOrderNumber = order.orderNumber.toLowerCase().includes(query)
      const matchesDesignName = isCustomServiceOrder(order) && 
        order.designName?.toLowerCase().includes(query)
      if (!matchesOrderNumber && !matchesDesignName) return false
    }
    
    return true
  })

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  const getOrderTypeText = (type: OrderType) => {
    return t.orders.types[type as keyof typeof t.orders.types] || type
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Type Filter */}
        <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as OrderType | "all")}>
          <TabsList className="bg-secondary/30">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t.orders.allOrders}
            </TabsTrigger>
            <TabsTrigger value="manual_service" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t.orders.manualService}
            </TabsTrigger>
            <TabsTrigger value="custom_service" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t.orders.customService}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.orders.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "in_progress", "completed", "cancelled"] as OrderFilterType[]).map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className={statusFilter === status ? "" : "bg-transparent"}
          >
            {t.orders.filter[status === "in_progress" ? "inProgress" : status as keyof typeof t.orders.filter]}
          </Button>
        ))}
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t.orders.noOrders}</h3>
            <p className="text-muted-foreground">{t.orders.noOrdersDesc}</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="glass rounded-xl p-4 sm:p-6 hover:shadow-apple-lg transition-shadow"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Order Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">
                      {order.orderNumber}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {getOrderTypeText(order.type)}
                    </Badge>
                    <Badge className={`text-xs border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>

                  {isCustomServiceOrder(order) && order.designName && (
                    <h3 className="font-semibold text-lg">{order.designName}</h3>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>{t.orders.amount}: <span className="font-semibold text-foreground">{formatCurrency(order.amount)}</span></span>
                    <span>{t.orders.createdAt}: {formatDate(order.createdAt)}</span>
                  </div>

                  {/* Custom service specific info */}
                  {isCustomServiceOrder(order) && (
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {order.depositPaidAt && (
                        <span>{t.orders.deposit}: {formatCurrency(order.depositAmount)} ({language === "zh" ? "已付" : "Paid"})</span>
                      )}
                      {order.finalPaidAt && (
                        <span>{t.orders.finalPayment}: {formatCurrency(order.finalAmount)} ({language === "zh" ? "已付" : "Paid"})</span>
                      )}
                      {order.logistics && (
                        <span>{t.orders.trackingNumber}: {order.logistics.trackingNumber}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                  {/* Contact Service - Always visible */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onContactService?.(order.id)}
                    className="gap-1.5 bg-transparent"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t.orders.contactService}
                  </Button>

                  {/* Pay button for pending orders */}
                  {(order.status === "pending_payment" || order.status === "pending_deposit") && (
                    <Button size="sm" className="gap-1.5">
                      <CreditCard className="h-4 w-4" />
                      {order.status === "pending_deposit" ? t.orders.payDeposit : t.orders.pay}
                    </Button>
                  )}

                  {/* Pay final for pending_final_payment */}
                  {isCustomServiceOrder(order) && order.status === "pending_final_payment" && (
                    <Button size="sm" className="gap-1.5">
                      <CreditCard className="h-4 w-4" />
                      {t.orders.payFinal}
                    </Button>
                  )}

                  {/* Confirm design */}
                  {isCustomServiceOrder(order) && order.status === "design_pending_confirm" && (
                    <Button size="sm" variant="outline" className="gap-1.5 bg-transparent">
                      {t.orders.confirmDesign}
                    </Button>
                  )}

                  {/* Confirm receipt */}
                  {isCustomServiceOrder(order) && order.status === "shipped" && (
                    <Button size="sm" className="gap-1.5">
                      {t.orders.confirmReceipt}
                    </Button>
                  )}

                  {/* View Details */}
                  <Button variant="ghost" size="sm" asChild className="gap-1">
                    <Link href={`/profile/orders/${order.id}`}>
                      {t.orders.viewDetails}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
