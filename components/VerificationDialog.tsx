"use client";

import { sendEmailOTP, verifyEmailOTP } from "@/appwrite/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

type VerificationDialogProps = {
  email: string;
  accountId: string;
};

const verificationSchema = z.object({
  otp: z.string().min(6, "OTP must be at least 6 characters long"),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

const VerificationDialog = ({ email, accountId }: VerificationDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const route = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (values: VerificationFormValues) => {
    startTransition(async () => {
      const result = await verifyEmailOTP({ accountId, secret: values.otp });
      console.log("OTP Verification Result:", result);
      if (result.error) {
        toast.error("Failed to Verify OTP", {
          description: result.error,
        });
      } else {
        toast.success("OTP Verified Successfully", {
          description: "Redirecting to dashboard shortly.",
        });
        route.replace("/");
      }
    });
  };

  const handleResendOTP = () => {
    startTransition(async () => {
      const result = await sendEmailOTP({ email });
      if (result.error) {
        toast.error("Failed to Resend OTP", {
          description: result.error,
        });
      } else {
        toast.success("OTP Resent Successfully", {
          description: "Please check your email for the new OTP.",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Enter your OTP</DialogTitle>
          <DialogDescription>
            Please enter the OTP sent to {email}
          </DialogDescription>
        </DialogHeader>
        <Form {...verificationForm}>
          <form
            onSubmit={verificationForm.handleSubmit(onSubmit)}
            className="gap-4 flex flex-col"
          >
            <FormField
              control={verificationForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field} disabled={isPending}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-4">
              <Button className="w-min" type="submit" disabled={isPending}>
                Verify OTP
              </Button>
              <Button
                onClick={handleResendOTP}
                className="w-min"
                type="button"
                variant="secondary"
                disabled={isPending}
              >
                Resend OTP
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
