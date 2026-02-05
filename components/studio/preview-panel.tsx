"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Wand2,
  Maximize2,
  X,
  RefreshCw,
  Copy,
  Share2,
  UserPlus,
  Pencil,
  Undo2,
  Send,
  Eraser,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLanguage } from "@/lib/i18n/language-context"

interface EditRequest {
  originalImage: string
  maskDataUrl: string
  mergedImageUrl: string
  editPrompt: string
}

interface PreviewPanelProps {
  selectedImage: string
  onClose: () => void
  onEditSubmit?: (request: EditRequest) => void
}

export function PreviewPanel({ selectedImage, onClose, onEditSubmit }: PreviewPanelProps) {
  const [zoom, setZoom] = useState(100)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isEraseMode, setIsEraseMode] = useState(false)
  const [brushSize, setBrushSize] = useState(30)
  const [editPrompt, setEditPrompt] = useState("")
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasPainted, setHasPainted] = useState(false)
  const [showFloatingInput, setShowFloatingInput] = useState(false)
  const [floatingInputPos, setFloatingInputPos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState<ImageData[]>([])
  const { t, language } = useLanguage()

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }, [])

  useEffect(() => {
    if (isEditMode && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      canvas.width = 512
      canvas.height = 512
      if (ctx) {
        ctx.clearRect(0, 0, 512, 512)
      }
      setHasPainted(false)
      setShowFloatingInput(false)
      setIsEraseMode(false)
    }
  }, [isEditMode])

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return
      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
      setHistory((prev) => [...prev, imageData])

      setIsDrawing(true)
      setShowFloatingInput(false)
      const { x, y } = getCanvasCoords(e)

      ctx.beginPath()
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)

      if (isEraseMode) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"
      } else {
        ctx.fillStyle = "rgba(59, 130, 246, 0.5)"
        ctx.fill()
        setHasPainted(true)
      }
    },
    [brushSize, getCanvasCoords, isEraseMode],
  )

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !canvasRef.current) return
      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      const { x, y } = getCanvasCoords(e)

      ctx.beginPath()
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)

      if (isEraseMode) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"
      } else {
        ctx.fillStyle = "rgba(59, 130, 246, 0.5)"
        ctx.fill()
      }
    },
    [isDrawing, brushSize, getCanvasCoords, isEraseMode],
  )

  const stopDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDrawing && hasPainted && !isEraseMode) {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
          setFloatingInputPos({
            x: e.clientX - rect.left + 20,
            y: e.clientY - rect.top,
          })
          setShowFloatingInput(true)
        }
      }
      setIsDrawing(false)
    },
    [isDrawing, hasPainted, isEraseMode],
  )

  const handleUndo = () => {
    if (history.length === 0 || !canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const prevState = history[history.length - 1]
    ctx.putImageData(prevState, 0, 0)
    setHistory((prev) => prev.slice(0, -1))
    if (history.length === 1) {
      setHasPainted(false)
      setShowFloatingInput(false)
    }
  }

  const handleClearCanvas = () => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    setHistory((prev) => [...prev, imageData])
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setHasPainted(false)
    setShowFloatingInput(false)
  }

  const createMergedImage = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext("2d")
      if (!ctx || !canvasRef.current) {
        resolve("")
        return
      }

      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 512, 512)
        ctx.drawImage(canvasRef.current!, 0, 0, 512, 512)
        resolve(canvas.toDataURL("image/png"))
      }
      img.onerror = () => resolve("")
      img.src = selectedImage
    })
  }, [selectedImage])

  const handleEditSubmit = async () => {
    if (!canvasRef.current || !editPrompt.trim()) return

    const maskDataUrl = canvasRef.current.toDataURL("image/png")
    const mergedImageUrl = await createMergedImage()

    onEditSubmit?.({
      originalImage: selectedImage,
      maskDataUrl,
      mergedImageUrl,
      editPrompt: editPrompt.trim(),
    })

    setIsEditMode(false)
    setEditPrompt("")
    setHistory([])
    setHasPainted(false)
    setShowFloatingInput(false)
    setIsEraseMode(false)
  }

  const cancelEditMode = () => {
    setIsEditMode(false)
    setEditPrompt("")
    setHistory([])
    setHasPainted(false)
    setShowFloatingInput(false)
    setIsEraseMode(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleEditSubmit()
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Preview Header */}
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-xl tracking-tight">
              {isEditMode ? (language === "zh" ? "编辑模式" : "Edit Mode") : t.studio.preview}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isEditMode
                ? language === "zh"
                  ? "涂抹想要修改的区域"
                  : "Paint the area you want to edit"
                : language === "zh"
                  ? "查看生成的图片"
                  : "View generated image"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-secondary"
                      onClick={() => setZoom((z) => Math.max(50, z - 25))}
                    >
                      <ZoomOut className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t.studio.zoomOut}</TooltipContent>
                </Tooltip>
                <span className="text-sm text-muted-foreground w-14 text-center font-medium">{zoom}%</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-secondary"
                      onClick={() => setZoom((z) => Math.min(200, z + 25))}
                    >
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t.studio.zoomIn}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-secondary"
                      onClick={() => setZoom(100)}
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t.studio.resetZoom}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary">
                      <Maximize2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{language === "zh" ? "全屏" : "Fullscreen"}</TooltipContent>
                </Tooltip>
              </>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-secondary"
                  onClick={isEditMode ? cancelEditMode : onClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isEditMode ? (language === "zh" ? "取消编辑" : "Cancel Edit") : t.common.close}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main Preview / Edit Canvas */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8" ref={containerRef}>
          <div
            className="relative w-full max-w-2xl aspect-square rounded-3xl overflow-hidden shadow-apple-lg transition-transform duration-300"
            style={{ transform: isEditMode ? "scale(1)" : `scale(${zoom / 100})` }}
          >
            <Image
              ref={imageRef as React.RefObject<HTMLImageElement | null>}
              src={selectedImage || "/placeholder.svg"}
              alt="Generated wheel design"
              fill
              className="object-cover"
            />
            {isEditMode && (
              <canvas
                ref={canvasRef}
                width={512}
                height={512}
                className={`absolute inset-0 w-full h-full ${isEraseMode ? "cursor-cell" : "cursor-crosshair"}`}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={() => setIsDrawing(false)}
                style={{ touchAction: "none" }}
              />
            )}
          </div>

          {isEditMode && showFloatingInput && (
            <div
              className="absolute z-50 animate-in fade-in zoom-in-95 duration-200"
              style={{
                left: Math.min(floatingInputPos.x, (containerRef.current?.clientWidth || 400) - 340),
                top: Math.min(floatingInputPos.y, (containerRef.current?.clientHeight || 400) - 60),
              }}
            >
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/95 backdrop-blur-2xl shadow-apple-lg">
                <Input
                  placeholder={language === "zh" ? "描述修改内容..." : "Describe changes..."}
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-60 h-11 bg-secondary/50 border-0 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-primary/20"
                  autoFocus
                />
                <Button
                  size="icon"
                  className="h-11 w-11 rounded-xl shadow-apple"
                  onClick={handleEditSubmit}
                  disabled={!editPrompt.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Edit Mode Controls */}
        {isEditMode && (
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-medium">
                    {language === "zh" ? "画笔" : "Brush"}
                  </span>
                  <Slider
                    value={[brushSize]}
                    onValueChange={(v) => setBrushSize(v[0])}
                    min={10}
                    max={80}
                    step={5}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground w-12">{brushSize}px</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isEraseMode ? "default" : "outline"}
                      size="sm"
                      className="rounded-xl h-10 px-5"
                      onClick={() => setIsEraseMode(!isEraseMode)}
                    >
                      <Eraser className="h-4 w-4 mr-2" />
                      {language === "zh" ? "抹除" : "Erase"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{language === "zh" ? "抹除涂抹区域" : "Erase painted area"}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-10 px-5 border-0 bg-secondary hover:bg-secondary/80"
                      onClick={handleUndo}
                      disabled={history.length === 0}
                    >
                      <Undo2 className="h-4 w-4 mr-2" />
                      {language === "zh" ? "撤销" : "Undo"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{language === "zh" ? "撤销" : "Undo"}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-10 px-5 border-0 bg-secondary hover:bg-secondary/80"
                      onClick={handleClearCanvas}
                    >
                      <X className="h-4 w-4 mr-2" />
                      {language === "zh" ? "清除" : "Clear"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{language === "zh" ? "清除涂抹" : "Clear Mask"}</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar - only show when not in edit mode */}
        {!isEditMode && (
          <div className="px-8 py-6">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl h-11 px-5 border-0 bg-secondary hover:bg-secondary/80 transition-all"
                  >
                    <Wand2 className="h-4 w-4" />
                    {t.studio.enhance}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{language === "zh" ? "AI 放大增强" : "AI Upscale & Enhance"}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl h-11 px-5 border-0 bg-secondary hover:bg-secondary/80 transition-all"
                    onClick={() => setIsEditMode(true)}
                  >
                    <Pencil className="h-4 w-4" />
                    {language === "zh" ? "编辑" : "Edit"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {language === "zh" ? "涂抹编辑特定区域" : "Paint to edit specific region"}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl h-11 px-5 border-0 bg-secondary hover:bg-secondary/80 transition-all"
                    onClick={() => {
                      setIsEditMode(true)
                      setIsEraseMode(true)
                    }}
                  >
                    <Eraser className="h-4 w-4" />
                    {language === "zh" ? "抹除" : "Erase"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{language === "zh" ? "抹除图片特定区域" : "Erase specific region"}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl h-11 px-5 border-0 bg-secondary hover:bg-secondary/80 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    {t.studio.download}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.studio.download}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl h-11 px-5 border-0 bg-secondary hover:bg-secondary/80 transition-all"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {language === "zh" ? "重新生成" : "Regenerate"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{language === "zh" ? "重新生成" : "Regenerate"}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl h-11 px-5 border-0 bg-secondary hover:bg-secondary/80 transition-all"
                  >
                    <Copy className="h-4 w-4" />
                    {t.common.copy}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.common.copy}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl h-11 px-5 border-0 bg-secondary hover:bg-secondary/80 transition-all"
                  >
                    <Share2 className="h-4 w-4" />
                    {t.common.share}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.common.share}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="gap-2 rounded-xl h-11 px-5 shadow-apple" size="sm">
                    <UserPlus className="h-4 w-4" />
                    {t.studio.requestCustom}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {language === "zh" ? "与专业设计师合作" : "Work with a professional designer"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
