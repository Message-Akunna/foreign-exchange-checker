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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field>
          <FieldLabel htmlFor="register-name">Name</FieldLabel>
          <Input
            id="register-name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            disabled={isSubmitting}
            {...register("name")}
            className={errors.name ? "aria-invalid" : ""}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="register-email">Email</FieldLabel>
          <Input
            id="register-email"
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
          <FieldLabel htmlFor="register-password">Password</FieldLabel>
          <Input
            id="register-password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
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
          {isSubmitting ? "Creating account..." : "Create Account"}
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
