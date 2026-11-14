'use client';

import { createContext, useContext, useEffect, useState } from "react";

type UserType = 'user' | 'provider';

type AuthContextType = {
  userType: UserType;
  setUserType: (type: UserType) => void;
  token: string | null;
  login: (token: string, type: UserType) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  userType: "user",
  setUserType: () => {},
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userType, setUserType] = useState<UserType>("user");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedType = localStorage.getItem('userType');
    const storedToken = localStorage.getItem('authToken');
    if (storedType === 'user' || storedType === 'provider') {
      setUserType(storedType);
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userType", userType);
  }, [userType]);

  const login = (token: string, type: UserType) => {
    setToken(token);
    setUserType(type);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userType', type);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ userType, setUserType, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
