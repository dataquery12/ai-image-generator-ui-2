"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, Download, Share2, Bookmark, Eye, MoreHorizontal, Crown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/i18n/language-context"

const galleryItems = [
  {
    id: 1,
    image: "/luxury-sport-wheel-design-metallic-silver-with-int.jpg",
    title: "Precision Sport Elite",
    titleZh: "精密运动精英",
    style: "Sport",
    styleZh: "运动",
    material: "Aluminum",
    materialZh: "铝合金",
    likes: 1234,
    views: 5678,
    featured: true,
    creator: { name: "Alex Chen", avatar: "/avatar-man-professional.jpg" },
  },
  {
    id: 2,
    image: "/classic-vintage-wheel-design-chrome-finish-elegant.jpg",
    title: "Classic Heritage",
    titleZh: "经典传承",
    style: "Vintage",
    styleZh: "复古",
    material: "Chrome",
    materialZh: "镀铬",
    likes: 987,
    views: 3456,
    featured: false,
    creator: { name: "Maria Santos", avatar: "/avatar-woman-creative.jpg" },
  },
  {
    id: 3,
    image: "/modern-minimalist-wheel-design-matte-black-clean-l.jpg",
    title: "Stealth Runner",
    titleZh: "隐形跑者",
    style: "Minimalist",
    styleZh: "极简",
    material: "Matte",
    materialZh: "哑光",
    likes: 2156,
    views: 8901,
    featured: true,
    creator: { name: "James Miller", avatar: "/avatar-man-casual.jpg" },
  },
  {
    id: 4,
    image: "/racing-wheel-design-lightweight-forged-aluminum.jpg",
    title: "Track Monster Pro",
    titleZh: "赛道怪兽 Pro",
    style: "Racing",
    styleZh: "竞速",
    material: "Carbon Fiber",
    materialZh: "碳纤维",
    likes: 1567,
    views: 6234,
    featured: false,
    creator: { name: "Sarah Kim", avatar: "/professional-woman-avatar.png" },
  },
  {
    id: 5,
    image: "/luxury-suv-wheel-design-premium-chrome-multi-spoke.jpg",
    title: "SUV Prestige",
    titleZh: "SUV 尊贵",
    style: "Luxury",
    styleZh: "豪华",
    material: "Chrome",
    materialZh: "镀铬",
    likes: 892,
    views: 2345,
    featured: false,
    creator: { name: "David Park", avatar: "/business-man-avatar.png" },
  },
  {
    id: 6,
    image: "/cyberpunk-futuristic-wheel-design-neon-accents.jpg",
    title: "Cyber Flux 2077",
    titleZh: "赛博流 2077",
    style: "Futuristic",
    styleZh: "未来",
    material: "Aluminum",
    materialZh: "铝合金",
    likes: 3421,
    views: 12456,
    featured: true,
    creator: { name: "Yuki Tanaka", avatar: "/avatar-person-artistic.jpg" },
  },
  {
    id: 7,
    image: "/aggressive-offroad-wheel-design-rugged-terrain.jpg",
    title: "Trail Blazer X",
    titleZh: "开拓者 X",
    style: "Off-Road",
    styleZh: "越野",
    material: "Aluminum",
    materialZh: "铝合金",
    likes: 756,
    views: 2890,
    featured: false,
    creator: { name: "Mike Johnson", avatar: "/avatar-man-outdoor.jpg" },
  },
  {
    id: 8,
    image: "/elegant-luxury-wheel-gold-accents-premium.jpg",
    title: "Golden Elegance",
    titleZh: "金色优雅",
    style: "Luxury",
    styleZh: "豪华",
    material: "Bronze",
    materialZh: "青铜",
    likes: 1890,
    views: 5670,
    featured: true,
    creator: { name: "Emma Wilson", avatar: "/avatar-woman-elegant.jpg" },
  },
]

interface DesignModalProps {
  item: (typeof galleryItems)[0] | null
  open: boolean
  onClose: () => void
}

function DesignModal({ item, open, onClose }: DesignModalProps) {
  const { t, language } = useLanguage()

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white border-gray-200 shadow-apple-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">{language === "zh" ? item.titleZh : item.title}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
            {item.featured && (
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                <Crown className="h-3 w-3" />
                {t.gallery.featured}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={item.creator.avatar || "/placeholder.svg"} />
                <AvatarFallback>{item.creator.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-foreground">{item.creator.name}</div>
                <div className="text-sm text-muted-foreground">{language === "zh" ? "创作者" : "Creator"}</div>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="text-xs text-muted-foreground mb-1">{language === "zh" ? "风格" : "Style"}</div>
                  <div className="font-medium text-foreground">{language === "zh" ? item.styleZh : item.style}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="text-xs text-muted-foreground mb-1">{language === "zh" ? "材质" : "Material"}</div>
                  <div className="font-medium text-foreground">
                    {language === "zh" ? item.materialZh : item.material}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-foreground">
                  <Heart className="h-4 w-4 text-primary" />
                  {item.likes.toLocaleString()} {t.gallery.likes}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {item.views.toLocaleString()} {t.gallery.views}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <Button className="flex-1 min-w-[100px] glow-primary-sm">
                <Heart className="h-4 w-4 mr-2" />
                {t.gallery.like}
              </Button>
              <Button variant="outline" className="flex-1 min-w-[100px] bg-white border-gray-200 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                {t.common.download}
              </Button>
              <Button variant="outline" size="icon" className="bg-white border-gray-200 hover:bg-gray-50 shrink-0">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white border-gray-200 hover:bg-gray-50 shrink-0">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function GalleryGrid() {
  const [selectedItem, setSelectedItem] = useState<(typeof galleryItems)[0] | null>(null)
  const [likedItems, setLikedItems] = useState<number[]>([])
  const { t, language } = useLanguage()

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Masonry-style Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className={`group break-inside-avoid rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-apple cursor-pointer transition-all duration-300 hover:shadow-apple-lg ${
                index % 3 === 0 ? "aspect-square" : index % 3 === 1 ? "aspect-[4/5]" : "aspect-[3/4]"
              }`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative w-full h-full">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    <Crown className="h-3 w-3" />
                    {t.gallery.featured}
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Top Actions */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Bookmark className="h-4 w-4 text-foreground" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4 text-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-apple-lg">
                        <DropdownMenuItem>{language === "zh" ? "举报" : "Report"}</DropdownMenuItem>
                        <DropdownMenuItem>{language === "zh" ? "复制链接" : "Copy Link"}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={item.creator.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{item.creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate text-white">{item.creator.name}</span>
                    </div>
                    <h3 className="font-semibold mb-1 truncate text-white">
                      {language === "zh" ? item.titleZh : item.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-white/80">
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs text-white">
                          {language === "zh" ? item.styleZh : item.style}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          className="flex items-center gap-1 text-sm text-white hover:text-primary transition-colors"
                          onClick={(e) => toggleLike(item.id, e)}
                        >
                          <Heart
                            className={`h-4 w-4 ${likedItems.includes(item.id) ? "fill-primary text-primary" : ""}`}
                          />
                          {(likedItems.includes(item.id) ? item.likes + 1 : item.likes).toLocaleString()}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="bg-white border-gray-200 hover:bg-gray-50">
            {t.gallery.loadMore}
          </Button>
        </div>
      </div>

      {/* Design Modal */}
      <DesignModal item={selectedItem} open={!!selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  )
}
