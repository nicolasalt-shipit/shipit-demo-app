import { useEffect, useState } from "react";
import {
  Habit,
  isDoneToday,
  loadHabits,
  newId,
  saveHabits,
  streak,
  toggleToday,
} from "./habits";
import "./styles.css";

export function App() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  function addHabit(e: React.FormEvent) {
    e.preventDefault();
    const name = draft.trim();
    if (!name) return;
    setHabits((hs) => [
      ...hs,
      { id: newId(), name, completedDates: [] },
    ]);
    setDraft("");
  }

  function check(id: string) {
    setHabits((hs) => hs.map((h) => (h.id === id ? toggleToday(h) : h)));
  }

  function remove(id: string) {
    setHabits((hs) => hs.filter((h) => h.id !== id));
  }

  const doneCount = habits.filter(isDoneToday).length;

  return (
    <main className="app">
      <header className="header">
        <h1>Streaks</h1>
        <p className="subtitle">
          {habits.length === 0
            ? "Add your first daily habit"
            : `${doneCount} of ${habits.length} done today`}
        </p>
      </header>

      <form className="add-form" onSubmit={addHabit}>
        <input
          className="add-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. Read 20 minutes"
          aria-label="New habit name"
        />
        <button className="add-button" type="submit" disabled={!draft.trim()}>
          Add
        </button>
      </form>

      <ul className="habit-list">
        {habits.map((habit) => {
          const done = isDoneToday(habit);
          const count = streak(habit);
          return (
            <li key={habit.id} className={`habit${done ? " habit--done" : ""}`}>
              <button
                className="check"
                onClick={() => check(habit.id)}
                aria-pressed={done}
                aria-label={
                  done
                    ? `Uncheck ${habit.name} for today`
                    : `Check ${habit.name} for today`
                }
              >
                {done ? "✓" : ""}
              </button>

              <span className="habit-name">{habit.name}</span>

              <span className={`streak${count > 0 ? " streak--active" : ""}`}>
                🔥 {count}
                <span className="streak-unit">{count === 1 ? "day" : "days"}</span>
              </span>

              <button
                className="remove"
                onClick={() => remove(habit.id)}
                aria-label={`Delete ${habit.name}`}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
