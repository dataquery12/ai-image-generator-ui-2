"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, CreditCard, Wallet } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface CustomServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPaymentSuccess: () => void
}

export function CustomServiceDialog({ open, onOpenChange, onPaymentSuccess }: CustomServiceDialogProps) {
  const [step, setStep] = useState<"intro" | "payment" | "success">("intro")
  const [paymentMethod, setPaymentMethod] = useState("creditCard")
  const { t, language } = useLanguage()

  const cs = t.custom.customService

  const handleGoToPayment = () => {
    setStep("payment")
  }

  const handleSubmitPayment = () => {
    setStep("success")
    setTimeout(() => {
      onPaymentSuccess()
      onOpenChange(false)
      setStep("intro")
    }, 2000)
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => setStep("intro"), 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl rounded-3xl border-0 shadow-2xl">
        {step === "intro" && (
          <>
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold">{cs.title}</DialogTitle>
              <p className="text-muted-foreground mt-2">{cs.description}</p>
            </DialogHeader>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {language === "zh" ? "服务价格" : "Service Price"}
                  </span>
                  <span className="text-2xl font-bold text-primary">{cs.price}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-600" />
                  {cs.responseTime}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">{cs.serviceIncludes}</h4>
                <ul className="space-y-2">
                  {[cs.feature1, cs.feature2, cs.feature3, cs.feature4].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl bg-white"
                  onClick={() => onOpenChange(false)}
                >
                  {t.common.cancel}
                </Button>
                <Button className="flex-1 h-12 rounded-2xl" onClick={handleGoToPayment}>
                  {cs.goToPayment}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold">{cs.orderInfo}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-muted/50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{language === "zh" ? "项目名称" : "Project Name"}</span>
                  <span className="font-medium">{cs.projectName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{cs.sessionId}</span>
                  <span className="font-medium font-mono">SES-2024-1234</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold">{cs.amount}</span>
                  <span className="text-2xl font-bold text-primary">{cs.price.split("/")[0]}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">{cs.paymentMethod}</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="creditCard" id="creditCard" />
                    <Label htmlFor="creditCard" className="flex-1 cursor-pointer flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{cs.creditCard}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{cs.paypal}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="flex-1 cursor-pointer flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{cs.stripe}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button className="w-full h-12 rounded-2xl font-semibold" onClick={handleSubmitPayment}>
                {cs.submitPayment}
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="py-8 text-center space-y-6">
            <div className="h-20 w-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-green-600">{cs.paymentSuccess}</h3>
              <p className="text-muted-foreground">{cs.serviceActivated}</p>
              <p className="text-sm text-muted-foreground">{cs.contactDesigner}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
