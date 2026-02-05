import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PricingHeader } from "@/components/pricing/pricing-header"
import { PricingPlans } from "@/components/pricing/pricing-plans"
import { PricingFAQ } from "@/components/pricing/pricing-faq"

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        <PricingHeader />
        <PricingPlans />
        <PricingFAQ />
      </main>
      <Footer />
    </div>
  )
}
