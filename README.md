# IAupscaler

This repository contains a frontend built with Next.js and an optional Express backend for image upscaling. The code is organized as follows. The app now stores the last three processed images per user so they can be downloaded later:

```
frontend/  - Next.js application with API routes and React components
backend/   - Optional Express server used for testing
vercel.json - Example Vercel configuration for deploying the frontend
```

## Environment Variables

Both the frontend and backend rely on several environment variables. Create a `.env` file (or configure variables in your hosting platform) with the following keys:

- `REPLICATE_API_TOKEN` – API key for the Replicate image upscaling API.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – public key used by Stripe on the client side.
- `STRIPE_SECRET_KEY` – Stripe secret key for server requests.
- `STRIPE_WEBHOOK_SECRET` – webhook secret for verifying Stripe events.
- `FIREBASE_SERVICE_ACCOUNT_KEY` – JSON credentials used by Firebase Admin.
- `CLOUDINARY_CLOUD_NAME` – Cloudinary account name.
- `CLOUDINARY_API_KEY` – Cloudinary API key.
- `CLOUDINARY_API_SECRET` – Cloudinary API secret.
- `CLOUDINARY_UPLOAD_PRESET` – upload preset used when uploading images.
- `NEXT_PUBLIC_FIREBASE_API_KEY` – Firebase client API key.
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` – Firebase authentication domain.
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` – Firebase project ID.
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` – Firebase storage bucket.
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` – Firebase Cloud Messaging sender ID.
- `NEXT_PUBLIC_FIREBASE_APP_ID` – Firebase app ID.
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` – Firebase analytics measurement ID.
- `NEXT_PUBLIC_ADMIN_USER` – admin login email.
- `NEXT_PUBLIC_ADMIN_PASS` – admin login password.
- `PORT` – (optional) port for the Express server when running the backend.

## Running Locally

1. Install dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   This starts the Next.js app on `http://localhost:3000`.

2. *(Optional)* Run the Express backend if you want to test it separately:
   ```bash
   cd backend
   npm install
   npm start
   ```
   The backend listens on the port specified by `PORT` (default `3001`).

## Deploying to Railway

1. [Create a Railway account](https://railway.app/) and new project.
2. Connect the project to this repository.
3. In **Settings → Variables**, add all environment variables listed above.
4. Set the service root to `frontend` and specify the build and start commands:
   - Build command: `npm run build`
   - Start command: `npm start` (which runs `next start`)
5. If you also wish to deploy the Express backend, add another service with root `backend` using `npm start`.

Railway will automatically install dependencies and deploy the application.

## History Feature

When an image is processed, the result is uploaded to Cloudinary and the URL is saved in a `history` subcollection under the user's Firestore document. Only the three most recent images are kept. You can retrieve them via the `/api/history` endpoint. A new **Images History** button on the profile page opens a dedicated view where these images can be downloaded.

