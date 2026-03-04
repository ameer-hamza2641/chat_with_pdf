

import * as z from "zod";

 export const signUpSchema = z
  .object({
    name:z.string('name is required').min(3,'name atleast contain 3 characters.'),
    email: z.email("email is required "),
    password: z.string().min(8, "Password must be atleast of 8 characters"),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Logic for Sign Up: Check if passwords match
      if (data.confirmPassword && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );

  export type signUpData=z.infer<typeof signUpSchema>

  export const signInSchema = z
  .object({
    email: z.email("email is required "),
    password: z.string().min(8, "Password mus be atleast of 8 characters"),
  })

 export type signInData=z.infer<typeof signInSchema>