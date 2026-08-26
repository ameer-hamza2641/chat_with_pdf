import { connectToDatabase } from "@/app/database/mongoose";
import { betterAuth } from "better-auth";
import {emailOTP} from 'better-auth/plugins'
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
  if (authInstance) return authInstance;
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection failed");
  authInstance = betterAuth({
    database: mongodbAdapter(db as any), 
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification:true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    plugins: [
        emailOTP({
            // This flag tells better-auth to use OTP codes for all verification
            async sendVerificationOTP({ email, otp, type }, ctx) {
                await resend.emails.send({
                    from: "Verify <auth@yourdomain.com>",
                    to: email,
                    subject: "Your Verification Code",
                    html: `Your code is: <b>${otp}</b>. It expires in 10 minutes.`,
                });
            },
        }),
        nextCookies()
    ],
    rateLimit: {
        enabled: true,
        window: 60, // 1 minute window
        max: 100,   // Global max requests
        customRules: {
            // Specifically limit the "Send/Resend OTP" endpoint
            "/email-otp/send-verification-otp": {
                window: 60, // 1 minute
                max: 3,     // Max 3 requests per minute per IP
            },
            // You can also limit the verification attempts to prevent brute force
            "/email-otp/verify-email": {
                window: 60,
                max: 5,
            }
        }
    }
  });
  return authInstance;
};

export const auth = await getAuth();
