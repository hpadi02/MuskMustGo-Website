"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function EnvStatus() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const checkStripeStatus = async () => {
    setStatus("loading")
    try {
      const response = await fetch("/api/stripe-status")
      const data = await response.json()

      if (data.status === "success") {
        setStatus("success")
        setMessage(`Stripe API key is valid (${data.keyType})`)
      } else {
        setStatus("error")
        setMessage(data.message || "Unknown error")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to check Stripe status")
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {status === "idle" && (
        <Button onClick={checkStripeStatus} variant="outline" size="sm">
          Check Stripe Status
        </Button>
      )}

      {status === "loading" && (
        <div className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg">Checking Stripe status...</div>
      )}

      {status === "success" && (
        <div className="bg-green-900 text-white px-4 py-2 rounded-md shadow-lg flex items-center">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-900 text-white px-4 py-2 rounded-md shadow-lg flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {message}
        </div>
      )}
    </div>
  )
}
