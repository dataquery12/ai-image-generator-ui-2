"use client"

import { useLanguage } from "@/lib/i18n/language-context"

export function PricingHeader() {
  const { language } = useLanguage()

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
          {language === "zh" ? (
            <>
              简单透明的 <span className="text-primary">定价</span>
            </>
          ) : (
            <>
              Simple, Transparent <span className="text-primary">Pricing</span>
            </>
          )}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          {language === "zh"
            ? "选择适合你创意需求的方案。免费开始，随需升级。无隐藏费用，随时取消。"
            : "Choose the plan that fits your creative needs. Start free and upgrade as you grow. No hidden fees, cancel anytime."}
        </p>
      </div>
    </section>
  )
}
