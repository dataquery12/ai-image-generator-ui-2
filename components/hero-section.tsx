"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-b from-white to-secondary/30">
      {/* Background Effects - softer light colors */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern - very subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-apple border border-gray-100 mb-8">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{t.hero.badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance mb-6 text-foreground">
          {t.hero.title1}
          <br />
          <span className="text-primary">{t.hero.title2}</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 text-pretty">
          {t.hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="lg" className="glow-primary text-base h-12 px-8" asChild>
            <Link href="/studio">
              {t.hero.startDesigning}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base h-12 px-8 bg-white hover:bg-gray-50 border-gray-200"
            asChild
          >
            <Link href="/gallery">{t.hero.exploreGallery}</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center p-4 rounded-2xl bg-white/80 shadow-apple">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">50K+</div>
            <div className="text-sm text-muted-foreground">{t.hero.designsCreated}</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-white/80 shadow-apple">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">12K+</div>
            <div className="text-sm text-muted-foreground">{t.hero.activeCreators}</div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-white/80 shadow-apple">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">98%</div>
            <div className="text-sm text-muted-foreground">{t.hero.satisfactionRate}</div>
          </div>
        </div>
      </div>

      {/* Floating Wheel Preview - lighter colors */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 w-[600px] h-[600px] opacity-10 pointer-events-none">
        <div
          className="absolute inset-0 rounded-full border-8 border-primary/50 animate-spin"
          style={{ animationDuration: "30s" }}
        />
        <div className="absolute inset-16 rounded-full border-4 border-primary/30" />
        <div className="absolute inset-32 rounded-full border-2 border-primary/20" />
      </div>
    </section>
  )
}
