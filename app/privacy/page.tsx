import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-10">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">Privacy Policy</h1>
            <p className="text-white/70">Last updated: April 1, 2025</p>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              At MuskMustGo, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit our website or make a purchase.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, make a
              purchase, sign up for our newsletter, or contact us. This information may include:
            </p>
            <ul>
              <li>Personal information (name, email address, shipping address, phone number)</li>
              <li>Payment information (credit card details, billing address)</li>
              <li>Account information (username, password)</li>
              <li>Order history and preferences</li>
              <li>Communications with us</li>
            </ul>

            <p>We also automatically collect certain information when you visit our website, including:</p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage information (pages visited, time spent on site, links clicked)</li>
              <li>Location information</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders, account, or inquiries</li>
              <li>Send you marketing communications (if you've opted in)</li>
              <li>Improve our website and products</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Sharing Your Information</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Service providers who help us operate our business (payment processors, shipping companies, etc.)</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners with your consent</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            <p>To exercise these rights, please contact us at privacy@muskmustgo.com.</p>

            <h2>Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information.
              However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot
              guarantee absolute security.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              policy on this page and updating the "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@muskmustgo.com.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
