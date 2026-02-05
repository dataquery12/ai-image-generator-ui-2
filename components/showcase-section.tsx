"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

const showcaseImages = [
  {
    id: 1,
    src: "/luxury-sport-wheel-design-metallic-silver-with-int.jpg",
    likes: 1234,
    style: "Sport",
    styleZh: "运动",
  },
  {
    id: 2,
    src: "/classic-vintage-wheel-design-chrome-finish-elegant.jpg",
    likes: 987,
    style: "Classic",
    styleZh: "经典",
  },
  {
    id: 3,
    src: "/modern-minimalist-wheel-design-matte-black-clean-l.jpg",
    likes: 2156,
    style: "Modern",
    styleZh: "现代",
  },
  { id: 4, src: "/racing-wheel-design-lightweight-forged-aluminum.jpg", likes: 1567, style: "Racing", styleZh: "竞速" },
  { id: 5, src: "/luxury-suv-wheel-design-premium-chrome-multi-spoke.jpg", likes: 892, style: "SUV", styleZh: "SUV" },
  {
    id: 6,
    src: "/cyberpunk-futuristic-wheel-design-neon-accents.jpg",
    likes: 3421,
    style: "Futuristic",
    styleZh: "未来",
  },
]

export function ShowcaseSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const { language } = useLanguage()

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {language === "zh" ? (
              <>
                社区 <span className="text-primary">精选</span>
              </>
            ) : (
              <>
                Community <span className="text-primary">Showcase</span>
              </>
            )}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {language === "zh"
              ? "发现由我们汽车爱好者社区创建的精彩轮毂设计。"
              : "Discover stunning wheel designs created by our community of automotive enthusiasts."}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {showcaseImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square rounded-2xl overflow-hidden glass cursor-pointer"
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={`${image.style} wheel design`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-opacity duration-300 ${hoveredId === image.id ? "opacity-100" : "opacity-0"}`}
              >
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                      {language === "zh" ? image.styleZh : image.style}
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <Heart className="h-4 w-4 text-primary" />
                      {image.likes.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="flex-1 h-8">
                      <Heart className="h-3 w-3 mr-1" />
                      {language === "zh" ? "喜欢" : "Like"}
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="glass bg-transparent">
            {language === "zh" ? "查看全部作品" : "View Full Gallery"}
          </Button>
        </div>
      </div>
    </section>
  )
}
