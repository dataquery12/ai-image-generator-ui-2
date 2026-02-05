"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Settings, Camera, MapPin, Calendar, Crown, Zap } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/language-context"

export function ProfileHeader() {
  const [isEditing, setIsEditing] = useState(false)
  const { t, language } = useLanguage()

  return (
    <section className="relative">
      {/* Cover Image */}
      <div className="h-48 sm:h-64 relative overflow-hidden">
        <Image src="/abstract-dark-tech-pattern-banner.jpg" alt="Profile cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <Button variant="secondary" size="sm" className="absolute top-4 right-4 gap-2 glass">
          <Camera className="h-4 w-4" />
          {t.profile.editCover}
        </Button>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-20 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-28 w-28 sm:h-36 sm:w-36 border-4 border-background shadow-xl">
                <AvatarImage src="/avatar-man-professional.jpg" />
                <AvatarFallback className="text-3xl">JD</AvatarFallback>
              </Avatar>
              <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold">{language === "zh" ? "设计师约翰" : "John Designer"}</h1>
                <Badge className="w-fit gap-1 bg-primary/20 text-primary hover:bg-primary/30">
                  <Crown className="h-3 w-3" />
                  {t.profile.proMember}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-3 max-w-xl">
                {language === "zh"
                  ? "汽车设计爱好者，专注于运动和竞速轮毂概念设计。用设计创造轮毂美学的未来。"
                  : "Automotive design enthusiast specializing in sport and racing wheel concepts. Creating the future of wheel aesthetics one design at a time."}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {language === "zh" ? "洛杉矶, 加州" : "Los Angeles, CA"}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {t.profile.memberSince} {language === "zh" ? "2024年12月" : "Dec 2024"}
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">450</span> {t.profile.credits}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 glass bg-transparent">
                    <Settings className="h-4 w-4" />
                    {t.profile.editProfile}
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{t.profile.editProfile}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>{t.profile.displayName}</Label>
                      <Input
                        defaultValue={language === "zh" ? "设计师约翰" : "John Designer"}
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.profile.bio}</Label>
                      <Textarea
                        defaultValue={
                          language === "zh"
                            ? "汽车设计爱好者，专注于运动和竞速轮毂概念设计。"
                            : "Automotive design enthusiast specializing in sport and racing wheel concepts."
                        }
                        className="bg-secondary/50 resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t.profile.location}</Label>
                        <Input
                          defaultValue={language === "zh" ? "洛杉矶, 加州" : "Los Angeles, CA"}
                          className="bg-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{language === "zh" ? "语言" : "Language"}</Label>
                        <Select defaultValue="en">
                          <SelectTrigger className="bg-secondary/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="zh">中文</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        {t.profile.cancel}
                      </Button>
                      <Button className="glow-primary-sm" onClick={() => setIsEditing(false)}>
                        {t.profile.save}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-4 gap-4 max-w-2xl">
            {[
              { label: t.profile.designs, value: "127" },
              { label: t.profile.totalLikes, value: "4.5K" },
              { label: t.profile.totalViews, value: "23K" },
              { label: t.profile.followers, value: "892" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl glass">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
