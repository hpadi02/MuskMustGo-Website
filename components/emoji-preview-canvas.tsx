"use client"
import Image from "next/image"

interface EmojiPreviewCanvasProps {
  teslaEmoji: { name: string; path: string }
  elonEmoji: { name: string; path: string }
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
  return (
    <div className={`relative ${className}`}>
      <div className="w-full aspect-square bg-white rounded-lg overflow-hidden flex flex-col">
        {/* Tesla Section - White Background */}
        <div className="flex-1 bg-white flex items-center justify-between px-8">
          <div className="flex-1">
            <h2 className="text-black font-bold text-4xl md:text-5xl tracking-wider">TESLA</h2>
          </div>
          <div className="flex-shrink-0 ml-4">
            <Image
              src={teslaEmoji.path || "/placeholder.svg"}
              alt={teslaEmoji.name}
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>

        {/* Elon Section - Gray Background */}
        <div className="flex-1 bg-gray-300 flex items-center justify-between px-8">
          <div className="flex-1">
            <h2 className="text-black font-bold text-4xl md:text-5xl tracking-wider">ELON</h2>
          </div>
          <div className="flex-shrink-0 ml-4">
            <Image
              src={elonEmoji.path || "/placeholder.svg"}
              alt={elonEmoji.name}
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
