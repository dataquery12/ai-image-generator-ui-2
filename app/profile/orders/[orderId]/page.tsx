"use client"

import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { OrderDetail } from "@/components/orders/order-detail"

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.orderId as string

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <OrderDetail orderId={orderId} />
      </main>
      <Footer />
    </div>
  )
}
