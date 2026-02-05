"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  ImagePlus,
  Sparkles,
  X,
  Download,
  RefreshCw,
  Copy,
  Share2,
  UserPlus,
  LayoutGrid,
  Check,
  Pencil,
  CircleStop,
  Save,
  MessageCircle,
  Plus,
} from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/language-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SessionStarter } from "./session-starter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label" // Added Label component
import { Input } from "@/components/ui/input" // Added Input component
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group" // Added RadioGroup components
import { CustomServiceDialog } from "./custom-service-dialog" // Added CustomServiceDialog
import { CustomerServiceIM } from "./customer-service-im" // Added CustomerServiceIM

interface EditRequest {
  originalImage: string
  maskDataUrl: string
  mergedImageUrl: string
  editPrompt: string
}

interface ChatPanelProps {
  onImageSelect: (imageUrl: string) => void
  editRequest?: EditRequest | null
  onEditRequestClear?: () => void
  isNewSession?: boolean
  onSessionStart?: () => void
}

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  image?: string
  images?: string[]
  selectedImageIndex?: number
  mergedEditImage?: string
  isEditRequest?: boolean
  timestamp: Date
  isGenerating?: boolean
  isCustomService?: boolean
}

const templateDesigns = [
  {
    id: 1,
    src: "/racing-wheel-design-lightweight-forged-aluminum.jpg",
    prompt: "Racing-inspired wheel with aggressive spoke design, lightweight forged aluminum, red accents",
    style: "Racing",
  },
  {
    id: 2,
    src: "/luxury-sport-wheel-design-metallic-silver-with-int.jpg",
    prompt: "Luxury sport wheel, metallic silver finish, intricate multi-spoke pattern, premium look",
    style: "Luxury",
  },
  {
    id: 3,
    src: "/modern-minimalist-wheel-design-matte-black-clean-l.jpg",
    prompt: "Modern minimalist wheel, matte black finish, clean lines, subtle design",
    style: "Minimalist",
  },
  {
    id: 4,
    src: "/cyberpunk-futuristic-wheel-design-neon-accents.jpg",
    prompt: "Futuristic cyberpunk wheel with neon accents, bold geometric pattern",
    style: "Futuristic",
  },
  {
    id: 5,
    src: "/classic-vintage-wheel-design-chrome-finish-elegant.jpg",
    prompt: "Classic vintage wheel, chrome finish, elegant spoke design, timeless beauty",
    style: "Classic",
  },
  {
    id: 6,
    src: "/luxury-suv-wheel-design-premium-chrome-multi-spoke.jpg",
    prompt: "Luxury SUV wheel, premium chrome, multi-spoke design, bold and sophisticated",
    style: "SUV",
  },
]

const styleKeywordsEn = [
  "Sport",
  "Luxury",
  "Racing",
  "Vintage",
  "Minimalist",
  "Aggressive",
  "Elegant",
  "Futuristic",
  "Off-road",
  "Chrome",
]

const styleKeywordsZh = ["运动", "豪华", "竞速", "复古", "极简", "激进", "优雅", "未来", "越野", "镀铬"]

const mockMessages: Message[] = [
  {
    id: 1,
    type: "user",
    content: "Create a racing-inspired wheel with aggressive spoke design and carbon fiber accents",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 2,
    type: "ai",
    content:
      "I've generated a racing-inspired wheel design featuring aggressive multi-spoke pattern with carbon fiber center cap and machined lip finish.",
    image: "/racing-wheel-design-lightweight-forged-aluminum.jpg",
    timestamp: new Date(Date.now() - 3500000),
  },
]

