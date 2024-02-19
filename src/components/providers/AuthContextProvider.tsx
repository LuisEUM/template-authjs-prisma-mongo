"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export const NextAuthSessionProvider = ({
  children,
  session,
}: React.PropsWithChildren<{ session?: Session | null }>) => {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus
      refetchInterval={5 * 60}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
};
