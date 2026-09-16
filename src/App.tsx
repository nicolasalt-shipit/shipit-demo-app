import { useEffect, useState } from "react";
import {
  Habit,
  checkOff,
  currentStreak,
  isDoneToday,
  loadHabits,
  newHabit,
  saveHabits,
  undoToday,
} from "./habits";
import "./styles.css";

export function App() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const update = (id: string, fn: (h: Habit) => Habit) =>
    setHabits((hs) => hs.map((h) => (h.id === id ? fn(h) : h)));

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = draft.trim();
    if (!name) return;
    setHabits((hs) => [...hs, newHabit(name)]);
    setDraft("");
  };

  const doneCount = habits.filter(isDoneToday).length;

  return (
    <main className="app">
      <header className="header">
        <h1>Habits</h1>
        <p className="subtitle">
          {habits.length === 0
            ? "Add your first habit below."
            : `${doneCount} of ${habits.length} done today`}
        </p>
      </header>

      <ul className="habit-list">
        {habits.map((habit) => {
          const done = isDoneToday(habit);
          const streak = currentStreak(habit);
          return (
            <li key={habit.id} className={`habit${done ? " habit--done" : ""}`}>
              <button
                className="check"
                aria-pressed={done}
                aria-label={done ? `Uncheck ${habit.name}` : `Check off ${habit.name}`}
                onClick={() => update(habit.id, done ? undoToday : checkOff)}
              >
                {done ? "✓" : ""}
              </button>

              <span className="habit-name">{habit.name}</span>

              <span className={`streak${streak > 0 ? " streak--active" : ""}`}>
                {streak > 0 ? `🔥 ${streak}` : "—"}
                <span className="streak-unit">
                  {streak === 1 ? "day" : streak > 1 ? "days" : ""}
                </span>
              </span>

              <button
                className="delete"
                aria-label={`Delete ${habit.name}`}
                onClick={() => setHabits((hs) => hs.filter((h) => h.id !== habit.id))}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>

      <form className="add" onSubmit={addHabit}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="New habit…"
          aria-label="New habit name"
        />
        <button type="submit" disabled={!draft.trim()}>
          Add
        </button>
      </form>
    </main>
  );
}
