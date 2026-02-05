import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GalleryHeader } from "@/components/gallery/gallery-header"
import { GalleryFilters } from "@/components/gallery/gallery-filters"
import { GalleryGrid } from "@/components/gallery/gallery-grid"

export default function GalleryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        <GalleryHeader />
        <GalleryFilters />
        <GalleryGrid />
      </main>
      <Footer />
    </div>
  )
}
