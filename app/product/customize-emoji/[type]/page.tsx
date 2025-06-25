import type { Metadata } from "next"
import Link from "next/link"

interface Props {
  params: {
    type: string
  }
}

export const metadata: Metadata = {
  title: "Customize Emoji",
  description: "Customize your emoji!",
}

const CustomizeEmojiPage = ({ params }: Props) => {
  const { type } = params

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customize {type} Emoji</h1>
      <p className="mb-4">Customize your {type} emoji here. This is a placeholder page.</p>

      <Link href="/product/tesla_vs_elon_emoji" className="text-blue-500 hover:underline">
        Back to product
      </Link>
    </div>
  )
}

export default CustomizeEmojiPage
