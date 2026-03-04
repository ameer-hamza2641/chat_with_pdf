'use client'

import  {useForm}  from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {signUpSchema, signUpData, } from "@/lib/zod/schema";
import { signUpWithEmail } from "@/lib/actions/auth.actions";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

  const Page =() => {
    const router=useRouter()
  // 2. Initialize the Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur", // Validates when user leaves the input
  });
  const onSubmit=async(data:signUpData)=>{
    const res=await signUpWithEmail(data)
    if(res?.success ===false){
      toast.error(res?.message)
      return;
    }
    toast.success(res?.message)
    router.push('/Dashboard')
  }

  return(
    <div className="main flex justify-around items-center sm:flex-row flex-col bg-zinc-700 min-h-screen ">
      <div className="Branding sm:w-1/3 mx-1 border-r border-gray-400">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam quisquam quod, repellendus a totam modi quis enim dicta. Explicabo itaque saepe qui, voluptates aliquid ullam eveniet vitae consectetur placeat eum sed, minus amet.
      </div>
   <form action="" onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center flex-col gap-2 sm:w-1/3 w-2/3">
      <h1 className="text-blue-600 font-bold text-3xl mb-4 ">Create new Account</h1>
      <div className="w-full">
          <label className="block text-sm font-medium">Name</label>
          <input
            {...register("name")}
            className={`w-full p-2 border rounded text-white ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="you@example.com"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>}
        </div>
    <div className="w-full">
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register("email")}
            className={`w-full p-2 border rounded text-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password")}
            className={`w-full p-2 border rounded text-white ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="w-full">
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className={`w-full p-2 border rounded text-white ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
        >
          {isSubmitting ? "Submitting..." : "Sign Up" }
        </button>
                 <div> {"Already have an account?"}
        <Link href="/sign-in" className="text-blue-500 ml-2">
          Sign In
        </Link>
      </div>
   </form>
    </div>
  ) 
};

export default Page;
