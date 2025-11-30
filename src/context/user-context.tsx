"use client";

import { User } from "@/generated/prisma/client";
import { Role } from "@/generated/prisma/enums";
import { createContext, useContext, ReactNode } from "react";

interface UserContextType {
  user: User | null;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) {
  const isAdmin = user?.role === Role.ADMIN;
  return (
    <UserContext.Provider value={{ user, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
}


export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
}
