"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../share/MessageErrorBox";
import FormSuccess from "../share/MessageSuccessBox";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CredentialSigninSchema } from "@/lib/zod-schemas";
import { credentialsLogin } from "@/lib/server-actions";
import LoadingButton from "../share/LoadingButton";

type Props = {};

const CredentialsLoginForm = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider."
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof CredentialSigninSchema>>({
    resolver: zodResolver(CredentialSigninSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleStartover = () => {
    form.reset();
    router.refresh();
  };

  const onSubmit = (values: z.infer<typeof CredentialSigninSchema>) => {
    console.log("onSubmit values", values, "isPending=", isPending);
    // reset states
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(() => {
      credentialsLogin(values, callbackUrl)
        .then((data) => {
          console.log("credentialsLogin data", data);

          if (data?.error) {
            if (data.error !== "Code mismatched!") {
              form.reset();
            }
            setErrorMessage(data.error);
          }
          if (data?.success) {
            form.reset();
            setSuccessMessage(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
            setSuccessMessage("Please check your email for Two Factor Code.");
          }
        })
        .catch((error) => {
          console.log("error", error);
          setErrorMessage("Something went wrong with login");
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-[400px]"
      >
        <div className="space-y-4">
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => {
                // console.log("Two Factor Code field", field);
                field.value = field.value ?? "";

                return (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="654321"
                        type="text"
                        disabled={isPending}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                    <p
                      onClick={() => handleStartover()}
                      className="cursor-pointer text-gray-500 text-sm"
                    >
                      The code expired? let&apos;s start over login
                    </p>
                  </FormItem>
                );
              }}
            />
          )}
          {!showTwoFactor && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="johs.doe@example.com"
                        type="email"
                        disabled={isPending}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="*********"
                        type="password"
                        disabled={isPending}
                        autoComplete="off"
                      />
                    </FormControl>
                    <Button
                      size={"sm"}
                      variant={"link"}
                      asChild
                      className="px-0 font-normal"
                    >
                      <Link href={"/auth/reset"} className="text-xs">
                        Forgot Password
                      </Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
        <FormError message={errorMessage || urlError} />
        <FormSuccess message={successMessage} />
        <LoadingButton
          type="submit"
          className="w-full relative"
          isLoading={isPending}
          onClick={() => console.log("clicked button: isPending=", isPending)}
        >
          {showTwoFactor ? "Confirm" : "Login With Credentials"}
        </LoadingButton>
      </form>
    </Form>
  );
};

export default CredentialsLoginForm;
