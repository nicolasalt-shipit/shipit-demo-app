export type Habit = {
  id: string;
  name: string;
  /** ISO dates (YYYY-MM-DD) on which the habit was completed, unsorted. */
  completedDates: string[];
};

const STORAGE_KEY = "habit-tracker:habits";

/** crypto.randomUUID needs a secure context, which the preview over plain HTTP isn't. */
export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function shiftDays(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  return todayKey(date);
}

export function isDoneToday(habit: Habit): boolean {
  return habit.completedDates.includes(todayKey());
}

/**
 * Consecutive days ending today, or ending yesterday if today isn't checked yet
 * — so a streak isn't shown as broken until a full day has been missed.
 */
export function streak(habit: Habit): number {
  const done = new Set(habit.completedDates);
  const today = todayKey();
  let cursor = done.has(today) ? today : shiftDays(today, -1);
  let count = 0;
  while (done.has(cursor)) {
    count++;
    cursor = shiftDays(cursor, -1);
  }
  return count;
}

export function toggleToday(habit: Habit): Habit {
  const today = todayKey();
  return {
    ...habit,
    completedDates: habit.completedDates.includes(today)
      ? habit.completedDates.filter((d) => d !== today)
      : [...habit.completedDates, today],
  };
}

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (h): h is Habit =>
        h && typeof h.id === "string" && typeof h.name === "string" && Array.isArray(h.completedDates),
    );
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch {
    // Storage unavailable (private mode, quota) — the app still works in-memory.
  }
}
