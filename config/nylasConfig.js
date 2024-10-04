import { BACKEND_URL } from "../constants/constants.js";

const config = {
    clientId: process.env.NYLAS_CLIENT_ID || '37fc0b51-db2f-4f3a-8a15-275ecf81d0a1',
    apiKey: process.env.NYLAS_API_KEY || 'nyk_v0_DtAzeSyzMJLXgTInwUsw5fz4mzTqfQRW4uUDzzmWuWm6QRmagaK4o5W2P4PWZ3RZ',
    apiUri: process.env.NYLAS_API_URI ||  'https://api.us.nylas.com',
    callbackUri: process.env.CALLBACK_URL || `${BACKEND_URL}/auth/oauth/exchange`
  }



  export default config;