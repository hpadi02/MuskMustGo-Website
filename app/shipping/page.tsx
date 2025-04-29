import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 uppercase tracking-wider text-sm font-medium mb-3">POLICIES</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Shipping & Returns</h1>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <h2>Shipping Policy</h2>

            <h3>Processing Time</h3>
            <p>
              All orders are processed within 1-3 business days. Orders placed on weekends or holidays will be processed
              on the next business day.
            </p>

            <h3>Shipping Methods & Timeframes</h3>
            <p>We offer the following shipping options:</p>
            <ul>
              <li>
                <strong>Standard Shipping:</strong> 3-5 business days ($5.00)
              </li>
              <li>
                <strong>Express Shipping:</strong> 1-2 business days ($15.00)
              </li>
            </ul>
            <p>Free standard shipping is available on all orders over $50.</p>

            <h3>International Shipping</h3>
            <p>
              We ship to most countries worldwide. International shipping rates and delivery times vary by location and
              will be calculated at checkout. Please note that international orders may be subject to import duties and
              taxes, which are the responsibility of the recipient.
            </p>

            <h3>Tracking Information</h3>
            <p>
              Once your order ships, you will receive a confirmation email with tracking information. You can also log
              into your account to view the status of your order.
            </p>

            <h2>Return Policy</h2>

            <h3>Return Eligibility</h3>
            <p>
              We accept returns within 30 days of delivery for unused items in their original packaging. To be eligible
              for a return, your item must be in the same condition that you received it, unworn or unused, with tags,
              and in its original packaging.
            </p>

            <h3>Return Process</h3>
            <p>
              To initiate a return, please email us at returns@muskmustgo.com with your order number and the reason for
              your return. We will provide you with return instructions and a return shipping label if applicable.
            </p>

            <h3>Refunds</h3>
            <p>
              Once we receive and inspect your return, we will notify you of the status of your refund. If approved,
              your refund will be processed, and a credit will automatically be applied to your original method of
              payment within 5-7 business days.
            </p>

            <h3>Return Shipping</h3>
            <p>
              You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are
              non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
            </p>

            <h2>Exchanges</h2>
            <p>
              If you need to exchange an item for a different size or color, please initiate a return and place a new
              order for the desired item. This ensures the fastest processing time.
            </p>

            <h2>Damaged or Defective Items</h2>
            <p>
              If you receive a damaged or defective item, please contact us immediately at support@muskmustgo.com with
              photos of the damage. We will work with you to resolve the issue promptly.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about our shipping or return policies, please contact us at
              support@muskmustgo.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
