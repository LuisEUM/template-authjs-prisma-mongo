"use client";

import React from "react";
import { Button } from "../ui/button";
import { logout } from "@/lib/server-actions";

type Props = {};

const LogoutButton = (props: Props) => {
  return (
    <div>
      <Button onClick={async () => await logout()}>Sign out</Button>
    </div>
  );
};

export default LogoutButton;
