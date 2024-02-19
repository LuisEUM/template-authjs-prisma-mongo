"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { auth, signIn, signOut, unstable_update as update } from "./auth/auth";
import {
  CredentialSigninSchema,
  EmailSchema,
  NewPasswordSchema,
  RegisterSchema,
  ResetSchema,
  SettingsSchema,
} from "../types/zod-schemas";
import prisma from "../../../prisma/database";
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "./auth/tokens";
import {
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from "./mailer/mailer";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes/routes";

export const logout = async () => {
  await signOut();
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, name, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // send verification token email
  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(
    verificationToken.identifier,
    verificationToken.token
  );

  return { success: "Confirmation email sent!" };
};

export const emailLogin = async (
  values: z.infer<typeof EmailSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = EmailSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email } = validatedFields.data;
  console.log("email", email);

  try {
    await signIn("email", {
      email,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.log(error);
      switch (error.type) {
        case "EmailSignInError":
          return { error: `Email SignIn Error: ${error.message}` };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error; // if not throw error, next-auth doesn't redirect
  }

  return { success: "Email sent!" };
};

export const credentialsLogin = async (
  values: z.infer<typeof CredentialSigninSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = CredentialSigninSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "User with this email doesn't exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    // send email with verificationToken
    await sendVerificationEmail(email, verificationToken.token);

    return { success: "Confirmation Email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await prisma.twoFactorToken.findFirst({
        where: { email: existingUser.email },
      });

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Code mismatched!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        // delete expired token
        await prisma.twoFactorToken.delete({
          where: { id: twoFactorToken.id },
        });

        return { error: "Code expired!" };
      }

      // when 2FA is valid, still remove twoFactorToken
      await prisma.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

      const existingConfirmation =
        await prisma.twoFactorConfirmation.findUnique({
          where: { userId: existingUser.id },
        });

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      const result = await sendTwoFactorTokenEmail(
        existingUser.email,
        twoFactorToken.token
      );
      console.log("credentialsLogin result ", result);
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error; // if not throw error, next-auth doesn't redirect
  }

  return { success: "Email sent!" };
};

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return { error: "Unauthorized!" };
  }

  if (user.id) {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return { error: "Unauthorized!" };

    // const account = await prisma.account.findFirst({
    //   where: { userId: dbUser.id },
    // });

    if (user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: values.email },
      });
      if (existingUser && existingUser.id !== user.id) {
        return { error: "Email already in use " };
      }

      const verifiationToken = await generateVerificationToken(values.email);
      await sendVerificationEmail(
        verifiationToken.identifier,
        verifiationToken.token
      );

      return { success: "verification email sent! " };
    }

    if (values.password && values.newPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(
        values.password,
        dbUser.password
      );

      if (!passwordsMatch) {
        return { error: "Incorrect password." };
      }

      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      values.password = hashedPassword;
      values.newPassword = undefined;
    }

    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
      },
    });

    update({
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      },
    });

    return { success: "Settings updated!" };
  }
};

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) {
    return { error: "Email not found." };
  }

  // generate token & send email
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent!" };
};

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid password!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    // remove expired token
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return { error: "Token has expired!" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated!" };
};
