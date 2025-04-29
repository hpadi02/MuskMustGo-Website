import { CameraOff } from "lucide-react"

interface PlaceholderImageProps {
  text?: string
  className?: string
}

export default function PlaceholderImage({ text = "Image", className = "" }: PlaceholderImageProps) {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gray-800 ${className}`}>
      <CameraOff className="h-12 w-12 text-gray-400 mb-3" />
      <p className="text-gray-300 text-sm font-medium">{text}</p>
    </div>
  )
}
