"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/language-context"

export function GalleryFilters() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMaterial, setSelectedMaterial] = useState("All Materials")
  const [selectedVehicle, setSelectedVehicle] = useState("All Vehicles")
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const { t, language } = useLanguage()

  const categories =
    language === "zh"
      ? ["全部", "精选", "运动", "豪华", "竞速", "复古", "越野", "未来", "极简"]
      : ["All", "Featured", "Sport", "Luxury", "Racing", "Vintage", "Off-Road", "Futuristic", "Minimalist"]

  const materials =
    language === "zh"
      ? ["全部材质", "铝合金", "碳纤维", "镀铬", "哑光", "青铜"]
      : ["All Materials", "Aluminum", "Carbon Fiber", "Chrome", "Matte", "Bronze"]

  const vehicleTypes =
    language === "zh"
      ? ["全部车型", "轿车", "SUV", "跑车", "卡车", "超跑"]
      : ["All Vehicles", "Sedan", "SUV", "Sports Car", "Truck", "Supercar"]

  const sortOptions =
    language === "zh"
      ? [
          { value: "newest", label: "最新发布" },
          { value: "popular", label: "最受欢迎" },
          { value: "trending", label: "热门趋势" },
          { value: "liked", label: "最多喜欢" },
        ]
      : [
          { value: "newest", label: "Newest First" },
          { value: "popular", label: "Most Popular" },
          { value: "trending", label: "Trending" },
          { value: "liked", label: "Most Liked" },
        ]

  const applyFilter = (filter: string) => {
    const allMaterials = language === "zh" ? "全部材质" : "All Materials"
    const allVehicles = language === "zh" ? "全部车型" : "All Vehicles"
    if (filter !== allMaterials && filter !== allVehicles && !activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  return (
    <section className="border-y border-border/50 bg-card/30 sticky top-16 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        {/* Main Filter Row */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.gallery.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50 border-border/50"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 flex-1">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? "glow-primary-sm" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 bg-transparent"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {language === "zh" ? "筛选" : "Filters"}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-4">
            <Select
              value={selectedMaterial}
              onValueChange={(v) => {
                setSelectedMaterial(v)
                applyFilter(v)
              }}
            >
              <SelectTrigger className="w-[180px] bg-secondary/50 border-border/50">
                <SelectValue placeholder={language === "zh" ? "材质" : "Material"} />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material} value={material}>
                    {material}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedVehicle}
              onValueChange={(v) => {
                setSelectedVehicle(v)
                applyFilter(v)
              }}
            >
              <SelectTrigger className="w-[180px] bg-secondary/50 border-border/50">
                <SelectValue placeholder={language === "zh" ? "车型" : "Vehicle Type"} />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px] bg-secondary/50 border-border/50">
                <SelectValue placeholder={language === "zh" ? "排序" : "Sort By"} />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">{language === "zh" ? "已选择:" : "Active:"}</span>
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="gap-1 pl-2 pr-1">
                {filter}
                <button onClick={() => removeFilter(filter)} className="ml-1 hover:bg-secondary-foreground/10 rounded">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setActiveFilters([])}>
              {t.gallery.clearAll}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
