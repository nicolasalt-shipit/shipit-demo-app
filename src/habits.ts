export type Habit = {
  id: string;
  name: string;
  streak: number;
  /** Local date (YYYY-MM-DD) the habit was last checked off, or null. */
  lastCompleted: string | null;
};

const STORAGE_KEY = "habit-tracker/habits";

/** Local calendar date as YYYY-MM-DD (not UTC — a habit day is the user's day). */
export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function today(): string {
  return toDayKey(new Date());
}

export function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDayKey(d);
}

/**
 * A streak is only alive if the habit was completed today or yesterday.
 * Once a full day is missed it shows as 0 even before the next check.
 */
export function currentStreak(habit: Habit): number {
  if (habit.lastCompleted === today() || habit.lastCompleted === yesterday()) {
    return habit.streak;
  }
  return 0;
}

export function isDoneToday(habit: Habit): boolean {
  return habit.lastCompleted === today();
}

/** Check off today: continues the streak if yesterday was done, otherwise starts a new one. */
export function checkOff(habit: Habit): Habit {
  if (isDoneToday(habit)) return habit;
  return {
    ...habit,
    streak: habit.lastCompleted === yesterday() ? habit.streak + 1 : 1,
    lastCompleted: today(),
  };
}

/** Undo today's check, restoring the habit to its pre-check state. */
export function undoToday(habit: Habit): Habit {
  if (!isDoneToday(habit)) return habit;
  const streak = habit.streak - 1;
  return {
    ...habit,
    streak: Math.max(streak, 0),
    lastCompleted: streak > 0 ? yesterday() : null,
  };
}

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultHabits();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultHabits();
    return parsed.filter(
      (h): h is Habit =>
        h &&
        typeof h.id === "string" &&
        typeof h.name === "string" &&
        typeof h.streak === "number",
    );
  } catch {
    return defaultHabits();
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch {
    // Storage unavailable (private mode, quota) — the app still works in-memory.
  }
}

/** crypto.randomUUID needs a secure context, which the preview origin isn't. */
function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function newHabit(name: string): Habit {
  return {
    id: makeId(),
    name,
    streak: 0,
    lastCompleted: null,
  };
}

function defaultHabits(): Habit[] {
  return ["Drink water", "Read 20 minutes", "Walk outside"].map(newHabit);
}
