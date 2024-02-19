"use client";

import React from "react";
import UserButton from "./UserButton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/src/lib/utils/utils";
import { buttonVariants } from "../ui/button";

type Props = {};

const AuthButtons = (props: Props) => {
  const { data: session, status } = useSession();

  return (
    <div className="hidden sm:flex gap-2">
      {session ? (
        <UserButton />
      ) : (
        <>
          <Link className={cn(buttonVariants())} href={"/auth/login"}>
            Sign in
          </Link>
          <Link className={cn(buttonVariants())} href={"/auth/register"}>
            Register
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
