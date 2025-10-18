"use client";

import { useState, useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  // Проверяем аутентификацию при загрузке
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("admin-token");
      const isAuthenticated = !!token;
      
      setAuthState({
        isAuthenticated,
        isLoading: false,
      });
    };

    checkAuth();
  }, []);

  // Функция входа
  const login = (username: string, password: string): boolean => {
    // Простая проверка логина и пароля
    // В реальном приложении это должно быть на сервере
    const validCredentials = {
      username: "admin",
      password: "psychotest2024"
    };

    if (username === validCredentials.username && password === validCredentials.password) {
      const token = btoa(`${username}:${Date.now()}`);
      localStorage.setItem("admin-token", token);
      
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    }
    
    return false;
  };

  // Функция выхода
  const logout = () => {
    localStorage.removeItem("admin-token");
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
  };
}
