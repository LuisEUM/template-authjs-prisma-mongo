import NewVerificationForm from "@/components/auth/NewVerificationForm";
import prisma from "@/src/lib/database";
import React from "react";

type Props = {
  searchParams: { token: string };
};

const NewVerificationPage = async ({ searchParams: { token } }: Props) => {
  // await new Promise((resolve, reject) => {
  //   setTimeout(resolve, 3000);
  // });

  const existingToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  let message: string = "";
  let success: boolean = false;

  if (!existingToken) {
    message = "Verification failed, try register again.";
  } else {
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      // remove expired token
      await prisma.verificationToken.delete({
        where: { id: existingToken.id },
      });

      message = "Token has expired!";
    } else {
      const existingUser = await prisma.user.findUnique({
        where: { email: existingToken.identifier },
      });
      if (!existingUser) {
        message = "Email does not exist!";
      } else {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            emailVerified: new Date(),
            email: existingToken.identifier, // for users change their email
          },
        });

        await prisma.verificationToken.delete({
          where: { id: existingToken.id },
        });

        message = "Email verified!";
        success = true;
      }
    }
  }

  return (
    <div className="pagewrapper shadow-2xl">
      <NewVerificationForm message={message} success={success} />
    </div>
  );
};

export default NewVerificationPage;
