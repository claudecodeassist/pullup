import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Game, Location } from "@/types/database";

interface Participant {
  id: string;
  user_id: string;
  status: "joined" | "left";
  profiles: { display_name: string | null } | null;
}

interface UseGameReturn {
  game: (Game & { locations: Location }) | null;
  participants: Participant[];
  loading: boolean;
  refresh: () => void;
}

export function useGame(gameId: string): UseGameReturn {
  const [game, setGame] = useState<(Game & { locations: Location }) | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGame = useCallback(async () => {
    const { data } = await supabase
      .from("games")
      .select("*, locations(*)")
      .eq("id", gameId)
      .single();

    if (data) setGame(data as Game & { locations: Location });
    setLoading(false);
  }, [gameId]);

  const fetchParticipants = useCallback(async () => {
    const { data } = await supabase
      .from("game_participants")
      .select("id, user_id, status, profiles(display_name)")
      .eq("game_id", gameId)
      .eq("status", "joined");

    if (data) setParticipants(data as unknown as Participant[]);
  }, [gameId]);

  useEffect(() => {
    fetchGame();
    fetchParticipants();

    const gameChannel = supabase
      .channel(`game-${gameId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games", filter: `id=eq.${gameId}` },
        () => fetchGame()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_participants",
          filter: `game_id=eq.${gameId}`,
        },
        () => fetchParticipants()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [gameId, fetchGame, fetchParticipants]);

  const refresh = useCallback(() => {
    fetchGame();
    fetchParticipants();
  }, [fetchGame, fetchParticipants]);

  return { game, participants, loading, refresh };
}
