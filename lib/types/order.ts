// Order Types for Manual Service and Custom Service Orders

export type ManualServiceOrderStatus = 
  | "pending_payment"    // 待支付
  | "paid"               // 已支付
  | "completed"          // 已完成
  | "cancelled"          // 已取消

export type CustomServiceOrderStatus = 
  | "pending_deposit"           // 待支付预付款
  | "deposit_paid"              // 已支付预付款 (30%)
  | "designing"                 // 厂家设计中
  | "design_pending_confirm"    // 待确认设计
  | "design_rejected"           // 设计被驳回
  | "design_confirmed"          // 设计已确认
  | "pending_final_payment"     // 待支付尾款 (70%)
  | "manufacturing"             // 生产中
  | "ready_to_ship"             // 待发货
  | "shipped"                   // 已发货
  | "received"                  // 已收货
  | "completed"                 // 已完成
  | "cancelled"                 // 已取消

export type OrderType = "manual_service" | "custom_service"

export type OrderStatus = ManualServiceOrderStatus | CustomServiceOrderStatus

export interface StatusHistoryItem {
  status: OrderStatus
  timestamp: Date
  note?: string
}

export interface DesignImage {
  id: string
  url: string
  uploadedAt: Date
  isConfirmed?: boolean
}

export interface LogisticsInfo {
  courier: string
  trackingNumber: string
  shippedAt?: Date
}

export interface BaseOrder {
  id: string
  orderNumber: string
  userId: string
  type: OrderType
  status: OrderStatus
  amount: number
  createdAt: Date
  updatedAt: Date
  statusHistory: StatusHistoryItem[]
}

export interface ManualServiceOrder extends BaseOrder {
  type: "manual_service"
  status: ManualServiceOrderStatus
  sessionId?: string  // Associated chat session
}

export interface CustomServiceOrder extends BaseOrder {
  type: "custom_service"
  status: CustomServiceOrderStatus
  designName: string
  description?: string
  depositAmount: number      // 30% of total
  depositPaidAt?: Date
  finalAmount: number        // 70% of total
  finalPaidAt?: Date
  designImages: DesignImage[]
  productionImages?: DesignImage[]
  logistics?: LogisticsInfo
  sessionId?: string         // Associated chat session
}

export type Order = ManualServiceOrder | CustomServiceOrder

// Filter types for order list
export type OrderFilterType = "all" | "pending" | "in_progress" | "completed" | "cancelled"

export interface OrderFilters {
  type?: OrderType | "all"
  status?: OrderFilterType
  search?: string
}

// Helper functions
export function isCustomServiceOrder(order: Order): order is CustomServiceOrder {
  return order.type === "custom_service"
}

export function isManualServiceOrder(order: Order): order is ManualServiceOrder {
  return order.type === "manual_service"
}

export function getOrderStatusCategory(status: OrderStatus): OrderFilterType {
  const pendingStatuses: OrderStatus[] = ["pending_payment", "pending_deposit"]
  const inProgressStatuses: OrderStatus[] = [
    "paid",
    "deposit_paid",
    "designing",
    "design_pending_confirm",
    "design_rejected",
    "design_confirmed",
    "pending_final_payment",
    "manufacturing",
    "ready_to_ship",
    "shipped",
    "received"
  ]
  const completedStatuses: OrderStatus[] = ["completed"]
  const cancelledStatuses: OrderStatus[] = ["cancelled"]

  if (pendingStatuses.includes(status)) return "pending"
  if (inProgressStatuses.includes(status)) return "in_progress"
  if (completedStatuses.includes(status)) return "completed"
  if (cancelledStatuses.includes(status)) return "cancelled"
  return "all"
}
