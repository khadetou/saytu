"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterData } from "../lib/schemas";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { useAuth } from "../hooks/use-auth";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const {
    register: registerUser,
    isRegisterLoading,
    registerError,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = (data: RegisterData) => {
    registerUser(data);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Name (Optional)
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          className="h-11"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="h-11"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="h-11"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {registerError && (
        <div className="rounded-md bg-destructive/15 p-3">
          <p className="text-sm text-destructive">
            {(registerError as any)?.response?.data?.message ||
              registerError.message ||
              "Registration failed"}
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 font-medium"
        disabled={isRegisterLoading}
      >
        {isRegisterLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
