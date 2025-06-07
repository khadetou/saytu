"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, AuthResponse } from "../lib/auth-api";
import { LoginData, RegisterData, User } from "../lib/schemas";
import { useEffect, useState } from "react";

export function useAuth() {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Get stored user and token
  const getStoredAuth = () => {
    if (typeof window === "undefined") return { user: null, token: null };

    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    return { user, token };
  };

  const { user: storedUser, token } = getStoredAuth();

  // Initialize auth state
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Get current user profile
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: authApi.getProfile,
    enabled: !!token && isInitialized,
    initialData: storedUser,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["auth", "profile"], data.user);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["auth", "profile"], data.user);
    },
  });

  // Logout function
  const logout = () => {
    authApi.logout();
    queryClient.clear();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const login = (data: LoginData) => loginMutation.mutate(data);
  const register = (data: RegisterData) => registerMutation.mutate(data);

  return {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading: isLoading || !isInitialized,
    login,
    register,
    logout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
