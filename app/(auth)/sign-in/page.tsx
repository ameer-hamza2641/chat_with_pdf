"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, signInData } from "@/lib/zod/schema";
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { socialProviders } from "better-auth";
import { signIn } from "@/lib/auth-client";

const Page = () => {
  const router = useRouter()
  // 2. Initialize the Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onChange", // Validates when user leaves the input
  });
  const onSubmit = async (data: signInData) => {
    const res = await signInWithEmail(data);
   if(res?.success === false){
      router.push(`/`)
      toast.error(res?.message)
    }
    toast.success(res?.message)
    router.push('/Dashboard')
  };

  return (
    <div className="main flex justify-around items-center sm:flex-row flex-col bg-zinc-700 min-h-screen ">
      <div className="Branding sm:w-1/3 mx-1 border-r border-gray-400">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam
        quisquam quod, repellendus a totam modi quis enim dicta. Explicabo
        itaque saepe qui, voluptates aliquid ullam eveniet vitae consectetur
        placeat eum sed, minus amet.
      </div>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center items-center flex-col border-2 border-gray-500 rounded-xl px-3 py-10 gap-2 sm:w-1/3 w-3/4"
      >
        <h1 className="text-blue-600 font-bold text-3xl mb-4 ">Welcome Back</h1>
        <div className="w-full">
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register("email")}
            className={`w-full p-2 border rounded text-white ${errors.email ? "border-red-500" : "border-gray-300"}`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password")}
            className={`w-full p-2 border rounded text-white ${errors.password ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
        >
          {isSubmitting ? "Sign In..." : "Sign In"}
        </button>
                 <div> {"Don't have an account?"}
        <Link href="/sign-up" className="text-blue-500 ml-2">
          Create One
        </Link>
      </div>
      <h1>-----OR-----</h1>
      <button
          type="button"
          disabled={isSubmitting}
          onClick={signIn}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
        >
          Continou with Google
        </button>
      </form>

    </div>
  );
};

export default Page;
