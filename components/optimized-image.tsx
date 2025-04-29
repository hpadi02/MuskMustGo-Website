"use client"

import { useState } from "react"
import Image from "next/image"
import { CameraOff } from "lucide-react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
}

export default function OptimizedImage({ src, alt, width, height, fill = false, className = "" }: OptimizedImageProps) {
  const [error, setError] = useState(false)

  // Use placeholder.svg as fallback
  const imageSrc = error ? "/placeholder.svg" : src || "/placeholder.svg"

  if (fill) {
    return (
      <div className="relative w-full h-full">
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 z-10">
            <CameraOff className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-300 text-sm font-medium">Image not available</p>
          </div>
        )}
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          fill
          className={`object-cover ${className}`}
          onError={() => setError(true)}
        />
      </div>
    )
  }

  return (
    <div className="relative">
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 z-10">
          <CameraOff className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-300 text-xs font-medium">Image not available</p>
        </div>
      )}
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width || 400}
        height={height || 400}
        className={`object-cover ${className}`}
        onError={() => setError(true)}
      />
    </div>
  )
}
