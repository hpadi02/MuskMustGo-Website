"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/hooks/use-cart-simplified"

const CustomizeEmojiPage = () => {
  const [emoji, setEmoji] = useState("")
  const [color, setColor] = useState("#000000")
  const [size, setSize] = useState(50)
  const [price, setPrice] = useState(10)
  const router = useRouter()
  const { type } = useParams()
  const searchParams = useSearchParams()
  const { addItem } = useCart()

  useEffect(() => {
    // You can fetch initial data based on the 'type' param if needed
    console.log("Emoji Type:", type)
    const initialEmoji = searchParams.get("emoji") || "😀"
    setEmoji(initialEmoji)
  }, [type, searchParams])

  const handleEmojiChange = (e) => {
    setEmoji(e.target.value)
  }

  const handleColorChange = (e) => {
    setColor(e.target.value)
  }

  const handleSizeChange = (e) => {
    setSize(Number.parseInt(e.target.value))
  }

  const handleAddToCart = () => {
    addItem({
      id: `emoji-${type}`,
      name: `Custom Emoji - ${type}`,
      price: price,
      image: "/placeholder.svg",
      quantity: 1,
      customOptions: {
        emoji: emoji,
        color: color,
        size: size,
      },
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customize Your Emoji ({type})</h1>

      <div className="mb-4">
        <label htmlFor="emoji" className="block text-gray-700 text-sm font-bold mb-2">
          Emoji:
        </label>
        <input
          type="text"
          id="emoji"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={emoji}
          onChange={handleEmojiChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="color" className="block text-gray-700 text-sm font-bold mb-2">
          Color:
        </label>
        <input
          type="color"
          id="color"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={color}
          onChange={handleColorChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="size" className="block text-gray-700 text-sm font-bold mb-2">
          Size:
        </label>
        <input
          type="number"
          id="size"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={size}
          onChange={handleSizeChange}
        />
      </div>

      <div className="mb-4">
        <p className="text-gray-700 text-sm font-bold">Preview:</p>
        <span style={{ fontSize: `${size}px`, color: color }}>{emoji}</span>
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  )
}

export default CustomizeEmojiPage
