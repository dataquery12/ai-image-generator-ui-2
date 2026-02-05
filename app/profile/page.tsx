import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        <ProfileHeader />
        <ProfileTabs />
      </main>
      <Footer />
    </div>
  )
}
