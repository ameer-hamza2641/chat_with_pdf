// components/session-provider.tsx
"use client";

import { Session } from "@/lib/auth-client";

import { createContext, useContext, ReactNode } from "react";

// Use the Session type from your better-auth library if available
const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ 
  children, 
  initialSession 
}: { 
  children: ReactNode; 
  initialSession: Session | null; 
}) {
  return (
    <SessionContext.Provider value={initialSession}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);