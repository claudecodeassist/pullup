import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from "date-fns";

export function formatGameTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return `Today at ${format(date, "h:mm a")}`;
  if (isTomorrow(date)) return `Tomorrow at ${format(date, "h:mm a")}`;
  return format(date, "EEE, MMM d 'at' h:mm a");
}

export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function isGamePast(dateStr: string): boolean {
  return isPast(new Date(dateStr));
}

export function formatChatTime(dateStr: string): string {
  return format(new Date(dateStr), "h:mm a");
}
