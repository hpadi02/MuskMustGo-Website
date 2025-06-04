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
        <div className="h-[40%] bg-white flex items-center pl-4 pr-4">
          <div className="flex-1">
            <h2 className="text-black font-bold text-4xl md:text-5xl tracking-wider">TESLA</h2>
          </div>
          <div className="w-20 h-20 flex items-center justify-center ml-2">
            <img
              src={teslaEmoji.path || "/placeholder.svg"}
              alt={teslaEmoji.name}
              style={{
                width: "70px",
                height: "70px",
                minWidth: "70px",
                minHeight: "70px",
                maxWidth: "70px",
                maxHeight: "70px",
                objectFit: "contain",
                display: "block",
              }}
              onError={(e) => {
                console.error("Tesla emoji failed to load:", teslaEmoji.path)
                e.currentTarget.src = "/placeholder.svg"
              }}
              onLoad={() => {
                console.log("Tesla emoji loaded successfully:", teslaEmoji.path)
              }}
            />
          </div>
        </div>

        {/* Elon Section */}
        <div className="h-[40%] bg-gray-300 flex items-center pl-4 pr-4">
          <div className="flex-1">
            <h2 className="text-black font-bold text-4xl md:text-5xl tracking-wider">ELON</h2>
          </div>
          <div className="w-20 h-20 flex items-center justify-center ml-2">
            <img
              src={elonEmoji.path || "/placeholder.svg"}
              alt={elonEmoji.name}
              style={{
                width: "70px",
                height: "70px",
                minWidth: "70px",
                minHeight: "70px",
                maxWidth: "70px",
                maxHeight: "70px",
                objectFit: "contain",
                display: "block",
              }}
              onError={(e) => {
                console.error("Elon emoji failed to load:", elonEmoji.path)
                e.currentTarget.src = "/placeholder.svg"
              }}
              onLoad={() => {
                console.log("Elon emoji loaded successfully:", elonEmoji.path)
              }}
            />
          </div>
        </div>

        {/* Black bottom bar with website */}
        <div className="h-[10%] bg-black flex items-center justify-center">
          <p className="text-white text-sm md:text-base font-medium">MuskMustGo.com</p>
        </div>
      </div>
    </div>
  )
}
