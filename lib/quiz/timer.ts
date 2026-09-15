export function secondsFromMinutes(minutes: number) {
  return Math.max(0, Math.floor(minutes * 60));
}
