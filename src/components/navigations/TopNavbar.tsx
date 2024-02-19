import Link from "next/link";
import React from "react";
import { GiFullPizza } from "react-icons/gi";
import { ModeToggleButton } from "./ModeToggleButton";
import AuthButtons from "./AuthButtons";
type Props = {};

const TopNavbar = (props: Props) => {
  return (
    <header className="flex justify-between items-center p-2">
      <div className="w-24">
        <Link href="/" className={"text-primary font-semibold text-2xl"}>
          <div className="rounded-full animate-run">
            <GiFullPizza className="dark:text-primary-foreground w-8 h-8 animate-spin direction-reverse" />
          </div>
        </Link>
      </div>
      <div className="flex justify-center items-center gap-2">
        <AuthButtons />
        <ModeToggleButton />
      </div>
    </header>
  );
};

export default TopNavbar;
