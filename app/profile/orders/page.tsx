"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { OrderList } from "@/components/orders/order-list"
import { useLanguage } from "@/lib/i18n/language-context"
import { useState } from "react"
import { CustomerServiceIM } from "@/components/studio/customer-service-im"

export default function OrdersPage() {
  const { t } = useLanguage()
  const [imOpen, setImOpen] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)

  const handleContactService = (orderId: string) => {
    setCurrentOrderId(orderId)
    setImOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{t.orders.title}</h1>
            <p className="text-muted-foreground mt-2">{t.orders.subtitle}</p>
          </div>

          {/* Order List */}
          <OrderList onContactService={handleContactService} />
        </div>
      </main>
      <Footer />

      {/* Customer Service IM */}
      {imOpen && (
        <CustomerServiceIM 
          onClose={() => setImOpen(false)} 
          onMinimize={() => setImOpen(false)}
        />
      )}
    </div>
  )
}
