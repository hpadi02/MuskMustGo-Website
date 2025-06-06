"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

const ProductPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Could not fetch product:", error)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: quantity,
        image: product.image,
      }

      const cart = localStorage.getItem("cart")
      const cartItems = cart ? JSON.parse(cart) : []

      // Check if the item already exists in the cart
      const existingItemIndex = cartItems.findIndex((item: any) => item.id === cartItem.id)

      if (existingItemIndex > -1) {
        // If the item exists, update the quantity
        cartItems[existingItemIndex].quantity += quantity
      } else {
        // If the item doesn't exist, add it to the cart
        cartItems.push(cartItem)
      }

      localStorage.setItem("cart", JSON.stringify(cartItems))
      alert("Product added to cart!")
    }
  }

  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:h-[500px] flex justify-center items-center">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-xl font-semibold mb-2">Price: ${product.price}</p>
          <div className="flex items-center mb-4">
            <span className="mr-2">Quantity:</span>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
              onClick={decrementQuantity}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
              className="mx-2 border border-gray-300 text-center w-16 py-2"
            />
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
              onClick={incrementQuantity}
            >
              +
            </button>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
