# MuskMustGo Website Redesign

This is the redesigned MuskMustGo website, featuring a modern frontend and dynamic integration with a backend API. The redesign focuses on improved user experience, updated visuals, and seamless product ordering.

## About the Redesign

- **Modern UI/UX:** The site has been rebuilt with a fresh look and responsive design.
- **Dynamic Functionality:** The frontend now communicates with a backend API for user registration, login, product browsing, and order placement.
- **API Integration:** All customer and order data is handled via the backend service, not static files.

## Deployment

The site is deployed using Vercel for production, but can also be run as a dynamic service on your own server.

## How to Run Locally or on a Server

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/MuskMustGo-Website.git
   cd MuskMustGo-Website
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   pnpm install
   ```

3. **Configure environment:**
   - If needed, set up environment variables (e.g., API endpoint URLs) in a `.env` file. See `.env.example` 

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   pnpm dev
   ```
   The app will be available at `http://localhost:3000` by default.

5. **Build and start for production:**
   ```sh
   npm run build
   npm start
   # or
   pnpm build
   pnpm start
   ```

## Backend API

- The frontend expects a backend API 
- Make sure the backend is running and accessible to the frontend (update API URLs as needed).
- Registration, login, product listing, and order creation all require the backend service.

---

