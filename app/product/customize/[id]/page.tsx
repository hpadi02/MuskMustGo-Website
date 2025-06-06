"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart-simplified"

const CustomizeProductPage = () => {
  const { id } = useParams()
  const router = useRouter()

  const [product, setProduct] = useState(null)
  const [customizations, setCustomizations] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProduct(data)
        // Initialize customizations based on product options
        const initialCustomizations = {}
        if (data.options) {
          data.options.forEach((option) => {
            initialCustomizations[option.name] = option.values[0] // Default to the first value
          })
        }
        setCustomizations(initialCustomizations)
        setLoading(false)
      } catch (e) {
        setError(e.message)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleCustomizationChange = (optionName, value) => {
    setCustomizations((prev) => ({ ...prev, [optionName]: value }))
  }

  const handleAddToCart = async () => {
    try {
      // Assuming product has a price and type. Adjust as needed.
      const productId = product.id
      const type = product.name // Or derive type from customizations
      const price = product.price

      addItem({
        id: productId,
        name: `Custom Product - ${type}`,
        price: price,
        image: "/placeholder.svg",
        quantity: 1,
      })

      // Optionally, show a success message or update the cart state
      alert("Product added to cart!")
      // Remove router.push('/cart') to prevent automatic navigation
      // router.push('/cart');
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add product to cart.")
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (!product) {
    return <p>Product not found</p>
  }

  return (
    <div>
      <h1>Customize {product.name}</h1>
      <p>{product.description}</p>

      {product.options &&
        product.options.map((option) => (
          <div key={option.name}>
            <label>{option.name}:</label>
            <select
              value={customizations[option.name] || option.values[0]}
              onChange={(e) => handleCustomizationChange(option.name, e.target.value)}
            >
              {option.values.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}

      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  )
}

export default CustomizeProductPage
