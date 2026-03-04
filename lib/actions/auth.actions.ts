'use server'

import { headers } from "next/headers";
import { auth } from "../better-auth/auth";
import { signInData, signUpData } from "../zod/schema";



export const signUpWithEmail = async ({
  name,
  email,
  password,
}: signUpData) => {
  try {
    const response = await auth.api.signUpEmail({
      body: { name, email, password },
    });
    if (!response) {
      return { success: false, message: "User registration failled." };
    }
    return { success: true, message: "User registered successfully." };
  } catch (error) {
    console.log("Error occur while registering the user : ", error);
    return { success: false, message:error.message }
  }
};

export const signInWithEmail = async ({ email, password }: signInData) => {
  try {
    const response = await auth.api.signInEmail({ body: { email, password } });
    return { success: true, message: "User Sign In successfully." };
  } catch (error) {
    console.log("Error occur while registering the user : ", error);
     return { success: false, message: error.message };
  }
};

export const signOut = async () => {
  try {
    const response = await auth.api.signOut({ headers: await headers() });
    if (!response) {
      return { success: false, message: "User signOut operation failled." };
    }
    return { success: true, message: "User signOut successfully." };
  } catch (error) {
    console.log("Error occur while signout the user : ", error);
    return { success: false, message: error };
  }
};

export const getSession=async () => {
  try {
    const session = await auth.api.getSession({headers:await headers()})
    return session
  } catch (error) {
    console.log('Error occur while getting the session  : ',error);
    
  } 
}
