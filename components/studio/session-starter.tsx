"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Shuffle, Sparkles, UserPlus } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useRouter } from "next/navigation"

const galleryWorks = [
  {
    id: 1,
    image: "/luxury-sport-wheel-design-metallic-silver-with-int.jpg",
    title: "Precision Sport Elite",
    titleZh: "精密运动精英",
    style: "Sport",
    styleZh: "运动",
  },
  {
    id: 2,
    image: "/classic-vintage-wheel-design-chrome-finish-elegant.jpg",
    title: "Classic Heritage",
    titleZh: "经典传承",
    style: "Vintage",
    styleZh: "复古",
  },
  {
    id: 3,
    image: "/modern-minimalist-wheel-design-matte-black-clean-l.jpg",
    title: "Stealth Runner",
    titleZh: "隐形跑者",
    style: "Minimalist",
    styleZh: "极简",
  },
  {
    id: 4,
    image: "/racing-wheel-design-lightweight-forged-aluminum.jpg",
    title: "Track Monster Pro",
    titleZh: "赛道怪兽 Pro",
    style: "Racing",
    styleZh: "竞速",
  },
  {
    id: 5,
    image: "/luxury-suv-wheel-design-premium-chrome-multi-spoke.jpg",
    title: "SUV Prestige",
    titleZh: "SUV 尊贵",
    style: "Luxury",
    styleZh: "豪华",
  },
  {
    id: 6,
    image: "/cyberpunk-futuristic-wheel-design-neon-accents.jpg",
    title: "Cyber Flux 2077",
    titleZh: "赛博流 2077",
    style: "Futuristic",
    styleZh: "未来",
  },
  {
    id: 7,
    image: "/aggressive-offroad-wheel-design-rugged-terrain.jpg",
    title: "Trail Blazer X",
    titleZh: "开拓者 X",
    style: "Off-Road",
    styleZh: "越野",
  },
  {
    id: 8,
    image: "/elegant-luxury-wheel-gold-accents-premium.jpg",
    title: "Golden Elegance",
    titleZh: "金色优雅",
    style: "Luxury",
    styleZh: "豪华",
  },
]

interface SessionStarterProps {
  onEditWork: (imageUrl: string) => void
  onRequestCustomDesign: () => void
}

export function SessionStarter({ onEditWork, onRequestCustomDesign }: SessionStarterProps) {
  const [selectedWorks, setSelectedWorks] = useState<typeof galleryWorks>([])
  const { language } = useLanguage()
  const router = useRouter()

  const getRandomWorks = () => {
    const shuffled = [...galleryWorks].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }

  useEffect(() => {
    setSelectedWorks(getRandomWorks())
  }, [])

  const handleShuffle = () => {
    setSelectedWorks(getRandomWorks())
  }

  const handleView = (workId: number) => {
    router.push(`/gallery#work-${workId}`)
  }

  const handleEdit = (imageUrl: string) => {
    onEditWork(imageUrl)
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-2 shadow-lg">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent text-3xl">
            {language === "zh" ? "开始你的创作之旅" : "Start Your Creative Journey"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-base">
            {language === "zh"
              ? "通过 AI 驱动的设计工具，将你的想象转化为精美的轮毂设计"
              : "Transform your imagination into stunning wheel designs with AI-powered tools"}
          </p>
        </div>

        {/* Recommended Templates Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full h-8" />
              <div>
                <h1 className="font-bold tracking-tight text-xl">
                  {language === "zh" ? "推荐模板" : "Recommended Templates"}
                </h1>
                <p className="text-muted-foreground text-xs">
                  {language === "zh" ? "从精选设计中获取灵感" : "Get inspired from curated designs"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 rounded-xl hover:bg-muted/80 transition-all duration-200 bg-white border-2"
              onClick={handleShuffle}
            >
              <Shuffle className="h-4 w-4 mr-1.5" />
              {language === "zh" ? "换一批" : "Shuffle"}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {selectedWorks.map((work) => (
              <div
                key={work.id}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute inset-0">
                  <Image
                    src={work.image || "/placeholder.svg"}
                    alt={language === "zh" ? work.titleZh : work.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="absolute top-3 left-3 z-10">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-foreground text-xs font-semibold shadow-lg">
                    {language === "zh" ? work.styleZh : work.style}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 z-10 transition-all duration-500">
                  <h3 className="text-white font-bold text-base mb-1">
                    {language === "zh" ? work.titleZh : work.title}
                  </h3>
                  <p className="text-white/70 text-xs leading-relaxed">
                    {language === "zh" ? "AI 生成的精美轮毂设计" : "AI-generated wheel design"}
                  </p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                  <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">
                        {language === "zh" ? work.titleZh : work.title}
                      </h3>
                      <p className="text-white/80 text-xs leading-relaxed">
                        {language === "zh" ? "点击查看详情或开始编辑" : "View details or start editing"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 h-9 rounded-xl bg-white/95 hover:bg-white text-foreground font-semibold text-sm"
                          onClick={() => handleView(work.id)}
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          {language === "zh" ? "查看" : "View"}
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 h-9 rounded-xl bg-primary hover:bg-primary/90 font-semibold text-sm"
                          onClick={() => handleEdit(work.image)}
                        >
                          <Pencil className="h-4 w-4 mr-1.5" />
                          {language === "zh" ? "编辑" : "Edit"}
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full h-9 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white font-semibold text-sm backdrop-blur-md"
                        onClick={onRequestCustomDesign}
                      >
                        <UserPlus className="h-4 w-4 mr-1.5" />
                        {language === "zh" ? "申请定制设计" : "Request Custom Design"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Prompt Section */}
        <div className="flex items-center justify-center gap-3 px-5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 py-[25px]">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <p className="text-muted-foreground font-medium text-sm">
            {language === "zh"
              ? "或在下方输入框中描述你的设计需求"
              : "Or describe your design needs in the input box below"}
          </p>
        </div>
      </div>
    </div>
  )
}
