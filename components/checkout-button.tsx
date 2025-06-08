"use client"

import { useContext } from "react"
import { CartContext } from "@/context/CartContext"
import { formatCurrency } from "@/utils/formatCurrency"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const CheckoutButton = () => {
  const { items, total, shipping } = useContext(CartContext)
  const { data: session } = useSession()
  const router = useRouter()

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login")
      return
    }

    // Save order data to localStorage before checkout
    const orderData = {
      id: `MMG-${Date.now()}`,
      date: new Date().toISOString(),
      status: "pending",
      total: total + shipping,
      items: items,
      shipping: shipping,
    }
    localStorage.setItem("lastOrder", JSON.stringify(orderData))

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, total, shipping }),
      })

      if (response.ok) {
        const { url } = await response.json()
        router.push(url)
      } else {
        console.error("Checkout failed")
      }
    } catch (error) {
      console.error("Error during checkout:", error)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Checkout - {formatCurrency(total + shipping)}
    </button>
  )
}

export default CheckoutButton
