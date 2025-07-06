import { redirect } from "next/navigation"

interface Props {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: Props) {
  // Redirect customizable emoji product directly to customization page
  if (params.id === "tesla_vs_elon_emoji") {
    redirect("/product/customize-emoji/magnet")
  }

  return (
    <div>
      <h1>Product Page</h1>
      <p>Product ID: {params.id}</p>
    </div>
  )
}
