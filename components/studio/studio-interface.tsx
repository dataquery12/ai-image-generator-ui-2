"use client"

import { useState } from "react"
import { SessionSidebar } from "./session-sidebar"
import { ChatPanel } from "./chat-panel"
import { PreviewPanel } from "./preview-panel"
import { PanelLeftClose, PanelRightClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

interface EditRequest {
  originalImage: string
  maskDataUrl: string
  mergedImageUrl: string
  editPrompt: string
}

export function StudioInterface() {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [editRequest, setEditRequest] = useState<EditRequest | null>(null)
  const [isNewSession, setIsNewSession] = useState(false)
  const { t } = useLanguage()

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setRightPanelOpen(true)
  }

  const handleEditSubmit = (request: EditRequest) => {
    setEditRequest(request)
    setRightPanelOpen(false)
  }

  const clearEditRequest = () => {
    setEditRequest(null)
  }

  const handleCreateSession = () => {
    setIsNewSession(true)
    setRightPanelOpen(false)
    setSelectedImage(null)
  }

  const handleSessionStart = () => {
    setIsNewSession(false)
  }

  return (
    <div className="flex h-screen pt-16 bg-background">
      {/* Session Sidebar */}
      <div
        className={`${leftPanelOpen ? "w-72" : "w-0"} transition-all duration-300 overflow-hidden bg-muted/30 border-r border-border/50`}
      >
        <SessionSidebar onCreateSession={handleCreateSession} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar - Apple style minimal */}
        <div className="h-14 flex items-center justify-between px-6 bg-background/95 backdrop-blur-xl border-b border-border/50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-muted"
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            >
              <PanelLeftClose className={`h-4 w-4 transition-transform ${!leftPanelOpen ? "rotate-180" : ""}`} />
            </Button>
            <span className="text-sm font-semibold tracking-tight">AI Wheel Studio</span>
          </div>
          <div className="flex items-center gap-3">
            
            {selectedImage && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-muted"
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
              >
                <PanelRightClose className={`h-4 w-4 transition-transform ${!rightPanelOpen ? "rotate-180" : ""}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Two Column Layout - wider chat panel */}
        <div className="flex-1 flex overflow-hidden">
          <div
            className={`${rightPanelOpen ? "w-[800px]" : "flex-1 max-w-6xl mx-auto"} flex flex-col bg-background transition-all duration-300`}
          >
            <ChatPanel
              onImageSelect={handleImageSelect}
              editRequest={editRequest}
              onEditRequestClear={clearEditRequest}
              isNewSession={isNewSession}
              onSessionStart={handleSessionStart}
            />
          </div>

          {/* Preview Panel */}
          <div
            className={`${rightPanelOpen ? "flex-1" : "w-0"} transition-all duration-300 overflow-hidden bg-muted/30 border-l border-border/50`}
          >
            {selectedImage && (
              <PreviewPanel
                selectedImage={selectedImage}
                onClose={() => setRightPanelOpen(false)}
                onEditSubmit={handleEditSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
