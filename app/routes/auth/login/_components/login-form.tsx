import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/assets/icons/google.svg?react";
import AppleIcon from "@/assets/icons/apple.svg?react";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field";
import { useAuth } from "@/providers/auth-provider";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, loginWithGoogle } = useAuth();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const backgroundLocation = location.state?.backgroundLocation;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      onSuccess?.();
    } catch {
      // toast notification is already triggered inside login mutation onSuccess/onError
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-sm mx-auto p-1">
      {!backgroundLocation && (
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field>
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input
            id="login-email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            {...register("email")}
            className={errors.email ? "aria-invalid" : ""}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="login-password">Password</FieldLabel>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isSubmitting}
            {...register("password")}
            className={errors.password ? "aria-invalid" : ""}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <FieldSeparator>or continue with</FieldSeparator>

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
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          state={backgroundLocation ? { backgroundLocation } : undefined}
          className="text-primary hover:underline font-semibold"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
