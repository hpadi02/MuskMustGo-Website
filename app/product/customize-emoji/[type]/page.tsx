"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface Props {
  params: {
    type: string
  }
}

const CustomizeEmojiPage = ({ params }: Props) => {
  const router = useRouter()
  const { type } = params

  return (
    <div className="container mx-auto p-4">
      <Button onClick={() => router.back()} variant="ghost">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-4">Customize {type} Emoji</h1>
      <p className="mb-4">Customize your {type} emoji here. This is a placeholder page.</p>

      <Button variant="link" onClick={() => router.push("/product/tesla_vs_elon_emoji")}>
        Back to product
      </Button>
    </div>
  )
}

export default CustomizeEmojiPage
