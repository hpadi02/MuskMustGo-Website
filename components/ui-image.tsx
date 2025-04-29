"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface UIImageProps extends Omit<ImageProps, "src"> {
  src: string
  fallbackSrc?: string
}

export default function UIImage({ src, fallbackSrc, alt, ...props }: UIImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [error, setError] = useState(false)

  const handleError = () => {
    if (!error && fallbackSrc) {
      setImgSrc(fallbackSrc)
      setError(true)
    }
  }

  return (
    <Image
      {...props}
      src={imgSrc || fallbackSrc || "/placeholder.svg?height=400&width=400"}
      alt={alt}
      onError={handleError}
    />
  )
}
