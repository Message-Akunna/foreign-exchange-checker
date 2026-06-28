import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/assets/icons/google.svg?react";
import AppleIcon from "@/assets/icons/apple.svg?react";
import { FieldSeparator } from "@/components/ui/field";
import { FormInput } from "@/components/forms/form-input";
import { FormPasswordInput } from "@/components/forms/form-password-input";
import { useAuth } from "@/providers/auth-provider";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register: authRegister, loginWithGoogle } = useAuth();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const backgroundLocation = location.state?.backgroundLocation;

  const { control, handleSubmit } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsSubmitting(true);
    try {
      await authRegister(data.email, data.password, data.name);
      onSuccess?.();
    } catch {
      // error is handled inside authRegister mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm mx-auto p-1">
      {!backgroundLocation && (
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to create your account
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-0">
        <FormInput
          control={control}
          name="name"
          label="Name"
          id="register-name"
          placeholder="John Doe"
          autoComplete="name"
          disabled={isSubmitting}
        />

        <FormInput
          control={control}
          name="email"
          label="Email"
          id="register-email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          disabled={isSubmitting}
        />

        <FormPasswordInput
          control={control}
          name="password"
          label="Password"
          id="register-password"
          placeholder="••••••••"
          autoComplete="new-password"
          disabled={isSubmitting}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <FieldSeparator className="my-5">or continue with</FieldSeparator>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          disabled
          onClick={loginWithGoogle}
          className="opacity-50 cursor-not-allowed h-10 gap-2"
        >
          <GoogleIcon className="size-4" aria-hidden="true" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled
          className="opacity-50 cursor-not-allowed h-10 gap-2"
        >
          <AppleIcon className="size-4" aria-hidden="true" />
          Apple
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          state={backgroundLocation ? { backgroundLocation } : undefined}
          className="text-primary hover:underline font-semibold"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
