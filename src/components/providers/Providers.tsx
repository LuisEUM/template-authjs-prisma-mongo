"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { ThemeContextProvider } from "./ThemeContextProvider";
import { NextAuthSessionProvider } from "./AuthContextProvider";
import { NextUIProvider } from "@nextui-org/react";

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContextProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextUIProvider>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </NextUIProvider>
    </ThemeContextProvider>
  );
};

export default Providers;
