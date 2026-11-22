# GearHive - Equipment Rental Platform

## Purpose
GearHive is a rental marketplace that connects equipment owners and customers. Owners list their equipment, customers search, book and pay securely online, and administrators approve listings and monitor the whole platform.

## Live links
- Live site: https://equipment-rental-client-lovat.vercel.app
- Server API: https://equipment-rental-server-murex.vercel.app
- Server repository: https://github.com/programminghero306-ops/equipment-rental-server

## Key features
- Email and password registration with password rules (uppercase, lowercase, minimum 6 characters) and Google login
- JWT-based authentication and role-based access control for Customer, Owner and Admin
- Home page with animated banner and search, featured equipment, categories, why choose us, how it works, customer reviews and FAQ
- All Equipment page with server-side search, category, rental type, price and availability filters, sorting and pagination
- Private equipment details page with owner information and rental terms
- Booking with date range, quantity, live price calculation and date-based availability checking
- Stripe Checkout payments, payment records and a payment success page
- Favorites list for customers
- Customer dashboard: My Rentals (pay later or cancel unpaid bookings), Favorites, Profile
- Owner dashboard: Add Equipment with image upload, My Equipment (update, delete, view), My Equipment Rental, analytics charts
- Admin dashboard: user and role management, equipment approve and reject, all rentals management, analytics charts
- Dark and light mode that is remembered, fully responsive layout, loading, error and 404 pages, Framer Motion animations

## Technologies
Next.js (App Router), TypeScript, Tailwind CSS, DaisyUI, BetterAuth with the MongoDB adapter, Express.js, MongoDB, Stripe

## npm packages (client)
- next, react, react-dom
- tailwindcss, @tailwindcss/postcss, daisyui
- better-auth
- mongodb
- framer-motion
- recharts
- react-hot-toast
- sweetalert2
- react-icons

## Environment variables
Create a file named .env.local with these names (see .env.example):
- NEXT_PUBLIC_API_URL
- MONGODB_URI
- BETTER_AUTH_SECRET
- BETTER_AUTH_URL
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- NEXT_PUBLIC_IMGBB_KEY

## Run locally
    npm install
    npm run dev

The app runs at http://localhost:3000 and needs the server project running too.

## Test payments
Payments run in Stripe test mode. Use the card number 4242 4242 4242 4242, any future expiry date, any 3-digit CVC and any postal code.