const galleryWorks = [
  {
    id: 1,
    image: "/luxury-sport-wheel-design-metallic-silver-with-int.jpg",
    title: "Precision Sport Elite",
    titleZh: "精密运动精英",
  },
  {
    id: 2,
    image: "/classic-vintage-wheel-design-chrome-finish-elegant.jpg",
    title: "Classic Heritage",
    titleZh: "经典传承",
  },
  {
    id: 3,
    image: "/modern-minimalist-wheel-design-matte-black-clean-l.jpg",
    title: "Stealth Runner",
    titleZh: "隐形跑者",
  },
  {
    id: 4,
    image: "/racing-wheel-design-lightweight-forged-aluminum.jpg",
    title: "Track Monster Pro",
    titleZh: "赛道怪兽 Pro",
  },
  {
    id: 5,
    image: "/luxury-suv-wheel-design-premium-chrome-multi-spoke.jpg",
    title: "SUV Prestige",
    titleZh: "SUV 尊贵",
  },
  {
    id: 6,
    image: "/cyberpunk-futuristic-wheel-design-neon-accents.jpg",
    title: "Cyber Flux 2077",
    titleZh: "赛博流 2077",
  },
]

export function ChatPanel({
  onImageSelect,
  editRequest,
  onEditRequestClear,
  isNewSession,
  onSessionStart,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [input, setInput] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [templateOpen, setTemplateOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [showStarter, setShowStarter] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t, language } = useLanguage()

  // State for Save to Works dialog
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveImageUrl, setSaveImageUrl] = useState("")
  const [saveTitle, setSaveTitle] = useState("")
  const [saveDescription, setSaveDescription] = useState("")
  const [saveVisibility, setSaveVisibility] = useState("private")
  const [selectedCollection, setSelectedCollection] = useState<string>("")
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")

  // Mock collections data - in real app, fetch from API
  const [collections, setCollections] = useState([
    { id: "1", name: language === "zh" ? "我的收藏" : "My Favorites", count: 12 },
    { id: "2", name: language === "zh" ? "灵感素材" : "Inspiration", count: 8 },
    { id: "3", name: language === "zh" ? "客户案例" : "Client Work", count: 5 },
  ])

  const [customServiceDialogOpen, setCustomServiceDialogOpen] = useState(false)
  const [customServiceActive, setCustomServiceActive] = useState(false)
  const [imOpen, setImOpen] = useState(false)
  const [imMinimized, setImMinimized] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)

  const [inlineServiceState, setInlineServiceState] = useState<"offer" | "payment" | "success">("offer")
  const [inlinePaymentMethod, setInlinePaymentMethod] = useState("creditCard")

  const styleKeywords = language === "zh" ? styleKeywordsZh : styleKeywordsEn

  useEffect(() => {
    if (editRequest) {
      const newMessage: Message = {
        id: messages.length + 1,
        type: "user",
        content: editRequest.editPrompt,
        mergedEditImage: editRequest.mergedImageUrl,
        isEditRequest: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
      onEditRequestClear?.()

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
    if (isNewSession) {
      setShowStarter(true)
      setMessages([])
    }
  }, [editRequest, messages.length, onEditRequestClear, isNewSession])

  const handleSend = () => {
    if (!input.trim() && uploadedImages.length === 0) return

    // Check if user has selected an image from the last generation
    const selectedReferenceImage = getLastSelectedImage()

    const newMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: input,
      image: uploadedImages.length > 0 ? uploadedImages[0] : selectedReferenceImage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    const userInput = input.toLowerCase()
    setInput("")
    setUploadedImages([])
    setShowStarter(false)
    onSessionStart?.()

    const customDesignKeywords = [
      "定制",
      "custom",
      "人工",
      "专业",
      "professional",
      "设计师",
      "designer",
      "帮我设计",
      "help me design",
      "need help",
      "需要帮助",
    ]
    const needsCustomService = customDesignKeywords.some((keyword) => userInput.includes(keyword))

    if (needsCustomService) {
      // Send custom service offer message
      setTimeout(() => {
        const customServiceMessage: Message = {
          id: messages.length + 2,
          type: "ai",
          content:
            language === "zh"
              ? "我注意到您可能需要专业的定制设计服务。我们的专业设计师团队可以为您提供更深入的个性化设计。"
              : "I noticed you might need professional custom design services. Our expert design team can provide more in-depth personalized designs for you.",
          timestamp: new Date(),
          isCustomService: true,
        }
        setMessages((prev) => [...prev, customServiceMessage])
      }, 500)
      return
    }

    setIsGenerating(true)

    const generatingMessage: Message = {
      id: messages.length + 2,
      type: "ai",
      content: language === "zh" ? "正在为您生成设计..." : "Generating your design...",
      timestamp: new Date(),
      isGenerating: true,
    }
    setMessages((prev) => [...prev, generatingMessage])

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isGenerating
            ? {
                ...msg,
                content:
                  language === "zh"
                    ? "我为您生成了4个设计方案，请选择您最喜欢的一个进行后续操作。"
                    : "I've generated 4 design options for you. Please select your favorite to continue.",
                images: [
                  "/racing-wheel-design-lightweight-forged-aluminum.jpg",
                  "/luxury-sport-wheel-design-metallic-silver-with-int.jpg",
                  "/modern-minimalist-wheel-design-matte-black-clean-l.jpg",
                  "/cyberpunk-futuristic-wheel-design-neon-accents.jpg",
                ],
                selectedImageIndex: undefined,
                isGenerating: false,
              }
            : msg,
        ),
      )
      setIsGenerating(false)
    }, 3000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      fileArray.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setUploadedImages((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const insertKeyword = (keyword: string) => {
    setInput((prev) => (prev ? `${prev}, ${keyword}` : keyword))
  }

  const handleTemplateSelect = (imageUrl: string) => {
    setUploadedImages((prev) => [...prev, imageUrl])
    setTemplateOpen(false)
  }

  const handleCopyPrompt = async (messageId: number, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleEditWork = (imageUrl: string) => {
    setUploadedImages([imageUrl])
    setShowStarter(false)
    onSessionStart?.()
  }

  const handleStopGeneration = () => {
    setIsGenerating(false)
    setMessages((prev) => prev.filter((msg) => !msg.isGenerating))
  }

  const handleSaveToWorks = (imageUrl: string) => {
    setSaveImageUrl(imageUrl)
    setSaveTitle("")
    setSaveDescription("")
    setSaveVisibility("private")
    setSelectedCollection("")
    setIsCreatingCollection(false)
    setNewCollectionName("")
    setSaveDialogOpen(true)
  }

  const handleSaveSubmit = () => {
    if (isCreatingCollection && newCollectionName.trim()) {
      const newCollection = {
        id: Date.now().toString(),
        name: newCollectionName,
        count: 0,
      }
      setCollections([...collections, newCollection])
      setSelectedCollection(newCollection.id)
    }
    console.log("[v0] Saving to works:", {
      saveTitle,
      saveDescription,
      saveVisibility,
      saveImageUrl,
      collection: selectedCollection || "none",
    })
    setSaveDialogOpen(false)
  }

  const handleCustomServicePaymentSuccess = () => {
    setCustomServiceActive(true)
    setImOpen(true)
    setHasNewMessage(true)
  }

  const handleInlinePayment = () => {
    setInlineServiceState("payment")
  }

  const handleInlineCancelService = () => {
    setMessages((prev) => prev.filter((msg) => !msg.isCustomService))
    setInlineServiceState("offer")
  }

  const handleInlineSubmitPayment = () => {
    setInlineServiceState("success")
    setTimeout(() => {
      setCustomServiceActive(true)
      setImOpen(true)
      setHasNewMessage(true)
      setMessages((prev) => prev.filter((msg) => !msg.isCustomService))
      setInlineServiceState("offer")
    }, 2000)
  }

  const handleSelectGeneratedImage = (messageId: number, imageIndex: number) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, selectedImageIndex: msg.selectedImageIndex === imageIndex ? undefined : imageIndex }
          : msg
      )
    )
  }

  // Get the last AI message with images to check if user selected one
  const getLastSelectedImage = (): string | undefined => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i]
      if (msg.type === "ai" && msg.images && msg.images.length > 0) {
        if (msg.selectedImageIndex !== undefined) {
          return msg.images[msg.selectedImageIndex]
        }
        return undefined
      }
    }
    return undefined
  }

  const handleOpenIM = () => {
    setImOpen(true)
    setImMinimized(false)
    setHasNewMessage(false)
  }

  const handleMinimizeIM = () => {
    setImMinimized(true)
    setImOpen(false)
  }

  const handleCloseIM = () => {
    setImOpen(false)
    setImMinimized(false)
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {showStarter ? (
          <SessionStarter
            onEditWork={handleEditWork}
            onRequestCustomDesign={() => setCustomServiceDialogOpen(true)} // Added call to open custom service dialog
          />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-10 space-y-8 scrollbar-hide pb-6 pt-8">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] space-y-3 ${message.type === "user" ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2">
                      {message.type === "ai" && (
                        <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          AI
                        </div>
                      )}
                      <span className="text-sm font-medium">
                        {message.type === "user"
                          ? language === "zh"
                            ? "你"
                            : "You"
                          : language === "zh"
                            ? "WheelForge AI"
                            : "WheelForge AI"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {message.type === "user" && (
                        <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium bg-primary/10 text-primary">
                          Y
                        </div>
                      )}
                    </div>

                    <div className={message.type === "user" ? "flex flex-col items-end" : ""}>
                      {message.isEditRequest && message.mergedEditImage && (
                        <div className="mb-4 p-4 rounded-2xl bg-muted/30">
                          <div className="flex items-center gap-2 mb-3">
                            <Pencil className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {language === "zh" ? "编辑请求" : "Edit Request"}
                            </span>
                          </div>
                          <div className="relative w-full aspect-square max-w-[220px] rounded-2xl overflow-hidden shadow-apple">
                            <Image
                              src={message.mergedEditImage || "/placeholder.svg"}
                              alt="Edit reference"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {message.isGenerating ? (
                        <div className="grid grid-cols-2 gap-3 max-w-xl mb-4">
                          {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 animate-pulse" />
                              <div className="absolute inset-0 backdrop-blur-xl flex items-center justify-center">
                                <div className="h-10 w-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : message.images && message.images.length > 0 ? (
                        <div className="space-y-4 max-w-xl mb-4">
                          <div className="grid grid-cols-2 gap-3">
                            {message.images.map((img, index) => (
                              <div
                                key={index}
                                className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300 ${
                                  message.selectedImageIndex === index
                                    ? "ring-4 ring-primary ring-offset-2 scale-[1.02]"
                                    : "hover:scale-[1.02]"
                                }`}
                                onClick={() => handleSelectGeneratedImage(message.id, index)}
                              >
                                <Image
                                  src={img || "/placeholder.svg"}
                                  alt={`Generated wheel ${index + 1}`}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                {message.selectedImageIndex === index && (
                                  <div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                    <Check className="h-4 w-4 text-white" />
                                  </div>
                                )}
                                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
                                  <span className="text-white text-xs font-medium">#{index + 1}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          {message.selectedImageIndex !== undefined && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
                              <Check className="h-4 w-4 text-primary" />
                              <span className="text-sm text-primary font-medium">
                                {language === "zh" 
                                  ? `已选择方案 #${message.selectedImageIndex + 1}` 
                                  : `Selected option #${message.selectedImageIndex + 1}`}
                              </span>
                              <div className="flex-1" />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-xs"
                                onClick={() => onImageSelect(message.images![message.selectedImageIndex!])}
                              >
                                {language === "zh" ? "查看大图" : "View Full"}
                              </Button>
                              <Button
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => handleSaveToWorks(message.images![message.selectedImageIndex!])}
                              >
                                <Save className="h-3.5 w-3.5 mr-1" />
                                {language === "zh" ? "保存" : "Save"}
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : message.image && (
                        <div
                          className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden mb-4 cursor-pointer group shadow-xl hover:shadow-2xl transition-shadow duration-300"
                          onClick={() => onImageSelect(message.image!)}
                        >
                          <Image
                            src={message.image || "/placeholder.svg"}
                            alt="Generated wheel"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium transition-opacity">
                              {language === "zh" ? "点击查看大图" : "Click to preview"}
                            </span>
                          </div>
                        </div>
                      )}

                      <p className="text-[15px] leading-relaxed">{message.content}</p>

                      {message.isCustomService && (
                        <div className="mt-4 w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-apple-lg overflow-hidden">
                          {inlineServiceState === "offer" && (
                            <div className="p-6 space-y-4">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                  <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg mb-1">{t.custom.customService.title}</h3>
                                  <p className="text-sm text-muted-foreground">{t.custom.customService.description}</p>
                                </div>
                              </div>

                              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 space-y-2">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-primary">
                                    {t.custom.customService.price}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    /{language === "zh" ? "项目" : "project"}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{t.custom.customService.responseTime}</p>
                              </div>

                              <div className="space-y-2">
                                <p className="text-sm font-medium">{t.custom.customService.serviceIncludes}</p>
                                <ul className="space-y-1.5 text-sm text-muted-foreground">
                                  <li className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    {t.custom.customService.feature1}
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    {t.custom.customService.feature2}
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    {t.custom.customService.feature3}
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    {t.custom.customService.feature4}
                                  </li>
                                </ul>
                              </div>

                              <div className="flex gap-3 pt-2">
                                <Button
                                  onClick={handleInlinePayment}
                                  className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg"
                                >
                                  {t.custom.customService.goToPayment}
                                </Button>
                                <Button
                                  onClick={handleInlineCancelService}
                                  variant="outline"
                                  className="h-11 px-6 rounded-2xl bg-transparent"
                                >
                                  {t.common.cancel}
                                </Button>
                              </div>
                            </div>
                          )}

                          {inlineServiceState === "payment" && (
                            <div className="p-6 space-y-5">
                              <div>
                                <h3 className="font-semibold text-lg mb-4">{t.custom.customService.orderInfo}</h3>
                                <div className="space-y-3 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      {language === "zh" ? "项目名称" : "Project Name"}:
                                    </span>
                                    <span className="font-medium">{t.custom.customService.projectName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.custom.customService.sessionId}:</span>
                                    <span className="font-mono text-xs">
                                      #WF-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="h-px bg-gray-200" />
                                  <div className="flex justify-between text-lg">
                                    <span className="font-medium">{t.custom.customService.amount}:</span>
                                    <span className="font-bold text-primary">{t.custom.customService.price}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium mb-3 block">
                                  {t.custom.customService.paymentMethod}
                                </Label>
                                <RadioGroup
                                  value={inlinePaymentMethod}
                                  onValueChange={setInlinePaymentMethod}
                                  className="space-y-2"
                                >
                                  <div className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
                                    <RadioGroupItem value="creditCard" id="inline-credit" />
                                    <Label htmlFor="inline-credit" className="flex-1 cursor-pointer">
                                      {t.custom.customService.creditCard}
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
                                    <RadioGroupItem value="paypal" id="inline-paypal" />
                                    <Label htmlFor="inline-paypal" className="flex-1 cursor-pointer">
                                      {t.custom.customService.paypal}
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
                                    <RadioGroupItem value="stripe" id="inline-stripe" />
                                    <Label htmlFor="inline-stripe" className="flex-1 cursor-pointer">
                                      {t.custom.customService.stripe}
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>

                              <div className="flex gap-3 pt-2">
                                <Button
                                  onClick={handleInlineSubmitPayment}
                                  className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg"
                                >
                                  {t.custom.customService.submitPayment}
                                </Button>
                                <Button
                                  onClick={() => setInlineServiceState("offer")}
                                  variant="outline"
                                  className="h-11 px-6 rounded-2xl"
                                >
                                  {language === "zh" ? "返回" : "Back"}
                                </Button>
                              </div>
                            </div>
                          )}

                          {inlineServiceState === "success" && (
                            <div className="p-8 text-center space-y-4">
                              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="h-8 w-8 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-xl mb-2">{t.custom.customService.paymentSuccess}</h3>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {t.custom.customService.serviceActivated}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {t.custom.customService.contactDesigner}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {message.type === "ai" && message.image && !message.isGenerating && (
                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                          {" "}
                          {/* Added flex-wrap */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-muted">
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t.studio.download}</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-muted">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{language === "zh" ? "重新生成" : "Regenerate"}</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-xl hover:bg-muted"
                                onClick={() => handleCopyPrompt(message.id, message.content)}
                              >
                                {copiedId === message.id ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t.common.copy}</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-muted">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t.common.share}</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-xl hover:bg-muted"
                                onClick={() => handleSaveToWorks(message.image!)} // Call new handler
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{language === "zh" ? "保存到我的作品" : "Save to My Works"}</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 px-4 gap-2 rounded-xl hover:bg-muted relative"
                                onClick={() => setCustomServiceDialogOpen(true)} // Added call to open custom service dialog
                              >
                                <UserPlus className="h-4 w-4" />
                                <span className="text-xs">{t.studio.requestCustomDesign}</span> {/* Updated text */}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {language === "zh" ? "与专业设计师合作" : "Work with a professional designer"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-10 py-4 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground font-medium">{t.studio.styleKeywords}</span>
                <div className="ml-auto flex items-center gap-2">
                  {" "}
                  {/* Added container for buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-4 gap-2 rounded-xl hover:bg-muted"
                    onClick={() => setTemplateOpen(true)}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="text-sm font-medium">{language === "zh" ? "模板" : "Templates"}</span>
                  </Button>
                  {customServiceActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-4 gap-2 rounded-xl hover:bg-muted relative"
                      onClick={handleOpenIM}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">{t.custom.customService.customerService}</span>
                      {hasNewMessage && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {styleKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => insertKeyword(keyword)}
                    className="px-4 py-2 text-sm rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="px-10 py-6 border-t border-gray-100">
          {uploadedImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {uploadedImages.map((img, idx) => (
                <div key={idx} className="relative inline-block">
                  <Image
                    src={img || "/placeholder.svg"}
                    alt="Reference"
                    width={88}
                    height={88}
                    className="rounded-2xl object-cover shadow-apple"
                  />
                  <button
                    onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <Textarea
              placeholder={t.studio.describeDesign}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[120px] resize-none bg-muted/40 border-0 rounded-3xl pl-6 pr-20 pb-14 pt-6 text-[15px] focus-visible:ring-2 focus-visible:ring-primary/20"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-3 left-3 h-10 w-10 rounded-xl hover:bg-muted"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-5 w-5" />
            </Button>

            <Button
              onClick={isGenerating ? handleStopGeneration : handleSend}
              className={`absolute bottom-3 right-3 h-12 w-12 rounded-2xl shadow-apple ${
                isGenerating ? "bg-red-500 hover:bg-red-600" : ""
              }`}
              disabled={!input.trim() && uploadedImages.length === 0 && !isGenerating}
            >
              {isGenerating ? (
                <CircleStop className="h-5 w-5" />
              ) : (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={isGenerating ? { animation: "spin 1s linear infinite" } : {}}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden rounded-3xl border-0 shadow-2xl bg-white">
            <DialogHeader className="pb-6 border-b border-gray-100">
              <DialogTitle className="text-3xl font-bold tracking-tight">
                {" "}
                {/* Changed font size and weight */}
                {language === "zh" ? "选择模板" : "Select Template"}
              </DialogTitle>
              <p className="text-muted-foreground text-base mt-2">
                {" "}
                {/* Changed font size */}
                {language === "zh"
                  ? "从作品集中选择一个设计作为起点，或浏览你的收藏"
                  : "Choose a design from the gallery as a starting point, or browse your collections"}
              </p>
            </DialogHeader>

            <Tabs defaultValue="gallery" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto mb-8">
                {" "}
                {/* Increased margin-bottom */}
                <TabsTrigger
                  value="gallery"
                  className="rounded-t-xl border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-4 font-semibold text-base" // Increased padding and font size
                >
                  {language === "zh" ? "作品集" : "Gallery"}
                </TabsTrigger>
                <TabsTrigger
                  value="myworks"
                  className="rounded-t-xl border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-4 font-semibold text-base" // Increased padding and font size
                >
                  {language === "zh" ? "我的作品" : "My Works"}
                </TabsTrigger>
                <TabsTrigger
                  value="liked"
                  className="rounded-t-xl border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-4 font-semibold text-base" // Increased padding and font size
                >
                  {language === "zh" ? "喜欢的" : "Liked"}
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="rounded-t-xl border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-4 font-semibold text-base" // Increased padding and font size
                >
                  {language === "zh" ? "收藏的" : "Saved"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gallery" className="mt-0">
                <div className="grid grid-cols-4 gap-6 overflow-y-auto max-h-[55vh] p-2 scrollbar-hide">
                  {" "}
                  {/* Increased gap and max-height */}
                  {galleryWorks.map((work) => (
                    <div
                      key={work.id}
                      className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03]" // Increased rounded, shadow, and scale
                      onClick={() => handleTemplateSelect(work.image)}
                    >
                      <Image
                        src={work.image || "/placeholder.svg"}
                        alt={language === "zh" ? work.titleZh : work.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110" // Increased transition duration and scale
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {" "}
                        {/* Increased gradient opacity */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          {" "}
                          {/* Increased padding */}
                          <span className="text-base text-white font-bold block mb-2">
                            {" "}
                            {/* Increased font size and weight */}
                            {language === "zh" ? work.titleZh : work.title}
                          </span>
                          <span className="text-sm text-white/80">
                            {" "}
                            {/* Increased font size */}
                            {language === "zh" ? "点击添加为附件" : "Click to add as attachment"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="myworks" className="mt-0">
                <div className="flex flex-col items-center justify-center h-[55vh] text-muted-foreground">
                  {" "}
                  {/* Increased max-height */}
                  <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center mb-6 shadow-lg">
                    {" "}
                    {/* Increased size, rounded, added gradient and shadow */}
                    <LayoutGrid className="h-12 w-12 text-primary" /> {/* Increased size */}
                  </div>
                  <p className="text-2xl font-bold mb-2">{language === "zh" ? "暂无作品" : "No works yet"}</p>{" "}
                  {/* Increased font size and weight */}
                  <p className="text-base text-muted-foreground">
                    {language === "zh" ? "开始创作你的第一个设计" : "Start creating your first design"}
                  </p>{" "}
                  {/* Increased font size */}
                </div>
              </TabsContent>

              <TabsContent value="liked" className="mt-0">
                <div className="flex flex-col items-center justify-center h-[55vh] text-muted-foreground">
                  {" "}
                  {/* Increased max-height */}
                  <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center mb-6 shadow-lg">
                    {" "}
                    {/* Increased size, rounded, added gradient and shadow */}
                    <LayoutGrid className="h-12 w-12 text-pink-500" /> {/* Increased size */}
                  </div>
                  <p className="text-2xl font-bold mb-2">{language === "zh" ? "暂无喜欢的作品" : "No liked works"}</p>{" "}
                  {/* Increased font size and weight */}
                  <p className="text-base text-muted-foreground">
                    {language === "zh" ? "浏览作品集并添加你喜欢的设计" : "Browse the gallery and add designs you like"}
                  </p>{" "}
                  {/* Increased font size */}
                </div>
              </TabsContent>

              <TabsContent value="saved" className="mt-0">
                <div className="flex flex-col items-center justify-center h-[55vh] text-muted-foreground">
                  {" "}
                  {/* Increased max-height */}
                  <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center mb-6 shadow-lg">
                    {" "}
                    {/* Increased size, rounded, added gradient and shadow */}
                    <LayoutGrid className="h-12 w-12 text-orange-500" /> {/* Increased size */}
                  </div>
                  <p className="text-2xl font-bold mb-2">{language === "zh" ? "暂无收藏的作品" : "No saved works"}</p>{" "}
                  {/* Increased font size and weight */}
                  <p className="text-base text-muted-foreground">
                    {language === "zh" ? "收藏你喜欢的设计以便快速访问" : "Save your favorite designs for quick access"}
                  </p>{" "}
                  {/* Increased font size */}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogContent className="max-w-lg rounded-3xl border-0 shadow-2xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold">
                {language === "zh" ? "保存到我的作品" : "Save to My Works"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-2">
              {saveImageUrl && (
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-apple">
                  <Image src={saveImageUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  {language === "zh" ? "作品标题" : "Title"}
                </Label>
                <Input
                  id="title"
                  placeholder={language === "zh" ? "输入作品标题..." : "Enter title..."}
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  {language === "zh" ? "作品描述" : "Description"}
                </Label>
                <Textarea
                  id="description"
                  placeholder={language === "zh" ? "描述你的设计..." : "Describe your design..."}
                  value={saveDescription}
                  onChange={(e) => setSaveDescription(e.target.value)}
                  className="rounded-xl min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {language === "zh" ? "收藏夹" : "Collection"}{" "}
                  <span className="text-xs text-muted-foreground">({language === "zh" ? "可选" : "Optional"})</span>
                </Label>

                {!isCreatingCollection ? (
                  <div className="space-y-2">
                    <select
                      value={selectedCollection}
                      onChange={(e) => setSelectedCollection(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="">{language === "zh" ? "不使用收藏夹" : "No Collection"}</option>
                      {collections.map((collection) => (
                        <option key={collection.id} value={collection.id}>
                          {collection.name} ({collection.count} {language === "zh" ? "项" : "items"})
                        </option>
                      ))}
                    </select>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full rounded-xl border border-dashed border-gray-300 bg-transparent hover:bg-gray-50"
                      onClick={() => setIsCreatingCollection(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {language === "zh" ? "新建收藏夹" : "Create New Collection"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 p-3 rounded-xl border border-primary/30 bg-primary/5">
                    <Input
                      placeholder={language === "zh" ? "输入收藏夹名称..." : "Enter collection name..."}
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="rounded-lg h-10"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex-1 rounded-lg h-9"
                        onClick={() => {
                          setIsCreatingCollection(false)
                          setNewCollectionName("")
                        }}
                      >
                        {language === "zh" ? "取消" : "Cancel"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="flex-1 rounded-lg h-9"
                        onClick={() => {
                          if (newCollectionName.trim()) {
                            const newCollection = {
                              id: Date.now().toString(),
                              name: newCollectionName,
                              count: 0,
                            }
                            setCollections([...collections, newCollection])
                            setSelectedCollection(newCollection.id)
                            setIsCreatingCollection(false)
                            setNewCollectionName("")
                          }
                        }}
                        disabled={!newCollectionName.trim()}
                      >
                        {language === "zh" ? "创建" : "Create"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{language === "zh" ? "可见性" : "Visibility"}</Label>
                <RadioGroup value={saveVisibility} onValueChange={setSaveVisibility} className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="flex-1 cursor-pointer leading-tight">
                      <div className="font-medium text-sm">{language === "zh" ? "仅自己可见" : "Private"}</div>
                      <div className="text-xs text-muted-foreground">
                        {language === "zh" ? "只有你可以看到" : "Only you can see"}
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="flex-1 cursor-pointer leading-tight">
                      <div className="font-medium text-sm">{language === "zh" ? "公开到社区" : "Public"}</div>
                      <div className="text-xs text-muted-foreground">
                        {language === "zh" ? "所有人可见" : "Everyone can see"}
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl bg-transparent"
                  onClick={() => setSaveDialogOpen(false)}
                >
                  {language === "zh" ? "取消" : "Cancel"}
                </Button>
                <Button className="flex-1 h-11 rounded-xl" onClick={handleSaveSubmit} disabled={!saveTitle.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  {language === "zh" ? "保存" : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <CustomServiceDialog
          open={customServiceDialogOpen}
          onOpenChange={setCustomServiceDialogOpen}
          onPaymentSuccess={handleCustomServicePaymentSuccess}
        />

        {imOpen && <CustomerServiceIM onClose={handleCloseIM} onMinimize={handleMinimizeIM} />}

        {imMinimized && (
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50"
            size="icon"
            onClick={handleOpenIM}
          >
            <MessageCircle className="h-6 w-6" />
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
            )}
          </Button>
        )}
      </div>
    </TooltipProvider>
  )
}
