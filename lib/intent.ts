"use client";

/**
 * Lets a CTA tell the Contact form why the visitor is arriving, so the enquiry
 * lands already labelled instead of blank.
 *
 * Two routes in, because there are two kinds of caller:
 *  - Same page (the hero CTA): a custom event. Hero and Contact are siblings
 *    under a server component, so a one-line event is cheaper than threading a
 *    context provider through the page for one string.
 *  - Another page (the /regia demo CTA): a `?intent=` query param, since an
 *    event cannot survive a navigation. Link to `/?intent=<value>#contact`.
 */
export const INTENT_EVENT = "nixe:intent";

/** Values must match the Contact form's <option value> list. */
export type IntentValue =
  | "consultation"
  | "cybersecurity"
  | "ai"
  | "applications"
  | "regia"
  | "other";

const VALID: readonly IntentValue[] = [
  "consultation",
  "cybersecurity",
  "ai",
  "applications",
  "regia",
  "other",
];

export function requestIntent(value: IntentValue): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(INTENT_EVENT, { detail: value }));
}

/**
 * Reads `?intent=` from the current URL. Returns null for anything not on the
 * list, so a hand-edited URL can't push an unknown value into the form.
 */
export function readIntentFromUrl(): IntentValue | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("intent");
  return VALID.includes(raw as IntentValue) ? (raw as IntentValue) : null;
}
