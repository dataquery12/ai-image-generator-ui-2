"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, User, Bell, Globe, Check } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/studio", label: t.nav.aiStudio },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/custom", label: t.nav.customDesign },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-lg bg-primary glow-primary-sm" />
              <div className="absolute inset-1 rounded-md bg-white flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Wheel<span className="text-primary">Forge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-gray-100">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-apple-lg">
                <DropdownMenuItem onClick={() => setLanguage("en")} className="flex items-center justify-between">
                  English
                  {language === "en" && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("zh")} className="flex items-center justify-between">
                  中文
                  {language === "zh" && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="hidden sm:flex relative hover:bg-gray-100">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-gray-100">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-gray-200 shadow-apple-lg">
                <DropdownMenuItem asChild>
                  <Link href="/profile">{t.nav.profile}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/orders">{t.orders?.title || "Orders"}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/merchant/chat">{t.merchant?.title || "Merchant"}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>{t.nav.settings}</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login">{t.nav.signOut}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* CTA Button */}
            <Button className="hidden sm:flex glow-primary-sm" asChild>
              <Link href="/login">{t.auth.signIn}</Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 py-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <button
                  onClick={() => setLanguage("en")}
                  className={`text-sm ${language === "en" ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  EN
                </button>
                <span className="text-muted-foreground">/</span>
                <button
                  onClick={() => setLanguage("zh")}
                  className={`text-sm ${language === "zh" ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  中文
                </button>
              </div>
              <div className="pt-4 px-4 flex flex-col gap-2">
                <Button className="w-full glow-primary-sm" asChild>
                  <Link href="/login">{t.auth.signIn}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
