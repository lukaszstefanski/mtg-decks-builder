/**
 * useAuth - Custom hook do zarządzania autentykacją użytkownika
 * Pobiera dane użytkownika przekazane z serwera Astro
 */

import { useState, useEffect } from "react";

export interface User {
  id?: string;
  email?: string;
  username?: string;
}

export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
}

export const useAuth = (initialUser?: User | null): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [isLoading, setIsLoading] = useState(false);

  // Sprawdzanie czy użytkownik jest zalogowany
  const isAuthenticated = user !== null && user.id !== undefined;

  // Pobieranie ID użytkownika
  const userId = user?.id || null;

  // W przyszłości można dodać funkcje do odświeżania danych użytkownika
  // lub sprawdzania ważności sesji

  return {
    user,
    isAuthenticated,
    isLoading,
    userId,
  };
};
