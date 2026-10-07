// Picks a random answer, never the same one twice in a row.
export function pickAnswer<T extends { id: string }>(
  answers: readonly T[],
  lastId: string | null,
  random: () => number = Math.random,
): T {
  if (answers.length === 0) throw new Error("pickAnswer needs at least one answer");
  const pool = answers.length > 1 ? answers.filter((answer) => answer.id !== lastId) : answers;
  return pool[Math.floor(random() * pool.length)];
}
