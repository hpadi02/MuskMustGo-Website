"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart-simplified"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart()
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useState(false)

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const subtotal = calculateSubtotal()
  const shippingCost = subtotal > 0 ? 10 : 0 // Example: Free shipping over a certain amount
  const total = subtotal + shippingCost

  const handleRemoveFromCart = (itemId: string) => {
    removeFromCart(itemId)
    toast({
      title: "Item removed from cart.",
    })
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Cart cleared.",
    })
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity)
    } else {
      // Optionally remove the item if quantity is set to 0
      removeFromCart(itemId)
      toast({
        title: "Item removed from cart.",
      })
    }
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link href="/" className="text-blue-500 hover:underline">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center border rounded p-4 mb-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-24 h-24 object-cover rounded mr-4"
              />
              <div>
                <Link href={`/product/${item.id}`} className="text-blue-500 hover:underline">
                  {item.name}
                </Link>
                <p className="text-gray-600">{item.description}</p>
                <p className="font-bold">{formatCurrency(item.price)}</p>
                <div className="flex items-center mt-2">
                  <label htmlFor={`quantity-${item.id}`} className="mr-2">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    id={`quantity-${item.id}`}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                    className="w-20 border rounded px-2 py-1 text-center"
                    min="1"
                  />
                  <button onClick={() => handleRemoveFromCart(item.id)} className="ml-4 text-red-500 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:w-1/4">
          <div className="border rounded p-4">
            <h2 className="text-lg font-bold mb-2">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
            <div className="flex justify-between font-bold mb-2">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full">
              <Link href="/checkout" className="block w-full text-center">
                Proceed to Checkout
              </Link>
            </button>
            <button onClick={handleClearCart} className="mt-2 text-red-500 hover:underline w-full block text-center">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
