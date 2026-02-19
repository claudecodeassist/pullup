// Supabase Edge Function: Push Reminder
// Sends push notifications to participants 30 minutes before a game starts.
// Deploy: supabase functions deploy push-reminder
// Schedule via Supabase cron or invoke periodically.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

async function sendPushNotifications(messages: ExpoPushMessage[]) {
  if (messages.length === 0) return;

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messages),
  });
}

Deno.serve(async () => {
  try {
    // Find games starting in the next 30-35 minutes (5-min window to avoid duplicates)
    const now = new Date();
    const thirtyMin = new Date(now.getTime() + 30 * 60 * 1000);
    const thirtyFiveMin = new Date(now.getTime() + 35 * 60 * 1000);

    const { data: upcomingGames } = await supabase
      .from("games")
      .select("id, sport, starts_at, locations(name)")
      .in("status", ["open", "full"])
      .gte("starts_at", thirtyMin.toISOString())
      .lt("starts_at", thirtyFiveMin.toISOString());

    if (!upcomingGames || upcomingGames.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const messages: ExpoPushMessage[] = [];

    for (const game of upcomingGames) {
      // Get participants with push tokens
      const { data: participants } = await supabase
        .from("game_participants")
        .select("user_id, profiles(expo_push_token, display_name)")
        .eq("game_id", game.id)
        .eq("status", "joined");

      if (!participants) continue;

      for (const p of participants) {
        const profile = (p as any).profiles;
        const token = profile?.expo_push_token;
        if (!token) continue;

        const sportName = game.sport === "pickleball" ? "Pickleball" : "Spikeball";
        const locationName = (game as any).locations?.name ?? "TBD";

        messages.push({
          to: token,
          title: `${sportName} in 30 min!`,
          body: `Your game at ${locationName} starts soon. Don't forget your gear!`,
          data: { gameId: game.id },
        });
      }
    }

    await sendPushNotifications(messages);

    return new Response(JSON.stringify({ sent: messages.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
