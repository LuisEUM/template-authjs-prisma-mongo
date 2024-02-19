"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/src/lib/utils/utils";

type Props = {
  label: string;
  href: string;
};

const BackButton = ({ label, href }: Props) => {
  return (
    <Link
      className={cn(
        buttonVariants({ variant: "link", size: "sm" }),
        "font-normal w-full text-xs"
      )}
      href={href}
    >
      {label}
    </Link>
  );
};

export default BackButton;
