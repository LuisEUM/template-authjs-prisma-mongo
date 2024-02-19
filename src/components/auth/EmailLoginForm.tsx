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
} from "@/src/components/ui/form";

import { Input } from "../ui/input";
import ErrorMessageBox from "../share/MessageErrorBox";
import SuccessMessageBox from "../share/MessageSuccessBox";

import LoadingButton from "../share/LoadingButton";
import { EmailSchema } from "@/src/lib/types/zod-schemas";
import { emailLogin } from "@/src/lib/actions/server-actions";

type Props = {};

const EmailLoginForm = (props: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: z.infer<typeof EmailSchema>) => {
    // reset states
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(() => {
      emailLogin(values).then((data) => {
        if (data?.error) setErrorMessage(data.error);
        if (data?.success) setSuccessMessage(data.success);
      });
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <ErrorMessageBox message={errorMessage} />
        <SuccessMessageBox message={successMessage} />
        <LoadingButton type="submit" className="w-full" isLoading={isPending}>
          Login With Email
        </LoadingButton>
      </form>
    </Form>
  );
};

export default EmailLoginForm;
