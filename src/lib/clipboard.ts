import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";

export function getGameDeepLink(gameId: string): string {
  return Linking.createURL(`/game/${gameId}`);
}

export async function copyGameLink(gameId: string): Promise<void> {
  const link = getGameDeepLink(gameId);
  await Clipboard.setStringAsync(link);
}
