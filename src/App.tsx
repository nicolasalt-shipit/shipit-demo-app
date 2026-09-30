import { useState } from "react";
import "./App.css";

type Habit = {
  id: number;
  name: string;
  streak: number;
  doneToday: boolean;
};

const SEED_HABITS: Habit[] = [
  { id: 1, name: "Drink 8 glasses of water", streak: 4, doneToday: false },
  { id: 2, name: "Read for 20 minutes", streak: 2, doneToday: false },
  { id: 3, name: "Go for a walk", streak: 0, doneToday: false },
];

export function App() {
  const [habits, setHabits] = useState<Habit[]>(SEED_HABITS);

  // Checking a habit extends its streak by one; unchecking undoes that.
  function toggle(id: number) {
    setHabits((hs) =>
      hs.map((h) =>
        h.id === id
          ? { ...h, doneToday: !h.doneToday, streak: h.streak + (h.doneToday ? -1 : 1) }
          : h,
      ),
    );
  }

  const doneCount = habits.filter((h) => h.doneToday).length;

  return (
    <main className="app">
      <header className="header">
        <h1>Daily Habits</h1>
        <p className="progress">
          {doneCount} of {habits.length} done today
        </p>
      </header>

      <ul className="habit-list">
        {habits.map((h) => (
          <li key={h.id} className={`habit${h.doneToday ? " done" : ""}`}>
            <button
              className="check"
              onClick={() => toggle(h.id)}
              aria-pressed={h.doneToday}
              aria-label={`${h.doneToday ? "Uncheck" : "Check"} ${h.name}`}
            >
              {h.doneToday ? "✓" : ""}
            </button>
            <span className="name">{h.name}</span>
            <span className="streak" title={`${h.streak}-day streak`}>
              🔥 {h.streak} {h.streak === 1 ? "day" : "days"}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
