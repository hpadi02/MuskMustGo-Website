import { getStripeProducts } from "@/lib/stripe-products"
import { groupProducts } from "@/lib/product-data"

export default async function DebugProductsPage() {
  const products = await getStripeProducts()
  const groupedProducts = groupProducts(products)

  return (
    <div className="bg-dark-400 text-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Debug: Products from Stripe</h1>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Raw Products from Stripe ({products.length})</h2>
          <div className="bg-dark-300 p-4 rounded-lg overflow-auto">
            <pre className="text-sm text-green-400">{JSON.stringify(products, null, 2)}</pre>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Grouped Products ({groupedProducts.length})</h2>
          <div className="bg-dark-300 p-4 rounded-lg overflow-auto">
            <pre className="text-sm text-blue-400">{JSON.stringify(groupedProducts, null, 2)}</pre>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Product Names Analysis</h2>
          <div className="space-y-2">
            {products.map((product, index) => (
              <div key={index} className="bg-dark-300 p-3 rounded">
                <p>
                  <strong>Product Name:</strong> {product.product_name}
                </p>
                <p>
                  <strong>Base Name:</strong> {product.baseName}
                </p>
                <p>
                  <strong>Medium:</strong> {product.medium_name}
                </p>
                <p>
                  <strong>Price:</strong> ${product.price}
                </p>
                <p>
                  <strong>Stripe ID:</strong> {product.stripeId}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
