import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AdminRoutesLayout = async ({ children }: Props) => {
  const session = await auth();
  console.log("UsersPage session", session);

  if (!session || session.user.role !== "ADMIN") {
    redirect(`/auth/login?error=unauthenticated`);
  }
  return <section className="pagewrapper">{children}</section>;
};

export default AdminRoutesLayout;
