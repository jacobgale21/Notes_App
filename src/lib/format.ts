export function formatUpdatedAt(isoDate: string): string {
  const then = new Date(isoDate.endsWith("Z") ? isoDate : `${isoDate}Z`);
  if (Number.isNaN(then.getTime())) return "unknown";
  const startOfThen = new Date(
    then.getFullYear(),
    then.getMonth(),
    then.getDate(),
  );
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfThen.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
}
