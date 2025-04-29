"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { IMAGES } from "@/lib/image-assets"

interface FallbackImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  useRedFallback?: boolean
  style?: React.CSSProperties
}

export default function FallbackImage({
  src,
  alt,
  width = 400,
  height = 400,
  fill = false,
  className = "",
  useRedFallback = false,
  style = {},
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    src || (useRedFallback ? IMAGES.RED_FALLBACK_IMAGE : IMAGES.FALLBACK_IMAGE),
  )
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (src) {
      setImgSrc(src)
      setIsError(false)
    }
  }, [src])

  const handleError = () => {
    setIsError(true)
    setImgSrc(useRedFallback ? IMAGES.RED_FALLBACK_IMAGE : IMAGES.FALLBACK_IMAGE)
  }

  // For cases where Next.js Image component might not work, fallback to regular img
  if (isError) {
    return fill ? (
      <div className={`relative w-full h-full ${className}`}>
        <img
          src={imgSrc || "/placeholder.svg"}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={style}
        />
      </div>
    ) : (
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit: "cover", ...style }}
      />
    )
  }

  // Try Next.js Image first
  return fill ? (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover"
        onError={handleError}
        unoptimized={true}
        style={style}
      />
    </div>
  ) : (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized={true}
      style={style}
    />
  )
}
