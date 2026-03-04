// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/better-auth/auth"; // path to your better-auth instance
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);