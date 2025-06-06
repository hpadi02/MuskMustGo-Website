"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart-simplified"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const CustomizeProductPage = () => {
  const { id } = useParams()
  const router = useRouter()

  const [product, setProduct] = useState(null)
  const [customizations, setCustomizations] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { addItem } = useCart()

  useEffect(() => {
    // For now, we'll simulate a product since we don't have a real API endpoint
    const mockProduct = {
      id: id,
      name: "Custom Product",
      description: "A customizable product",
      price: 19.99,
      options: [
        {
          name: "Color",
          values: ["Red", "Blue", "Green", "Black"],
        },
        {
          name: "Size",
          values: ["Small", "Medium", "Large"],
        },
      ],
    }

    setProduct(mockProduct)

    // Initialize customizations based on product options
    const initialCustomizations = {}
    if (mockProduct.options) {
      mockProduct.options.forEach((option) => {
        initialCustomizations[option.name] = option.values[0] // Default to the first value
      })
    }
    setCustomizations(initialCustomizations)
    setLoading(false)
  }, [id])

  const handleCustomizationChange = (optionName, value) => {
    setCustomizations((prev) => ({ ...prev, [optionName]: value }))
  }

  const handleAddToCart = async () => {
    try {
      addItem({
        id: product.id,
        name: `${product.name} (Customized)`,
        price: product.price,
        image: "/placeholder.svg",
        quantity: 1,
        customOptions: customizations,
      })

      // Show success message
      alert("Product added to cart!")
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add product to cart.")
    }
  }

  if (loading) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <p>Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <p>Product not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <Link href="/shop/all" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Customize {product.name}</h1>
          <p className="text-white/70 mb-8">{product.description}</p>

          {product.options &&
            product.options.map((option) => (
              <div key={option.name} className="mb-6">
                <label className="block text-white/70 mb-2">{option.name}:</label>
                <select
                  value={customizations[option.name] || option.values[0]}
                  onChange={(e) => handleCustomizationChange(option.name, e.target.value)}
                  className="w-full bg-dark-300 border border-white/20 text-white px-4 py-2 rounded"
                >
                  {option.values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}

          <div className="mt-8">
            <p className="text-xl font-medium mb-4">Price: ${product.price}</p>
            <Button onClick={handleAddToCart} className="bg-red-600 hover:bg-red-700 text-white">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomizeProductPage
