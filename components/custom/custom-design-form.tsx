"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus, Upload, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function CustomDesignForm() {
  const [submitted, setSubmitted] = useState(false)
  const { t, language } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const vehicleTypes =
    language === "zh"
      ? [
          { value: "sedan", label: "轿车" },
          { value: "suv", label: "SUV" },
          { value: "sports", label: "跑车" },
          { value: "truck", label: "卡车" },
          { value: "supercar", label: "超跑" },
          { value: "motorcycle", label: "摩托车" },
          { value: "other", label: "其他" },
        ]
      : [
          { value: "sedan", label: "Sedan" },
          { value: "suv", label: "SUV" },
          { value: "sports", label: "Sports Car" },
          { value: "truck", label: "Truck" },
          { value: "supercar", label: "Supercar" },
          { value: "motorcycle", label: "Motorcycle" },
          { value: "other", label: "Other" },
        ]

  const wheelSizes = [
    { value: "17", label: '17"' },
    { value: "18", label: '18"' },
    { value: "19", label: '19"' },
    { value: "20", label: '20"' },
    { value: "21", label: '21"' },
    { value: "22", label: '22"+' },
    { value: "custom", label: language === "zh" ? "自定义" : "Custom Size" },
  ]

  const budgetRanges =
    language === "zh"
      ? [
          { value: "500-1000", label: "¥3,500 - ¥7,000" },
          { value: "1000-2500", label: "¥7,000 - ¥17,500" },
          { value: "2500-5000", label: "¥17,500 - ¥35,000" },
          { value: "5000-10000", label: "¥35,000 - ¥70,000" },
          { value: "10000+", label: "¥70,000+" },
        ]
      : [
          { value: "500-1000", label: "$500 - $1,000" },
          { value: "1000-2500", label: "$1,000 - $2,500" },
          { value: "2500-5000", label: "$2,500 - $5,000" },
          { value: "5000-10000", label: "$5,000 - $10,000" },
          { value: "10000+", label: "$10,000+" },
        ]

  const productionIntents =
    language === "zh"
      ? [
          { value: "concept", label: "仅概念" },
          { value: "prototype", label: "原型" },
          { value: "small-batch", label: "小批量 (1-100)" },
          { value: "mass", label: "批量生产 (100+)" },
        ]
      : [
          { value: "concept", label: "Concept Only" },
          { value: "prototype", label: "Prototype" },
          { value: "small-batch", label: "Small Batch (1-100)" },
          { value: "mass", label: "Mass Production (100+)" },
        ]

  if (submitted) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">{t.custom.success.title}</h1>
          <p className="text-muted-foreground mb-8">{t.custom.success.message}</p>
          <Button className="glow-primary-sm" onClick={() => setSubmitted(false)}>
            {t.custom.success.submitAnother}
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <UserPlus className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {language === "zh" ? "专业设计服务" : "Professional Design Service"}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-balance">
            {language === "zh" ? (
              <>
                申请 <span className="text-primary">定制设计</span>
              </>
            ) : (
              <>
                Request a <span className="text-primary">Custom Design</span>
              </>
            )}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {language === "zh"
              ? "与我们的专业设计师直接合作，将你的愿景变为现实。从概念到可制造规格，全程服务。"
              : "Work directly with our professional designers to bring your vision to life. From concept to manufacturing-ready specifications."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">{language === "zh" ? "联系信息" : "Contact Information"}</h2>

              <div className="space-y-2">
                <Label>{language === "zh" ? "姓名 *" : "Full Name *"}</Label>
                <Input placeholder={language === "zh" ? "张三" : "John Doe"} className="bg-secondary/50" required />
              </div>

              <div className="space-y-2">
                <Label>{language === "zh" ? "邮箱地址 *" : "Email Address *"}</Label>
                <Input
                  type="email"
                  placeholder={language === "zh" ? "zhangsan@example.com" : "john@example.com"}
                  className="bg-secondary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{language === "zh" ? "电话号码" : "Phone Number"}</Label>
                <Input
                  type="tel"
                  placeholder={language === "zh" ? "+86 138 0000 0000" : "+1 (555) 000-0000"}
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label>{language === "zh" ? "公司（可选）" : "Company (Optional)"}</Label>
                <Input placeholder={language === "zh" ? "公司名称" : "Company name"} className="bg-secondary/50" />
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">{language === "zh" ? "项目详情" : "Project Details"}</h2>

              <div className="space-y-2">
                <Label>{language === "zh" ? "车辆类型 *" : "Vehicle Type *"}</Label>
                <Select required>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder={language === "zh" ? "选择车辆类型" : "Select vehicle type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{language === "zh" ? "轮毂尺寸" : "Wheel Size"}</Label>
                <Select>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder={language === "zh" ? "选择尺寸" : "Select size"} />
                  </SelectTrigger>
                  <SelectContent>
                    {wheelSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{language === "zh" ? "预算范围" : "Budget Range"}</Label>
                <Select>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder={language === "zh" ? "选择预算" : "Select budget"} />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((budget) => (
                      <SelectItem key={budget.value} value={budget.value}>
                        {budget.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{language === "zh" ? "生产意向" : "Production Intent"}</Label>
                <Select>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder={language === "zh" ? "选择意向" : "Select intent"} />
                  </SelectTrigger>
                  <SelectContent>
                    {productionIntents.map((intent) => (
                      <SelectItem key={intent.value} value={intent.value}>
                        {intent.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 space-y-2">
            <Label>{language === "zh" ? "设计描述 *" : "Design Description *"}</Label>
            <Textarea
              placeholder={
                language === "zh"
                  ? "描述你对轮毂设计的愿景。包括风格偏好、材质、颜色、辐条样式及任何特殊要求..."
                  : "Describe your vision for the wheel design. Include style preferences, materials, colors, spoke patterns, and any specific requirements..."
              }
              className="bg-secondary/50 min-h-[150px]"
              required
            />
          </div>

          {/* Reference Upload */}
          <div className="mt-8 space-y-2">
            <Label>{language === "zh" ? "参考图片（可选）" : "Reference Images (Optional)"}</Label>
            <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">
                {language === "zh" ? (
                  <>
                    拖放图片到这里，或 <span className="text-primary">浏览</span>
                  </>
                ) : (
                  <>
                    Drag and drop images here, or <span className="text-primary">browse</span>
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "zh" ? "PNG、JPG 格式，每个最大 10MB" : "PNG, JPG up to 10MB each"}
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-8 flex items-start gap-3">
            <Checkbox id="terms" required className="mt-1" />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              {language === "zh" ? (
                <>
                  我同意{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    服务条款
                  </a>{" "}
                  和{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    隐私政策
                  </a>
                  。我知悉将会收到关于此设计请求的联系。
                </>
              ) : (
                <>
                  I agree to the{" "}
                  <a href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                  . I understand that I will be contacted regarding this design request.
                </>
              )}
            </label>
          </div>

          {/* Submit */}
          <div className="mt-8">
            <Button type="submit" size="lg" className="w-full glow-primary">
              {t.custom.form.submit}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
