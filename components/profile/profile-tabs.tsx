"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Grid3X3,
  Heart,
  Bookmark,
  FolderOpen,
  Search,
  MoreHorizontal,
  Download,
  Trash2,
  Edit,
  Share2,
  Plus,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/i18n/language-context"

const userWorks = [
  {
    id: 1,
    image: "/racing-wheel-design-lightweight-forged-aluminum.jpg",
    title: "Track Monster Pro",
    titleZh: "赛道怪兽 Pro",
    session: "Racing Concept",
    sessionZh: "竞速概念",
    date: "Dec 8",
    dateZh: "12月8日",
  },
  {
    id: 2,
    image: "/modern-minimalist-wheel-design-matte-black-clean-l.jpg",
    title: "Stealth Runner",
    titleZh: "隐形跑者",
    session: "Minimalist Series",
    sessionZh: "极简系列",
    date: "Dec 7",
    dateZh: "12月7日",
  },
  {
    id: 3,
    image: "/luxury-sport-wheel-design-metallic-silver-with-int.jpg",
    title: "Precision Elite",
    titleZh: "精密精英",
    session: "Sport Collection",
    sessionZh: "运动系列",
    date: "Dec 6",
    dateZh: "12月6日",
  },
  {
    id: 4,
    image: "/cyberpunk-futuristic-wheel-design-neon-accents.jpg",
    title: "Cyber Flux",
    titleZh: "赛博流",
    session: "Future Vision",
    sessionZh: "未来视觉",
    date: "Dec 5",
    dateZh: "12月5日",
  },
  {
    id: 5,
    image: "/elegant-luxury-wheel-gold-accents-premium.jpg",
    title: "Golden Elegance",
    titleZh: "金色优雅",
    session: "Luxury Line",
    sessionZh: "豪华系列",
    date: "Dec 4",
    dateZh: "12月4日",
  },
  {
    id: 6,
    image: "/aggressive-offroad-wheel-design-rugged-terrain.jpg",
    title: "Trail Blazer",
    titleZh: "开拓者",
    session: "Off-Road Series",
    sessionZh: "越野系列",
    date: "Dec 3",
    dateZh: "12月3日",
  },
]

const likedItems = [
  {
    id: 1,
    image: "/classic-vintage-wheel-design-chrome-finish-elegant.jpg",
    title: "Classic Heritage",
    titleZh: "经典传承",
    creator: "Maria Santos",
  },
  {
    id: 2,
    image: "/luxury-suv-wheel-design-premium-chrome-multi-spoke.jpg",
    title: "SUV Prestige",
    titleZh: "SUV 尊贵",
    creator: "David Park",
  },
  {
    id: 3,
    image: "/cyberpunk-futuristic-wheel-design-neon-accents.jpg",
    title: "Neon Dreams",
    titleZh: "霓虹之梦",
    creator: "Yuki Tanaka",
  },
]

const savedItems = [
  {
    id: 1,
    image: "/racing-wheel-design-lightweight-forged-aluminum.jpg",
    title: "Speed Demon",
    titleZh: "速度恶魔",
    creator: "Alex Chen",
  },
  {
    id: 2,
    image: "/modern-minimalist-wheel-design-matte-black-clean-l.jpg",
    title: "Dark Matter",
    titleZh: "暗物质",
    creator: "James Miller",
  },
]

const collections = [
  {
    id: 1,
    name: "Racing Inspirations",
    nameZh: "竞速灵感",
    count: 24,
    cover: "/racing-wheel-design-lightweight-forged-aluminum.jpg",
  },
  {
    id: 2,
    name: "Luxury Concepts",
    nameZh: "豪华概念",
    count: 18,
    cover: "/elegant-luxury-wheel-gold-accents-premium.jpg",
  },
  {
    id: 3,
    name: "Future Designs",
    nameZh: "未来设计",
    count: 12,
    cover: "/cyberpunk-futuristic-wheel-design-neon-accents.jpg",
  },
]

export function ProfileTabs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const { t, language } = useLanguage()

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="works" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="glass bg-secondary/30 w-fit">
              <TabsTrigger
                value="works"
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Grid3X3 className="h-4 w-4" />
                {t.profile.myWorks}
              </TabsTrigger>
              <TabsTrigger
                value="liked"
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Heart className="h-4 w-4" />
                {t.profile.liked}
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Bookmark className="h-4 w-4" />
                {t.profile.saved}
              </TabsTrigger>
              <TabsTrigger
                value="collections"
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FolderOpen className="h-4 w-4" />
                {t.profile.collections}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t.profile.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px] bg-secondary/50 border-border/50"
                />
              </div>
            </div>
          </div>

          {/* My Works Tab */}
          <TabsContent value="works" className="space-y-4">
            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-4 p-3 rounded-lg glass">
                <span className="text-sm">
                  {selectedItems.length} {t.profile.selected}
                </span>
                <Button variant="outline" size="sm" className="bg-transparent gap-1">
                  <Download className="h-4 w-4" />
                  {t.profile.bulkDownload}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  {t.profile.bulkDelete}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedItems([])}>
                  {language === "zh" ? "清除" : "Clear"}
                </Button>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userWorks.map((work) => (
                <div
                  key={work.id}
                  className={`group relative aspect-square rounded-xl overflow-hidden glass cursor-pointer transition-all ${
                    selectedItems.includes(work.id) ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => toggleSelect(work.id)}
                >
                  <Image
                    src={work.image || "/placeholder.svg"}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Selection Checkbox */}
                  <div
                    className={`absolute top-3 left-3 h-5 w-5 rounded border-2 border-white/50 flex items-center justify-center transition-all ${
                      selectedItems.includes(work.id)
                        ? "bg-primary border-primary"
                        : "bg-background/30 group-hover:bg-background/50"
                    }`}
                  >
                    {selectedItems.includes(work.id) && (
                      <svg
                        className="h-3 w-3 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> {t.studio.rename}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" /> {t.common.download}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" /> {t.common.share}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> {t.common.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-sm font-medium truncate">{language === "zh" ? work.titleZh : work.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {language === "zh" ? work.sessionZh : work.session} ·{" "}
                      {language === "zh" ? work.dateZh : work.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Liked Tab */}
          <TabsContent value="liked">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {likedItems.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden glass">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-sm font-medium truncate">
                        {language === "zh" ? item.titleZh : item.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === "zh" ? "作者" : "by"} {item.creator}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {savedItems.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden glass">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-sm font-medium truncate">
                        {language === "zh" ? item.titleZh : item.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === "zh" ? "作者" : "by"} {item.creator}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create New Collection */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="aspect-[4/3] rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                    <Plus className="h-8 w-8" />
                    <span className="text-sm font-medium">{t.profile.newCollection}</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="glass">
                  <DialogHeader>
                    <DialogTitle>{t.profile.createCollection}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Input placeholder={t.profile.collectionName} className="bg-secondary/50" />
                    </div>
                    <Button className="w-full glow-primary-sm">{t.profile.create}</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden glass cursor-pointer"
                >
                  <Image
                    src={collection.cover || "/placeholder.svg"}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="font-semibold mb-1">
                        {language === "zh" ? collection.nameZh : collection.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {collection.count} {language === "zh" ? "个设计" : "designs"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
