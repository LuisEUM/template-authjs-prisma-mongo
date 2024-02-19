"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AvatarIcon, ExitIcon } from "@radix-ui/react-icons";
import { FaRegUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Settings, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/src/lib/server-actions";

type Props = {};

const UserButton = (props: Props) => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="">
        <Avatar>
          <AvatarImage src={session?.user?.image || ""} />
          <AvatarFallback className="bg-primary dark:bg-primary-foreground">
            {/* <AvatarIcon className="w-8 h-8 text-white" /> */}
            <FaRegUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        {session?.user.role === "ADMIN" && (
          <DropdownMenuItem onClick={() => router.push("/admin/users")}>
            <Users className="mr-2 h-4 w-4" />
            <span>Users</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={async () => {
            await logout();
          }}
        >
          <ExitIcon className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
