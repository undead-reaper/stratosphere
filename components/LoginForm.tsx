"use client";

import { loginWithEmail } from "@/appwrite/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import VerificationDialog from "@/components/VerificationDialog";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { AppwriteException } from "node-appwrite";
import { ComponentProps, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

const loginFormSchema = z.object({
  email: z
    .email()
    .nonempty("Email is required")
    .regex(/^\S+@\S+\.\S+$/, "Invalid email address"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginForm = ({ className, ...props }: ComponentProps<"form">) => {
  const [isPending, startTransition] = useTransition();
  const [accountId, setAccountId] = useState<string | null>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    startTransition(async () => {
      try {
        const user = await loginWithEmail({ email: values.email });
        setAccountId(user.accountId);
      } catch (error) {
        if (error instanceof AppwriteException) {
          toast.error("Unable to authenticate", {
            description: error.message,
          });
        } else {
          toast.error("Unable to authenticate", {
            description: "An unexpected error occurred.",
          });
        }
      }
    });
  };

  return (
    <>
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(onSubmit)}
          className={cn("flex flex-col gap-6", className)}
          {...props}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold font-playfair-display">
              Login to your account
            </h1>
            <p className="text-muted-foreground text-sm text-balance">
              Login to your account to access your files
            </p>
          </div>
          <div className="grid gap-4">
            <FormField
              control={loginForm.control}
              name="email"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit" className="w-full">
              Login
            </Button>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              replace
              prefetch
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </form>
      </Form>
      {accountId && (
        <VerificationDialog
          accountId={accountId}
          email={loginForm.getValues("email")}
        />
      )}
    </>
  );
};

export default LoginForm;
