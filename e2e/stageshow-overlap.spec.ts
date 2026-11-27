import { expect, test, type Page } from "@playwright/test";

// Steps through every beat of the homepage admin tour at five widths and fails
// on overlapping parts, text that overflows its box, a cursor that presses off
// its target, popups that escape their window, actions hidden under the
// stage's edge fade, and anything that moves the page around the stage.

const WIDTHS = [375, 768, 1024, 1280, 1440];

// Pairs that must never intersect while both are visible.
const PAIRS: [string, string][] = [
  [".aw-screen[data-on] .pf-heading", ".aw-screen[data-on] .pf-open"],
  [".aw-screen[data-on] .pf-heading", ".aw-screen[data-on] .pf-save-group"],
  [".aw-screen[data-on] .pf-open", ".aw-screen[data-on] .pf-save-group"],
  [".aw-screen[data-on] .pf-header", ".aw-screen[data-on] .ho-toolbar"],
  [".aw-screen[data-on] .ho-toolbar", ".aw-screen[data-on] .ho-box"],
  [".aw-screen[data-on] .ap-heading", ".aw-screen[data-on] .ap-actions"],
  [".aw-screen[data-on] .ap-header", ".aw-screen[data-on] .tabs"],
  [".aw-screen[data-on] .tabs", ".aw-screen[data-on] .acc"],
  [".aw-screen[data-on] .ap-header", ".aw-screen[data-on] .sm-list"],
  [".aw-screen[data-on] .ap-header", ".aw-screen[data-on] .in-columns"],
  [".aw-screen[data-on] .in-card", ".aw-screen[data-on] .mc-card"],
  [".aw-screen[data-on] .in-numbers > div", ".aw-screen[data-on] .in-numbers > div"],
  [".ed-layer[data-open] .ed-header > *", ".ed-layer[data-open] .ed-header > *"],
  [".ed-layer[data-open] .ed-footer-bar > *", ".ed-layer[data-open] .ed-footer-bar > *"],
  [".ed-layer[data-open] .ed-footer > *", ".ed-layer[data-open] .ed-footer > *"],
  [".ed-layer[data-open] .ck-stack > *", ".ed-layer[data-open] .ck-stack > *"],
  [".ed-layer[data-open] .ck-row2 > *, .ed-layer[data-open] .ck-row3 > *", ".ed-layer[data-open] .ck-row2 > *, .ed-layer[data-open] .ck-row3 > *"],
  [".sm-list[data-added] .sm-new", ".sm-list[data-added] .sm-rest"],
  [".rs-schedule[data-added] .rs-sched-card", ".rs-schedule[data-added] .rs-sched-list"],
  [".at-admin", ".at-phone"],
  [".at-fit", ".at-tabs"],
  [".at-tab", ".at-tab"],
];

// Text that must fit its own box.
const FITS = [".pf-title", ".ap-title", ".ed-title", ".ps-button", ".btn", ".ns-select", ".ed-done", ".ed-cancel", ".sb-item", ".sh-search", ".at-tab", ".in-title", ".mc-label"];

// Popups that must stay inside a container.
const INSIDE: [string, string][] = [
  [".ed-layer[data-open] .ed-popup", ".aw-shell"],
  [".cal[data-open]", ".ed-popup"],
  [".menu[data-open]", ".aw"],
  [".aw-screen[data-on] .pf-header", ".aw-content"],
  [".aw-screen[data-on] .ap-header", ".aw-content"],
];

type Problem = string;

