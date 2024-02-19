import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import prisma from "@/lib/database";
import UserCell from "@/components/admin/UserCell";

type Props = {};

const UsersPage = async (props: Props) => {
  const users = await prisma.user.findMany();

  return (
    <div className="">
      {users.map((user) => (
        <UserCell key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UsersPage;
