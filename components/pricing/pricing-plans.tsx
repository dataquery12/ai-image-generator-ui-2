"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check, Sparkles, Zap, Crown, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/language-context"

export function PricingPlans() {
  const [isYearly, setIsYearly] = useState(false)
  const { t, language } = useLanguage()

  const plans = [
    {
      id: "free",
      name: t.pricing.free,
      description: language === "zh" ? "适合体验 WheelForge" : "Perfect for trying out WheelForge",
      icon: Sparkles,
      monthlyPrice: 0,
      yearlyPrice: 0,
      credits: language === "zh" ? "10 积分/月" : "10 credits/month",
      features:
        language === "zh"
          ? ["每月 10 次 AI 生成", "标准质量输出", "基础编辑工具", "社区作品集访问", "邮件支持"]
          : [
              "10 AI generations per month",
              "Standard quality output",
              "Basic editing tools",
              "Community gallery access",
              "Email support",
            ],
      limitations: language === "zh" ? ["无高清导出", "带水印下载"] : ["No HD export", "Watermarked downloads"],
      cta: t.pricing.getStarted,
      popular: false,
    },
    {
      id: "pro",
      name: t.pricing.pro,
      description: language === "zh" ? "适合认真的爱好者和创作者" : "For serious enthusiasts and creators",
      icon: Zap,
      monthlyPrice: 19,
      yearlyPrice: 190,
      credits: language === "zh" ? "200 积分/月" : "200 credits/month",
      features:
        language === "zh"
          ? [
              "每月 200 次 AI 生成",
              "高清质量输出",
              "高级编辑套件",
              "优先生成队列",
              "无水印",
              "商业授权",
              "优先邮件支持",
            ]
          : [
              "200 AI generations per month",
              "HD quality output",
              "Advanced editing suite",
              "Priority generation queue",
              "No watermarks",
              "Commercial license",
              "Priority email support",
            ],
      limitations: [],
      cta: language === "zh" ? "开始专业版试用" : "Start Pro Trial",
      popular: true,
    },
    {
      id: "unlimited",
      name: language === "zh" ? "无限版" : "Unlimited",
      description: language === "zh" ? "适合专业人士和高级用户" : "For professionals and power users",
      icon: Crown,
      monthlyPrice: 49,
      yearlyPrice: 490,
      credits: language === "zh" ? "无限" : "Unlimited",
      features:
        language === "zh"
          ? [
              "无限 AI 生成",
              "4K 质量输出",
              "完整编辑套件 + AI 增强",
              "即时生成队列",
              "API 访问",
              "定制设计请求",
              "专属客户经理",
              "24/7 优先支持",
            ]
          : [
              "Unlimited AI generations",
              "4K quality output",
              "Full editing suite + AI enhance",
              "Instant generation queue",
              "API access",
              "Custom design requests",
              "Dedicated account manager",
              "24/7 priority support",
            ],
      limitations: [],
      cta: language === "zh" ? "升级无限版" : "Go Unlimited",
      popular: false,
    },
    {
      id: "enterprise",
      name: t.pricing.enterprise,
      description: language === "zh" ? "团队和企业定制方案" : "Custom solutions for teams & businesses",
      icon: Building2,
      monthlyPrice: null,
      yearlyPrice: null,
      credits: language === "zh" ? "定制" : "Custom",
      features:
        language === "zh"
          ? [
              "自定义积分分配",
              "团队工作空间",
              "管理员仪表板",
              "SSO 集成",
              "自定义 AI 模型训练",
              "白标选项",
              "SLA 保证",
              "专属支持团队",
            ]
          : [
              "Custom credit allocation",
              "Team workspace",
              "Admin dashboard",
              "SSO integration",
              "Custom AI model training",
              "White-label options",
              "SLA guarantee",
              "Dedicated support team",
            ],
      limitations: [],
      cta: t.pricing.contactSales,
      popular: false,
    },
  ]

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {t.pricing.monthly}
          </span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={`text-sm ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {t.pricing.yearly}
            <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">
              {t.pricing.savePercent}
            </Badge>
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col p-6 rounded-2xl transition-all ${
                plan.popular
                  ? "glass border-primary/50 shadow-xl shadow-primary/10 scale-105 z-10"
                  : "glass hover:shadow-lg"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">{t.pricing.popular}</Badge>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${plan.popular ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}
                >
                  <plan.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                {plan.monthlyPrice !== null ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        ${isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground">{t.pricing.perMonth}</span>
                    </div>
                    {isYearly && plan.yearlyPrice > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ${plan.yearlyPrice} {language === "zh" ? "按年计费" : "billed annually"}
                        <span className="text-primary ml-1">
                          ({language === "zh" ? "省" : "Save"} ${plan.monthlyPrice * 12 - plan.yearlyPrice})
                        </span>
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-3xl font-bold">{language === "zh" ? "定制价格" : "Custom Pricing"}</div>
                )}
                <div className="text-sm text-primary font-medium mt-2">{plan.credits}</div>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="h-4 w-4 flex items-center justify-center mt-0.5 shrink-0">×</span>
                    {limitation}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                className={`w-full ${plan.popular ? "glow-primary" : ""}`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            {language === "zh" ? "安全支付由以下服务提供" : "Secure payments powered by"}
          </p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            <svg className="h-8" viewBox="0 0 60 25" fill="currentColor">
              <path d="M25.5 0H22L13.8 25h4.3l2-5.8h9.3l2 5.8h4.3L25.5 0zm-4.1 15.2l3.3-9.5 3.3 9.5h-6.6z" />
            </svg>
            <svg className="h-6" viewBox="0 0 100 32" fill="currentColor">
              <text x="0" y="24" fontSize="24" fontWeight="bold">
                stripe
              </text>
            </svg>
            <svg className="h-6" viewBox="0 0 100 32" fill="currentColor">
              <text x="0" y="24" fontSize="20" fontWeight="bold">
                PayPal
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
