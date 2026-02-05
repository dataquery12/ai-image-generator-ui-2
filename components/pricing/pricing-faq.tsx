"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useLanguage } from "@/lib/i18n/language-context"

export function PricingFAQ() {
  const { language } = useLanguage()

  const faqs =
    language === "zh"
      ? [
          {
            question: "什么是积分，它们如何使用？",
            answer:
              "积分用于生成轮毂设计。每次标准生成消耗 1 积分，高清生成消耗 2 积分。积分在账单日期每月刷新。未使用的积分不会滚动到下个月。",
          },
          {
            question: "我可以随时升级或降级方案吗？",
            answer:
              "可以！你可以随时更改方案。升级时，你将按剩余计费周期的比例支付差额。降级时，更改将在下一个计费周期开始时生效。",
          },
          {
            question: "商业授权包含什么？",
            answer:
              "专业版和无限版包含商业授权，允许你将生成的设计用于商业目的，包括销售带有你设计的产品、用于客户工作或纳入商业项目。",
          },
          {
            question: "付费方案有免费试用吗？",
            answer: "有！专业版提供 7 天免费试用。试用期结束前不会收费，你可以在试用期间随时取消，无需支付任何费用。",
          },
          {
            question: "你们接受哪些付款方式？",
            answer:
              "我们通过 Stripe 接受所有主要信用卡（Visa、Mastercard、American Express、Discover）以及 PayPal。企业客户也可以通过发票付款。",
          },
          {
            question: "可以退款吗？",
            answer:
              "我们为年度订阅提供 30 天退款保证。如果你对购买不满意，请在购买后 30 天内联系我们的支持团队获得全额退款。",
          },
        ]
      : [
          {
            question: "What are credits and how do they work?",
            answer:
              "Credits are used to generate wheel designs. Each standard generation uses 1 credit, while HD generations use 2 credits. Credits refresh monthly on your billing date. Unused credits don't roll over to the next month.",
          },
          {
            question: "Can I upgrade or downgrade my plan at any time?",
            answer:
              "Yes! You can change your plan at any time. When upgrading, you'll be charged a prorated amount for the remaining billing period. When downgrading, the change takes effect at the start of your next billing cycle.",
          },
          {
            question: "What's included in the commercial license?",
            answer:
              "Pro and Unlimited plans include a commercial license that allows you to use generated designs for business purposes, including selling products featuring your designs, using them in client work, or incorporating them into commercial projects.",
          },
          {
            question: "Is there a free trial for paid plans?",
            answer:
              "Yes! Pro plan comes with a 7-day free trial. You won't be charged until the trial ends, and you can cancel anytime during the trial period without any charges.",
          },
          {
            question: "What payment methods do you accept?",
            answer:
              "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through Stripe, as well as PayPal. Enterprise customers can also pay via invoice.",
          },
          {
            question: "Can I get a refund?",
            answer:
              "We offer a 30-day money-back guarantee for annual subscriptions. If you're not satisfied with your purchase, contact our support team within 30 days of your purchase for a full refund.",
          },
        ]

  return (
    <section className="py-16 bg-secondary/20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          {language === "zh" ? "常见问题" : "Frequently Asked Questions"}
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass rounded-xl px-6 border-none data-[state=open]:shadow-lg"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-2">{language === "zh" ? "还有其他问题？" : "Still have questions?"}</p>
          <a href="/contact" className="text-primary hover:underline font-medium">
            {language === "zh" ? "联系我们的支持团队" : "Contact our support team"}
          </a>
        </div>
      </div>
    </section>
  )
}
