import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles: { display_name: string | null } | null;
}

export function useGameChat(gameId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("id, content, user_id, created_at, profiles(display_name)")
      .eq("game_id", gameId)
      .order("created_at", { ascending: true });

    if (data) setMessages(data as unknown as ChatMessage[]);
    setLoading(false);
  }, [gameId]);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel(`chat-${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `game_id=eq.${gameId}`,
        },
        async (payload) => {
          // Fetch the complete message with profile
          const { data } = await supabase
            .from("messages")
            .select("id, content, user_id, created_at, profiles(display_name)")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => [...prev, data as unknown as ChatMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, fetchMessages]);

  const sendMessage = useCallback(
    async (userId: string, content: string) => {
      await supabase
        .from("messages")
        .insert({ game_id: gameId, user_id: userId, content });
    },
    [gameId]
  );

  return { messages, loading, sendMessage };
}
