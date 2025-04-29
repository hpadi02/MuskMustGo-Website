"use client"

import { useEffect, useRef, useState } from "react"

interface EmojiPreviewCanvasProps {
  teslaEmoji: string
  elonEmoji: string
  width?: number
  height?: number
  className?: string
}

export default function EmojiPreviewCanvas({
  teslaEmoji,
  elonEmoji,
  width = 400,
  height = 400,
  className = "",
}: EmojiPreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Draw the canvas with emojis
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Create the template directly without loading an image
    // Set background
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(0, 0, width, height)

    // Draw white section for Tesla
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height / 2)

    // Draw gray section for Elon
    ctx.fillStyle = "#cccccc"
    ctx.fillRect(0, height / 2, width, height / 2)

    // Add black bars at top and bottom
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, width, height * 0.1)
    ctx.fillRect(0, height * 0.9, width, height * 0.1)

    // Change the text font size and alignment
    ctx.fillStyle = "#000000"
    ctx.font = "bold 64px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Tesla text - centered horizontally in its half
    ctx.fillText("TESLA", width * 0.35, height * 0.28)

    // Elon text - centered horizontally in its half
    ctx.fillText("ELON", width * 0.35, height * 0.72)

    // Add emojis with larger font size
    ctx.font = "96px Arial"
    ctx.textAlign = "center"

    // Tesla emoji - centered in its area
    ctx.fillText(teslaEmoji, width * 0.75, height * 0.28)

    // Elon emoji - centered in its area
    ctx.fillText(elonEmoji, width * 0.75, height * 0.72)

    // Add website at bottom - keep centered
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.textAlign = "center"
    ctx.fillText("MuskMustGo.com", width / 2, height * 0.95)

    // Drawing is complete
    setIsLoading(false)
  }, [teslaEmoji, elonEmoji, width, height])

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-300">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`w-full h-full ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
      />
    </div>
  )
}
