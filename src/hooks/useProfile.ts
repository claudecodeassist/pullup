import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data as Profile);
    setLoading(false);
  }, [userId]);

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!userId) return;
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);
      if (!error) {
        setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      }
      return { error };
    },
    [userId]
  );

  return { profile, loading, fetchProfile, updateProfile };
}
