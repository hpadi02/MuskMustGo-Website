const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">&copy; 2024 My Company. All rights reserved.</p>
        {/* Social media section - hidden for now */}
        {/* <div className="flex space-x-4">
          <Link href="#" className="text-gray-400 hover:text-gray-300">
            <Facebook className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-gray-300">
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-gray-300">
            <Instagram className="h-5 w-5" />
          </Link>
        </div> */}
      </div>
    </footer>
  )
}

export default Footer
