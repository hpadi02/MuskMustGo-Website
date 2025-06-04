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
        <div className="h-[40%] bg-white flex items-center px-8">
          <div className="flex-1">
            <h2 className="text-black font-bold text-5xl md:text-6xl tracking-wider">TESLA</h2>
          </div>
          <div
            className="w-24 h-24 flex items-center justify-center bg-red-100 border-2 border-red-500"
            style={{ minWidth: "96px", minHeight: "96px" }}
          >
            <img
              src={teslaEmoji.path || "/placeholder.svg"}
              alt={teslaEmoji.name}
              style={{
                width: "80px !important",
                height: "80px !important",
                minWidth: "80px",
                minHeight: "80px",
                maxWidth: "80px",
                maxHeight: "80px",
                objectFit: "contain",
                display: "block",
                border: "2px solid blue",
              }}
              onError={(e) => {
                console.error("Tesla emoji failed to load:", teslaEmoji.path)
                e.currentTarget.src = "/placeholder.svg"
              }}
              onLoad={(e) => {
                console.log("Tesla emoji loaded successfully:", teslaEmoji.path)
                console.log(
                  "Tesla emoji natural dimensions:",
                  e.currentTarget.naturalWidth,
                  "x",
                  e.currentTarget.naturalHeight,
                )
                console.log("Tesla emoji computed style:", window.getComputedStyle(e.currentTarget))
              }}
            />
          </div>
        </div>

        {/* Elon Section */}
        <div className="h-[40%] bg-gray-300 flex items-center px-8">
          <div className="flex-1">
            <h2 className="text-black font-bold text-5xl md:text-6xl tracking-wider">ELON</h2>
          </div>
          <div
            className="w-24 h-24 flex items-center justify-center bg-green-100 border-2 border-green-500"
            style={{ minWidth: "96px", minHeight: "96px" }}
          >
            <img
              src={elonEmoji.path || "/placeholder.svg"}
              alt={elonEmoji.name}
              style={{
                width: "80px !important",
                height: "80px !important",
                minWidth: "80px",
                minHeight: "80px",
                maxWidth: "80px",
                maxHeight: "80px",
                objectFit: "contain",
                display: "block",
                border: "2px solid blue",
              }}
              onError={(e) => {
                console.error("Elon emoji failed to load:", elonEmoji.path)
                e.currentTarget.src = "/placeholder.svg"
              }}
              onLoad={(e) => {
                console.log("Elon emoji loaded successfully:", elonEmoji.path)
                console.log(
                  "Elon emoji natural dimensions:",
                  e.currentTarget.naturalWidth,
                  "x",
                  e.currentTarget.naturalHeight,
                )
                console.log("Elon emoji computed style:", window.getComputedStyle(e.currentTarget))
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
