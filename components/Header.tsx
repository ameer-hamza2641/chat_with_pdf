"use client";

import { signOut } from "@/lib/actions/auth.actions";
import { authClient } from "@/lib/auth-client";
import {
  HomeIcon,
  List,
  LogInIcon,
  LogOutIcon,
  User,
  User2,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "./session -provider";
import { toast } from "sonner";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDropDown, setMobileDropDown] = useState(false);
  const [desktopDropDown, setDesktopDropDown] = useState(false);
  const session=useSession()

  const handleSignOut = async () => {
    const res = await signOut();
    if(res.success ===false){
    toast.error(res.message)
    }
    router.push("/");
    toast.success(res.message)
  };
  return (
    <div className="bg-zinc-950 text-white p-4 flex justify-between items-center">
      <Link href={"/"} className="flex items-center gap-2">
        <HomeIcon size={20} />
        <h1 className="text-lg sm:text-xl  text-blue-600 font-bold">
          Chat with PDF
        </h1>
      </Link>

      {/*--------------------------------------------------------- */}
      {/*---------------------------Desktop Navigation---------------------------- */}
      {/*--------------------------------------------------------- */}
      <div className="sm:flex hidden justify-end w-1/2 relative">
        {session ? (
          <div className="flex justify-end  items-center w-full ">
            <div className="signOut flex justify-between items-center gap-2 bg-blue-600 hover:bg-zinc-500 transition-colors px-3 mx-7 py-1.5 rounded mr-5">
              <button onClick={handleSignOut}>SignOut</button>
              <LogOutIcon className="ml-1" size={16} />
            </div>
            <div className="user_profile hover:bg-zinc-600 px-1.5 py-1.5 rounded-full">
              <User
                size={30}
                className="text-blue-600"
                onClick={() => setDesktopDropDown(!desktopDropDown)}
              />
              {desktopDropDown && (
                <div className="absolute top-10 right-0 text-sm bg-zinc-700 p-2 rounded">
                  <p>Name : {session?.user?.name}</p>
                  <p>Email : {session?.user?.email}</p>
                  <p>User ID : {session?.user?.id}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex">
            {pathname !== "/sign-in" && (
              <Link
                href={"/sign-in"}
                className="signIn flex justify-between items-center gap-2 bg-blue-600 hover:bg-zinc-500 font-semibold px-3 py-1 rounded mr-2 transition-colors"
              >
                <button className="">Sign In</button>
                <LogInIcon className="ml-1" size={16} />
              </Link>
            )}
            {pathname !== "/sign-up" && (
              <Link
                href={"/sign-up"}
                className="signUp flex justify-between items-center gap-2 bg-zinc-500 hover:bg-blue-600 font-semibold px-3 py-1 rounded transition-colors"
              >
                <button className="">Sign Up</button>
                <UserPlus className="ml-1" size={16} />
              </Link>
            )}
          </div>
        )}
      </div>

      {/*--------------------------------------------------------- */}
      {/*---------------------------mobile Navigation---------------------------- */}
      {/*--------------------------------------------------------- */}
      <div className="sm:hidden flex relative">
        {session ? (
          <div className="">
            <List
              size={30}
              className="cursor-pointer"
              onClick={() => setMobileDropDown(!mobileDropDown)}
            />
            {mobileDropDown && (
              <div className="absolute top-10 right-0 bg-zinc-700 p-2 rounded text-gray-300">
                <p className="flex items-center gap-2 border-b border-gray-400">
                  <User2 size={20} color="blue" /> Name : {session?.user?.name}
                </p>
                <p className="flex items-center gap-2 border-b border-gray-400 flex-wrap">
                  Email : {session?.user?.email}
                </p>
                <p className="border-b border-gray-400">
                  User ID : {session?.user.id}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex">
            <List
              size={30}
              className="cursor-pointer"
              onClick={() => setMobileDropDown(!mobileDropDown)}
            />
            {mobileDropDown && (
              <div className="absolute  w-50   top-10 right-0 bg-zinc-500 p-3 rounded text-gray-200">
                <Link
                  href={"/sign-up"}
                  className="signUp border-b border-gray-200 p-2 m-2 pb-3 cursor-pointer  flex justify-between items-center gap-3"
                >
                  <div className="">
                    <UserPlus size={20} />
                  </div>
                  <div className="">Sign Up</div>
                </Link>
                <Link
                  href={"/sign-in"}
                  className="signIn cursor-pointer flex justify-between items-center border-b border-gray-500 p-2 m-2"
                >
                  <LogInIcon size={20} />
                  <p>Sign In</p>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
