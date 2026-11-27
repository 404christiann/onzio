// The admin tour's scenes and beats. Pacing follows the Rose City editor ad
// (r8): taps about a second apart, 83 ms a character, a half-second pause
// between a click and the first keystroke, a 900 ms glide for long cursor
// moves. The admin's own timings drive its UI: Saving holds at least 400 ms,
// Saved shows for 1.9 s.

export type Save = "clean" | "dirty" | "saving" | "saved";

export type TourState = {
  chapter: number;
  /** On a phone only one device shows: the admin while staff work, the site for the result. */
  view: "admin" | "site";
  cursor: { target: string; fx: number; fy: number; duration: number; presses: number };
  cursorShown: boolean;
  dialog: boolean;
  popover: boolean;
  focus: string | null;
  selected: boolean;
  heading: string;
  jersey: string;
  date: string;
  opponent: string;
  venue: string;
  save: Save;
  /** The edit has reached the public site. */
  live: boolean;
  range: string;
};

export const CHAPTERS = [
  { id: "homepage", label: "Edit the homepage", icon: "Homepage", path: "homepage", duration: 12000 },
  { id: "roster", label: "Update the roster", icon: "Roster", path: "roster", duration: 11000 },
  { id: "schedule", label: "Add a match", icon: "Schedule", path: "schedule", duration: 13500 },
  { id: "insights", label: "Read the numbers", icon: "Analytics", path: "insights", duration: 9500 },
] as const;

export const TYPED = { heading: "Pack the stands", jersey: "9", opponent: "Example United", venue: "Championship Stadium", date: "Sat, Apr 10, 2027" };

export function initialState(chapter: number): TourState {
  return {
    chapter,
    view: "admin",
    cursor: { target: "rest", fx: 0.5, fy: 0.5, duration: 0, presses: 0 },
    cursorShown: false,
    dialog: false,
    popover: false,
    focus: null,
    selected: false,
    heading: "Next home match",
    jersey: "14",
    date: "",
    opponent: "",
    venue: "",
    save: "clean",
    live: false,
    range: "October 2026",
  };
}

/** The frame most people see: a thumbnail, reduced motion, a screenshot. Each chapter's result, on screen. */
export function posterState(chapter: number): TourState {
  const base = initialState(chapter);
  if (chapter === 0) return { ...base, heading: TYPED.heading, save: "saved", live: true };
  if (chapter === 1) return { ...base, jersey: TYPED.jersey, save: "saved", live: true };
  if (chapter === 2) return { ...base, date: TYPED.date, opponent: TYPED.opponent, venue: TYPED.venue, save: "saved", live: true };
  return { ...base, range: "November 2026", live: true };
}

export type Action =
  | { kind: "set"; patch: Partial<TourState> }
  | { kind: "move"; target: string; fx?: number; fy?: number; duration: number }
  | { kind: "press" }
  | { kind: "end" };

export type Beat = { at: number; action: Action };

const CHAR = 83;

class Script {
  beats: Beat[] = [];
  set(at: number, patch: Partial<TourState>) { this.beats.push({ at, action: { kind: "set", patch } }); return this; }
  move(at: number, target: string, duration: number, fx = 0.5, fy = 0.5) { this.beats.push({ at, action: { kind: "move", target, fx, fy, duration } }); return this; }
  press(at: number, patch?: Partial<TourState>) {
    this.beats.push({ at, action: { kind: "press" } });
    if (patch) this.set(at + 60, patch);
    return this;
  }
  /** Replaces the selected value, one character at a time. */
  type(at: number, field: "heading" | "jersey" | "opponent" | "venue", text: string) {
    for (let i = 1; i <= text.length; i++) this.set(at + (i - 1) * CHAR, { [field]: text.slice(0, i), selected: false } as Partial<TourState>);
    return at + (text.length - 1) * CHAR;
  }
  end(at: number) { this.beats.push({ at, action: { kind: "end" } }); return this.beats.sort((a, b) => a.at - b.at); }
}

export function beatsFor(chapter: number): Beat[] {
  const s = new Script().set(0, { cursorShown: true });
  if (chapter === 0) {
    s.move(500, "part-match", 900, 0.5, 0.35).press(1400, { dialog: true });
    s.move(1900, "field-heading", 700, 0.82).press(2600, { focus: "heading", selected: true });
    s.type(3100, "heading", TYPED.heading);
    s.move(4600, "dialog-done", 600).press(5200, { dialog: false, focus: null, save: "dirty" });
    s.move(5600, "page-save", 800).press(6400, { save: "saving" });
    s.set(6900, { save: "saved" }).set(7300, { live: true, view: "site" }).set(8800, { save: "clean" });
    s.move(7400, "rest", 900);
    s.set(10600, { cursorShown: false });
    return s.end(12000);
  }
  if (chapter === 1) {
    s.move(500, "row-edit", 900).press(1400, { dialog: true });
    s.move(1900, "field-jersey", 700, 0.8).press(2600, { focus: "jersey", selected: true });
    s.type(3100, "jersey", TYPED.jersey);
    s.set(3200, { save: "dirty" });
    s.move(3600, "player-save", 700).press(4300, { save: "saving" });
    s.set(4800, { save: "saved" }).set(5500, { dialog: false, focus: null, live: true, view: "site" });
    s.move(5700, "rest", 900);
    s.set(9800, { cursorShown: false });
    return s.end(11000);
  }
  if (chapter === 2) {
    s.move(500, "add-match", 900).press(1400, { dialog: true });
    s.move(1900, "field-date", 700, 0.7).press(2600, { popover: true, focus: "date" });
    s.move(3000, "day-10", 500).press(3500, { popover: false, date: TYPED.date, focus: null, save: "dirty" });
    s.move(3900, "field-opponent", 600, 0.8).press(4500, { focus: "opponent" });
    s.type(5000, "opponent", TYPED.opponent);
    s.move(6400, "field-venue", 500, 0.8).press(6900, { focus: "venue" });
    s.type(7400, "venue", TYPED.venue);
    s.move(9300, "match-save", 600).press(9900, { save: "saving", focus: null });
    s.set(10400, { save: "saved" }).set(11000, { dialog: false, live: true, view: "site" });
    s.move(11200, "rest", 900);
    s.set(12800, { cursorShown: false });
    return s.end(13500);
  }
  s.move(500, "range", 900, 0.7).press(1400, { popover: true });
  s.move(1800, "range-november", 400, 0.4).press(2200, { popover: false, range: "November 2026", live: true });
  s.move(2700, "rest", 900);
  s.set(8200, { cursorShown: false });
  return s.end(9500);
}

/** The scene at `ms` into a chapter, with the last cursor move, for tests that step through every beat. */
export function stateAt(chapter: number, ms: number) {
  let state = initialState(chapter);
  let move: { target: string; fx: number; fy: number } | null = null;
  for (const beat of beatsFor(chapter)) {
    if (beat.at > ms) break;
    const { action } = beat;
    if (action.kind === "set") state = { ...state, ...action.patch };
    else if (action.kind === "move") move = { target: action.target, fx: action.fx ?? 0.5, fy: action.fy ?? 0.5 };
  }
  return { state, move };
}
