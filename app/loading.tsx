export default function Loading() {
  return (
    <div className="bg-dark-400 text-white min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-8"></div>
        <h2 className="text-2xl font-medium">Loading...</h2>
      </div>
    </div>
  )
}
