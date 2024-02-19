"use client";

import { newPassword } from "@/src/lib/actions/server-actions";
import { NewPasswordSchema } from "@/src/lib/types/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import FormError from "../share/MessageErrorBox";
import FormSuccess from "../share/MessageSuccessBox";
import LoadingButton from "../share/LoadingButton";

type Props = {};

const NewPasswordForm = (props: Props) => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    // reset states
    setErrorMessage("");
    setSuccessMessage("");

    // console.log(values);
    startTransition(() => {
      newPassword(values, token).then((data) => {
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={errorMessage} />
        <FormSuccess message={successMessage} />
        <LoadingButton
          type="submit"
          className="w-full relative"
          isLoading={isPending}
        >
          Reset password
        </LoadingButton>
      </form>
    </Form>
  );
};

export default NewPasswordForm;
