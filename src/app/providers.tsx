"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const BskyAuthProvider = dynamic(() => import('../components/BlueskyAuthProvider'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

const StorachaProvider = dynamic(() => import('../components/StorachaProvider'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

export default function RootProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BskyAuthProvider>
        <StorachaProvider>
          {children}
        </StorachaProvider>
      </BskyAuthProvider>
    </QueryClientProvider>
  );
}