async function audit(page: Page, pressTarget: string | null): Promise<Problem[]> {
  return page.evaluate(({ PAIRS, FITS, INSIDE, pressTarget }) => {
    const problems: string[] = [];
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return false;
      for (let e: Element | null = el; e && e !== document.body; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) < 0.02) return false;
      }
      return true;
    };
    const name = (el: Element) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ").filter(Boolean).slice(0, 2).join(".")}`;
    const overlap = (a: DOMRect, b: DOMRect) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;

    for (const [sa, sb] of PAIRS) {
      const as = [...document.querySelectorAll(sa)].filter(visible);
      const bs = [...document.querySelectorAll(sb)].filter(visible);
      for (const a of as) for (const b of bs) {
        if (a === b || a.contains(b) || b.contains(a)) continue;
        if (sa === sb && as.indexOf(b) < as.indexOf(a)) continue;
        if (overlap(a.getBoundingClientRect(), b.getBoundingClientRect())) problems.push(`overlap: ${name(a)} × ${name(b)}`);
      }
    }
    for (const sel of FITS) for (const el of [...document.querySelectorAll<HTMLElement>(sel)].filter(visible)) {
      if (el.scrollWidth > el.clientWidth + 1) problems.push(`overflow: ${name(el)} "${el.textContent?.trim().slice(0, 30)}" (${el.scrollWidth} > ${el.clientWidth})`);
    }
    for (const [sel, box] of INSIDE) for (const el of [...document.querySelectorAll(sel)].filter(visible)) {
      const outer = el.parentElement?.closest(box);
      if (!outer) continue;
      const a = el.getBoundingClientRect(), b = outer.getBoundingClientRect();
      if (a.left < b.left - 1 || a.right > b.right + 1 || a.top < b.top - 1 || a.bottom > b.bottom + 1) problems.push(`escapes: ${name(el)} outside ${box}`);
    }
    if (pressTarget) {
      const target = [...document.querySelectorAll(`.at-stage [data-target="${pressTarget}"]`)].find(visible);
      const tip = document.querySelector(".at-stage .cur-y")?.getBoundingClientRect();
      const fit = document.querySelector(".at-fit")!.getBoundingClientRect();
      const compact = document.querySelector(".at-stage")?.getAttribute("data-layout") === "compact";
      const fade = fit.height * 40 / (compact ? 720 : 640);
      if (!target) problems.push(`press: target ${pressTarget} not visible`);
      else if (tip) {
        const r = target.getBoundingClientRect();
        if (tip.left < r.left || tip.left > r.right || tip.top < r.top || tip.top > r.bottom) problems.push(`press: cursor off ${pressTarget}`);
        if (tip.top > fit.bottom - fade || tip.top < fit.top || tip.left > fit.right || tip.left < fit.left) problems.push(`press: ${pressTarget} under the stage edge`);
      }
    }
    return problems;
  }, { PAIRS, FITS, INSIDE, pressTarget });
}

const anchors = (page: Page) => page.evaluate(() => {
  const r = (sel: string) => { const b = document.querySelector(sel)?.getBoundingClientRect(); return b ? [Math.round(b.top + scrollY), Math.round(b.height)] : null; };
  return JSON.stringify({ fit: r(".at-fit"), tabs: r(".at-tabs"), clubs: r("#club-sites"), pricing: r("#pricing") });
});

for (const width of WIDTHS) {
  test(`admin tour has no overlaps at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/?tour-test");
    await page.waitForFunction(() => "__tour" in window);
    await page.locator("#tour").scrollIntoViewIfNeeded();
    // Entrance animations (the hero's rise) settle before anything is measured.
    await page.evaluate(() => Promise.race([
      Promise.all(document.getAnimations().filter(a => a.playState === "running" && a.effect?.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => undefined))),
      new Promise(resolve => setTimeout(resolve, 2000)),
    ]));
    const chapters = await page.evaluate(() => (window as unknown as { __tour: { chapters: { duration: number; beats: { at: number; kind: string; target: string | null }[] }[] } }).__tour.chapters);
    const start = await anchors(page);
    const problems: string[] = [];
    for (let c = 0; c < chapters.length; c++) {
      let lastMove: string | null = null;
      const steps: { at: number; press: string | null }[] = [];
      for (const beat of chapters[c].beats) {
        if (beat.kind === "move") lastMove = beat.target;
        steps.push({ at: beat.at + (beat.kind === "press" ? 30 : 1), press: beat.kind === "press" ? lastMove : null });
      }
      for (const step of steps) {
        await page.evaluate(([chapter, ms]) => (window as unknown as { __tour: { seek(c: number, m: number): Promise<void> } }).__tour.seek(chapter, ms), [c, step.at]);
        for (const p of await audit(page, step.press)) problems.push(`chapter ${c + 1} @${step.at}ms: ${p}`);
        expect(await anchors(page), `page moved at chapter ${c + 1} @${step.at}ms`).toBe(start);
      }
    }
    expect([...new Set(problems)]).toEqual([]);
  });

}
