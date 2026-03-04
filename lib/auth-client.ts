import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});
export const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL:'/Dashboard'
  });
  console.log('data from social signin :' ,data);
  
};

export type Session = typeof authClient.$Infer.Session;
