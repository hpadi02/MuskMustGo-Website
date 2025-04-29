"use client"

import { useState } from "react"
import Image from "next/image"
import PlaceholderImage from "./placeholder-image"

interface ProductImageProps {
  src: string
  alt: string
  aspectRatio?: "square" | "4:3" | "16:9"
  className?: string
}

export default function ProductImage({ src, alt, aspectRatio = "square", className = "" }: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const aspectRatioClass = {
    square: "aspect-square",
    "4:3": "aspect-[4/3]",
    "16:9": "aspect-[16/9]",
  }[aspectRatio]

  // Use a default placeholder if src is empty or points to a missing file
  const imageSrc = src || "/placeholder.svg"

  return (
    <div className={`relative ${aspectRatioClass} overflow-hidden ${className}`}>
      {(isLoading || hasError) && <PlaceholderImage text={hasError ? "Failed to load image" : "Loading..."} />}

      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        fill
        className={`object-cover ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    </div>
  )
}
