"use client"

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
      <div className="w-full aspect-square bg-white rounded-lg overflow-hidden flex flex-col border border-gray-200 shadow-sm">
        {/* Black top bar */}
        <div className="h-[10%] bg-black"></div>

        {/* Tesla Section */}
        <div className="h-[40%] bg-white flex items-center justify-between px-8">
          <div>
            <h2 className="text-black font-bold text-5xl md:text-6xl tracking-tight leading-none">TESLA</h2>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={teslaEmoji.path || "/placeholder.svg"}
              alt={teslaEmoji.name}
              style={{
                width: "70px",
                height: "70px",
                objectFit: "contain",
                display: "block",
              }}
              onError={(e) => {
                console.error("Tesla emoji failed to load:", teslaEmoji.path)
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>
        </div>

        {/* Elon Section */}
        <div className="h-[40%] bg-gray-300 flex items-center justify-between px-8">
          <div>
            <h2 className="text-black font-bold text-5xl md:text-6xl tracking-tight leading-none">ELON</h2>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={elonEmoji.path || "/placeholder.svg"}
              alt={elonEmoji.name}
              style={{
                width: "70px",
                height: "70px",
                objectFit: "contain",
                display: "block",
              }}
              onError={(e) => {
                console.error("Elon emoji failed to load:", elonEmoji.path)
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>
        </div>

        {/* Black bottom bar with website */}
        <div className="h-[10%] bg-black flex items-center justify-center">
          <p className="text-white text-lg md:text-xl font-medium">MuskMustGo.com</p>
        </div>
      </div>
    </div>
  )
}
