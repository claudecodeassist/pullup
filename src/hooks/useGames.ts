import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { GameWithLocation } from "@/types/database";
import type { Sport } from "@/lib/constants";

interface UseGamesOptions {
  sportFilter?: Sport | null;
  myOnly?: boolean;
  userId?: string;
}

export function useGames({ sportFilter, myOnly, userId }: UseGamesOptions = {}) {
  const [games, setGames] = useState<GameWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGames = useCallback(async () => {
    let query = supabase
      .from("games")
      .select("*, locations(*)")
      .in("status", ["open", "full"])
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true });

    if (sportFilter) {
      query = query.eq("sport", sportFilter);
    }

    if (myOnly && userId) {
      // Get games where user is host or participant
      const { data: participantGames } = await supabase
        .from("game_participants")
        .select("game_id")
        .eq("user_id", userId)
        .eq("status", "joined");

      const participantGameIds = participantGames?.map((p) => p.game_id) ?? [];

      query = query.or(
        `host_id.eq.${userId}${participantGameIds.length ? `,id.in.(${participantGameIds.join(",")})` : ""}`
      );
    }

    const { data, error } = await query;
    if (!error && data) {
      setGames(data as GameWithLocation[]);
    }
    setLoading(false);
    setRefreshing(false);
  }, [sportFilter, myOnly, userId]);

  useEffect(() => {
    fetchGames();

    const channel = supabase
      .channel("games-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games" },
        () => {
          fetchGames();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchGames]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchGames();
  }, [fetchGames]);

  return { games, loading, refreshing, refresh };
}
