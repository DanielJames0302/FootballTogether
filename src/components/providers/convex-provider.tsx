"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export const ConvexClientProvider = ({
 children
} : {
  children: ReactNode
}) => {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
    >
      <ConvexProviderWithClerk
        useAuth={useAuth}
        client={convex}
      >
        {children}

      </ConvexProviderWithClerk>

    </ClerkProvider>
  )
}