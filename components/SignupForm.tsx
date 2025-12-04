"use client";

import { createAccount } from "@/appwrite/actions/user.actions";
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
import { ComponentProps, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

const signupSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z.email(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupForm = ({ className, ...props }: ComponentProps<"form">) => {
  const [isPending, startTransition] = useTransition();
  const [accountId, setAccountId] = useState<string | null>(null);

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    startTransition(async () => {
      const result = await createAccount({
        email: values.email,
        fullName: values.fullName,
      });
      if (result.error) {
        toast.error("Unable to create account", {
          description: result.error,
        });
      } else {
        toast.success(
          "Account created successfully! Please verify your email."
        );
        setAccountId(result.data!);
      }
    });
  };

  return (
    <>
      <Form {...signupForm}>
        <form
          onSubmit={signupForm.handleSubmit(onSubmit)}
          className={cn("flex flex-col gap-6", className)}
          {...props}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold font-playfair-display">
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm text-balance">
              Create a new account to get started
            </p>
          </div>
          <div className="grid gap-4">
            <FormField
              control={signupForm.control}
              name="fullName"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
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
              Register
            </Button>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              prefetch
              replace
              className="underline underline-offset-4"
            >
              Log in
            </Link>
          </div>
        </form>
      </Form>
      {accountId && (
        <VerificationDialog
          email={signupForm.getValues("email")}
          accountId={accountId}
        />
      )}
    </>
  );
};

export default SignupForm;
