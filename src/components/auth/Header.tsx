import { cn, merriweather } from "@/src/lib/utils/utils";
import React from "react";

type Props = {
  label: string;
};

const Header = ({ label }: Props) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-3xl font-semibold", merriweather.className)}>
        🔐 Auth
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default Header;
