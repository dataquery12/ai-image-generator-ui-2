"use client"

import { Sparkles, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function GalleryHeader() {
  const { t, language } = useLanguage()

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">{t.gallery.title}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            {language === "zh" ? (
              <>
                发现精彩的
                <span className="text-primary">轮毂设计</span>
              </>
            ) : (
              <>
                Discover Amazing
                <span className="text-primary"> Wheel Designs</span>
              </>
            )}
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            {language === "zh"
              ? "探索我们创意社区数以千计的 AI 生成轮毂设计。获取灵感，收藏你的最爱，分享你的创作。"
              : "Explore thousands of AI-generated wheel designs from our creative community. Get inspired, save your favorites, and share your own creations."}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap gap-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">24,500+</div>
              <div className="text-sm text-muted-foreground">{t.gallery.totalDesigns}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold">8,200+</div>
              <div className="text-sm text-muted-foreground">{t.gallery.creators}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
