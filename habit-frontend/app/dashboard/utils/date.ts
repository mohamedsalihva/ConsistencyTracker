export function formatDay(d: Date) {
  return d.toISOString().split("T")[0];
}

export function getLast(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d;
  });
}


