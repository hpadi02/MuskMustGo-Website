import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Terms of Service</h1>
            <p className="text-white/70">Last updated: April 1, 2025</p>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              Welcome to MuskMustGo. By accessing our website and making purchases, you agree to these Terms of Service.
              Please read them carefully.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws
              and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing
              this site.
            </p>

            <h2>2. Products and Pricing</h2>
            <p>
              All product descriptions and pricing are subject to change without notice. We reserve the right to
              discontinue any product at any time. We do not warrant that product descriptions or other content on the
              site is accurate, complete, reliable, current, or error-free.
            </p>

            <h2>3. Orders and Payments</h2>
            <p>
              When you place an order, you offer to purchase the product at the price and terms indicated. We reserve
              the right to accept or decline your order for any reason. Once we accept your order, we will send you an
              order confirmation email.
            </p>
            <p>
              Payment must be made at the time of order. We accept major credit cards and other payment methods as
              indicated on our website. All payments are processed securely through our payment processors.
            </p>

            <h2>4. Shipping and Delivery</h2>
            <p>
              Shipping times and costs are as indicated during the checkout process. We are not responsible for delays
              due to customs, weather, or other factors beyond our control. Risk of loss and title for items purchased
              pass to you upon delivery of the items to the carrier.
            </p>

            <h2>5. Returns and Refunds</h2>
            <p>
              Our return and refund policy is as described in our Shipping & Returns page. By making a purchase, you
              agree to these terms.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software, is the property of
              MuskMustGo or its content suppliers and is protected by copyright and other intellectual property laws.
              You may not reproduce, distribute, display, or create derivative works from any content without our
              express written permission.
            </p>

            <h2>7. User Accounts</h2>
            <p>
              When you create an account, you are responsible for maintaining the confidentiality of your account
              information and for all activities that occur under your account. You agree to notify us immediately of
              any unauthorized use of your account.
            </p>

            <h2>8. User Content</h2>
            <p>
              If you submit content to our site (such as reviews or forum posts), you grant us a non-exclusive,
              royalty-free, perpetual, irrevocable right to use, reproduce, modify, adapt, publish, translate, create
              derivative works from, distribute, and display such content throughout the world in any media.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              MuskMustGo shall not be liable for any direct, indirect, incidental, special, consequential, or punitive
              damages resulting from your use of or inability to use the website or products purchased through the
              website.
            </p>

            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless MuskMustGo, its officers, directors, employees, agents,
              and suppliers from any claims, losses, liability, expenses, or damages, including attorney's fees, arising
              from your use of the website or violation of these Terms of Service.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of the State of
              California, without regard to its conflict of law provisions.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately
              upon posting on the website. Your continued use of the website after any changes constitutes your
              acceptance of the new Terms.
            </p>

            <h2>13. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us at legal@muskmustgo.com.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
