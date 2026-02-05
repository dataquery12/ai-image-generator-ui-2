import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CustomDesignForm } from "@/components/custom/custom-design-form"

export default function CustomDesignPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        <CustomDesignForm />
      </main>
      <Footer />
    </div>
  )
}
