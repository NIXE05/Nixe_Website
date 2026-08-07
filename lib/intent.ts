"use client";

/**
 * Lets a CTA elsewhere on the page tell the Contact form why the visitor is
 * arriving, so the enquiry lands already labelled instead of blank.
 *
 * Hero and Contact are siblings under a server component, so there is no shared
 * React state to lift into — a one-line custom event is cheaper than threading a
 * context provider through the page for a single string.
 */
export const INTENT_EVENT = "nixe:intent";

/** Values must match the Contact form's <option value> list. */
export type IntentValue =
  | "consultation"
  | "cybersecurity"
  | "ai"
  | "applications"
  | "other";

export function requestIntent(value: IntentValue): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(INTENT_EVENT, { detail: value }));
}
