"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function CTASection() {
  const { language } = useLanguage()

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
          {language === "zh" ? (
            <>
              准备好设计你的
              <br />
              <span className="text-primary">完美轮毂了吗？</span>
            </>
          ) : (
            <>
              Ready to Design Your
              <br />
              <span className="text-primary">Perfect Wheels?</span>
            </>
          )}
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
          {language === "zh"
            ? "加入数千名汽车爱好者，用我们的 AI 平台创造惊艳的轮毂设计。今天免费开始。"
            : "Join thousands of automotive enthusiasts who are already creating stunning wheel designs with our AI platform. Start free today."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="glow-primary text-base h-12 px-8" asChild>
            <Link href="/studio">
              {language === "zh" ? "立即开始创作" : "Start Creating Now"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base h-12 px-8 glass bg-transparent" asChild>
            <Link href="/custom">{language === "zh" ? "申请定制设计" : "Request Custom Design"}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
