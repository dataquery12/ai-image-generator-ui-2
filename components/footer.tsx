"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n/language-context"

export function Footer() {
  const { t } = useLanguage()

  const footerLinks = {
    product: [
      { label: t.nav.aiStudio, href: "/studio" },
      { label: t.nav.gallery, href: "/gallery" },
      { label: t.nav.pricing, href: "/pricing" },
      { label: t.nav.customDesign, href: "/custom" },
    ],
    company: [
      { label: t.footer.aboutUs, href: "/about" },
      { label: t.footer.blog, href: "/blog" },
      { label: t.footer.careers, href: "/careers" },
      { label: t.footer.contact, href: "/contact" },
    ],
    legal: [
      { label: t.footer.privacyPolicy, href: "/privacy" },
      { label: t.footer.termsOfService, href: "/terms" },
      { label: t.footer.cookiePolicy, href: "/cookies" },
    ],
  }

  return (
    <footer className="border-t border-gray-100 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
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
            <p className="text-sm text-muted-foreground mb-4">{t.footer.description}</p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t.footer.product}</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t.footer.company}</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t.footer.stayUpdated}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.footer.newsletterDesc}</p>
            <form className="flex gap-2">
              <Input type="email" placeholder={t.footer.enterEmail} className="bg-white border-gray-200" />
              <Button type="submit" size="sm">
                {t.footer.subscribe}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 WheelForge AI. {t.footer.allRightsReserved}</p>
          <div className="flex gap-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
