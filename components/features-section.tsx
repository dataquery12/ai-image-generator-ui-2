"use client"

import { Sparkles, Layers, Paintbrush, Zap, Download, Users } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function FeaturesSection() {
  const { language } = useLanguage()

  const features = [
    {
      icon: Sparkles,
      title: language === "zh" ? "AI 生成" : "AI Generation",
      description:
        language === "zh"
          ? "用自然语言描述你的愿景，AI 即刻为你创建惊艳的轮毂设计。"
          : "Describe your vision in natural language and watch AI create stunning wheel designs instantly.",
    },
    {
      icon: Layers,
      title: language === "zh" ? "多会话管理" : "Multi-Session",
      description:
        language === "zh"
          ? "管理多个设计会话，整理项目，迭代你最喜欢的概念。"
          : "Manage multiple design sessions, organize projects, and iterate on your favorite concepts.",
    },
    {
      icon: Paintbrush,
      title: language === "zh" ? "后期编辑" : "Post Editing",
      description:
        language === "zh"
          ? "通过局部编辑、放大和专业增强工具微调你的设计。"
          : "Fine-tune your designs with regional editing, upscaling, and professional enhancement tools.",
    },
    {
      icon: Zap,
      title: language === "zh" ? "即时成果" : "Instant Results",
      description:
        language === "zh"
          ? "几秒钟内获得高质量渲染，而非数小时。完美适合快速原型设计和创意构思。"
          : "Get high-quality renders in seconds, not hours. Perfect for rapid prototyping and ideation.",
    },
    {
      icon: Download,
      title: language === "zh" ? "导出就绪" : "Export Ready",
      description:
        language === "zh"
          ? "以多种格式下载你的设计，可直接用于制造或演示。"
          : "Download your designs in multiple formats, ready for manufacturing or presentation.",
    },
    {
      icon: Users,
      title: language === "zh" ? "社区作品集" : "Community Gallery",
      description:
        language === "zh"
          ? "分享你的作品，发现灵感，与全球汽车爱好者交流。"
          : "Share your creations, discover inspiration, and connect with automotive enthusiasts worldwide.",
    },
  ]

  return (
    <section className="py-24 relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            {language === "zh" ? (
              <>
                设计轮毂所需的
                <span className="text-primary">一切</span>
              </>
            ) : (
              <>
                Everything You Need to
                <span className="text-primary"> Design Wheels</span>
              </>
            )}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {language === "zh"
              ? "由尖端 AI 技术驱动的专业工具，专为爱好者和专业人士打造。"
              : "Professional tools powered by cutting-edge AI technology, designed for enthusiasts and professionals alike."}
          </p>
        </div>

        {/* Features Grid - white cards with subtle shadows */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-apple hover:shadow-apple-lg transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
