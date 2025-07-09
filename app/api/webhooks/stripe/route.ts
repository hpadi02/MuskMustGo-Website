import type Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import { prismadb } from "@/lib/prismadb"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: session?.customer_details?.address,
        name: session?.customer_details?.name,
        phone: session?.customer_details?.phone,
      },
    })

    const orderItems = await prismadb.orderItem.findMany({
      where: {
        orderId: session?.metadata?.orderId,
      },
    })

    for (const item of orderItems) {
      const product = await prismadb.product.update({
        where: {
          id: item.productId,
        },
        data: {
          isArchived: true,
        },
      })

      const attributes: { name: string; value: string }[] = []

      const customOptions = JSON.parse(item.customOptions || "{}")

      if (item.customOptions?.size) {
        attributes.push({
          name: "size",
          value: item.customOptions.size,
        })
      }

      if (item.customOptions?.color) {
        attributes.push({
          name: "color",
          value: item.customOptions.color,
        })
      }

      if (item.customOptions?.material) {
        attributes.push({
          name: "material",
          value: item.customOptions.material,
        })
      }

      if (item.customOptions?.finish) {
        attributes.push({
          name: "finish",
          value: item.customOptions.finish,
        })
      }

      if (item.customOptions?.teslaEmoji) {
        // Extract filename with number prefix from path
        const emojiValue = item.customOptions.teslaEmoji.path
          ? item.customOptions.teslaEmoji.path.split("/").pop()?.replace(".png", "")
          : item.customOptions.teslaEmoji.name

        attributes.push({
          name: "emoji_good",
          value: emojiValue, // Now "02_smile_sly" instead of "smile_sly"
        })
      }

      if (item.customOptions?.elonEmoji) {
        // Extract filename with number prefix from path
        const emojiValue = item.customOptions.elonEmoji.path
          ? item.customOptions.elonEmoji.path.split("/").pop()?.replace(".png", "")
          : item.customOptions.elonEmoji.name

        attributes.push({
          name: "emoji_bad",
          value: emojiValue, // Now "06_maga_shit" instead of "maga_shit"
        })
      }

      await prismadb.productAttribute.create({
        data: {
          name: `Order ${order.id} - Product ${product.id}`,
          value: JSON.stringify(attributes),
          productId: product.id,
          orderId: order.id,
        },
      })
    }
  }

  return new NextResponse(null, { status: 200 })
}
