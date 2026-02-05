import { Navigation } from "@/components/navigation"
import { StudioInterface } from "@/components/studio/studio-interface"

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <StudioInterface />
    </div>
  )
}
