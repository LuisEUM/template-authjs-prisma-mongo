import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";

import GoogleProvider from "next-auth/providers/google";
import authConfig from "./auth.config";
import prisma from "./database";

import { CredentialSigninSchema } from "./zod-schemas";
import { html, text } from "./utils";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "UserEmail", type: "email", placeholder: "your email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = CredentialSigninSchema.safeParse(credentials);
        console.log("validatedFields", validatedFields);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({ where: { email } });

          if (!user || !user.password) {
            return null; // means authentication failed.
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            return user;
          }
        }
        return null;
      },
    }),
    EmailProvider({
      id: "email",
      name: "email",
      server: {
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GOOGLE_USER_EMAIL,
          pass: process.env.GOOGLE_USER_APP_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({
        //THIS IS FOR EMAIL CUSTOMIZATION
        identifier: email,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url);
        const transport = nodemailer.createTransport(server);
        await transport.sendMail({
          to: email,
          from,
          subject: `Login to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, email, label: "Sign in" }),
        });
      },
    }),
    GitHubProvider,
    GoogleProvider,
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  events: {
    async linkAccount({ user }) {
      // Sent when an account in a given provider is linked to a user in our user database.
      console.log("linkAccount event called");
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }, // this can't be boolean for furture check.
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("callback signIn", { user, account });

      // todo: add a check if the provider is one of my settings in authConfig.

      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      // Prevent sign in without email verification
      if (user.id) {
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        if (!existingUser || !existingUser.emailVerified) {
          return false;
        }

        if (existingUser.isTwoFactorEnabled) {
          const twoFactorConfirmation =
            await prisma.twoFactorConfirmation.findUnique({
              where: { userId: existingUser.id },
            });

          console.log("twoFactorConfirmation", twoFactorConfirmation);

          if (!twoFactorConfirmation) {
            return false;
          }

          // Delete two factor confirmation for next sign in. in order words, every signin must be 2FA
          await prisma.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      console.log("callback jwt:", { token, user }); // token.sub is the user.id

      if (!token.sub) return token;

      const existingUser = await prisma.user.findFirst({
        where: { id: token.sub },
      });
      if (!existingUser) return token;

      const existingAccount = await prisma.account.findFirst({
        where: { userId: existingUser.id },
      });

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },

    //@ts-expect-error
    async session({ session, token }) {
      console.log("callback session: ", { session, token });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth;
      }

      return session;
    },
  },
});
