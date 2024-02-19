import LogoutButton from "@/components/share/LogoutButton";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h2>Home Page</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <LogoutButton />
    </main>
  );
}
