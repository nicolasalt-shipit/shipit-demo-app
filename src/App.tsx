import { useState } from "react";
import "./App.css";

type Habit = {
  id: number;
  name: string;
  emoji: string;
  streak: number;
  doneToday: boolean;
};

const SEED_HABITS: Habit[] = [
  { id: 1, name: "Morning run", emoji: "🏃", streak: 4, doneToday: false },
  { id: 2, name: "Read 20 pages", emoji: "📖", streak: 2, doneToday: false },
  { id: 3, name: "Drink 2L water", emoji: "💧", streak: 0, doneToday: false },
];

export function App() {
  const [habits, setHabits] = useState<Habit[]>(SEED_HABITS);

  const toggle = (id: number) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              doneToday: !h.doneToday,
              streak: h.doneToday ? Math.max(0, h.streak - 1) : h.streak + 1,
            }
          : h,
      ),
    );
  };

  const doneCount = habits.filter((h) => h.doneToday).length;
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="page">
      <main className="card">
        <header className="header">
          <div>
            <h1>Streaks</h1>
            <p className="date">{today}</p>
          </div>
          <div className="progress" aria-label={`${doneCount} of ${habits.length} habits done`}>
            <span className="progress-count">
              {doneCount}/{habits.length}
            </span>
            <span className="progress-label">done</span>
          </div>
        </header>

        <ul className="habit-list">
          {habits.map((habit) => (
            <li key={habit.id} className={`habit${habit.doneToday ? " is-done" : ""}`}>
              <button
                className="check"
                onClick={() => toggle(habit.id)}
                aria-pressed={habit.doneToday}
                aria-label={`Mark ${habit.name} as ${habit.doneToday ? "not done" : "done"}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>

              <span className="emoji" aria-hidden="true">
                {habit.emoji}
              </span>

              <span className="name">{habit.name}</span>

              <span className={`streak${habit.streak > 0 ? " is-active" : ""}`}>
                <span aria-hidden="true">🔥</span>
                <span>{habit.streak}</span>
                <span className="sr-only">day streak</span>
              </span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
