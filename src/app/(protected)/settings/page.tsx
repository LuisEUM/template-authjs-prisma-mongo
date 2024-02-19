import { auth, signOut } from "@/src/lib/actions/auth/auth";
import prisma from "@/prisma/database";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import SettingsForm from "@/src/components/protected/SettingsForm";
import { SettingsUser } from "@/src/next-auth";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";

type Props = {};

const SettingsPage = async (props: Props) => {
  const session = await auth();
  console.log("session", session);

  if (!session) {
    redirect("/auth/login?error=unauthenticated");
  }

  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });

  if (!user) {
    await signOut();
  }

  const clientUser: SettingsUser = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    emailVerified: !!user?.emailVerified,
    image: user?.image ?? "",
    password: "",
    role: user?.role ?? "USER",
    isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
    isOAuth: session?.user.isOAuth || false,
  };

  return (
    <section className="pagewrapper mt-8">
      <Card className="w-[600px]">
        <CardHeader>
          <div className="flex justify-center items-center gap-4">
            <Settings className="w-8 h-8 " />
            <span className="text-2xl font-semibold text-center">Settings</span>
          </div>
        </CardHeader>
        <CardContent className="">
          <SettingsForm user={clientUser} />
        </CardContent>
      </Card>
    </section>
  );
};

export default SettingsPage;
