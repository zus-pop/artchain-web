"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getMeApi } from "@/apis/auth";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types";

/**
 * Custom hook to fetch current user information
 * Only runs when user is authenticated (has access token)
 */
export function useMeQuery() {
  const [isClient, setIsClient] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const query = useQuery<User, Error>({
    queryKey: ["user-me", accessToken], // Include token for cache invalidation
    queryFn: getMeApi,
    enabled: isClient && !!accessToken, // Only fetch when authenticated
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Sync user data to store when query succeeds
  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
}
