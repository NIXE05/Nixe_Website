"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { Plate, PlateInner, SectionHead } from "@/components/Plate";
import { INTENT_EVENT } from "@/lib/intent";

type FormData = {
  name: string;
  email: string;
  company: string;
  intent: string;
  message: string;
};

const FIELDS = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "company", label: "Company", type: "text", required: false },
] as const;

const fieldStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid var(--tone-line)",
  color: "var(--tone-fg)",
  fontSize: "0.95rem",
};

export function Contact() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    intent: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  // A CTA elsewhere on the page (the hero's "Request a Consultation") can
  // preselect why the visitor came, so the enquiry isn't unlabelled.
  useEffect(() => {
    const onIntent = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      if (value) setForm((prev) => ({ ...prev, intent: value }));
    };
    window.addEventListener(INTENT_EVENT, onIntent);
    return () => window.removeEventListener(INTENT_EVENT, onIntent);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to an email service (see CLAUDE.md → Pending work)
    console.log("NIXE contact form:", form);
    setSent(true);
  };

  const focusOn = (el: HTMLElement) => {
    el.style.borderColor = "var(--tone-fg)";
  };
  const focusOff = (el: HTMLElement) => {
    el.style.borderColor = "var(--tone-line)";
  };

  return (
    <Plate id="contact" tone="ink" index="05" className="overflow-hidden">
      <div className="absolute inset-0 pointer-events-none blueprint-dot" />

      <PlateInner className="relative z-10">
        <SectionHead
          index="05"
          label="Contact"
          headline={["Let's build", "something worth", "shipping."]}
          kicker="Tell us what you're building and what's in the way. We reply to everything."
          className="mb-16 md:mb-24"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-28">
          {/* Form */}
          <div>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 px-8 text-center"
                style={{ border: "1px solid var(--tone-line)" }}
              >
                <p
                  className="font-bold text-2xl"
                  style={{ color: "var(--tone-fg)" }}
                >
                  Message received.
                </p>
                <p className="mt-4 text-sm" style={{ color: "var(--tone-fg-3)" }}>
                  We&apos;ll be in touch shortly.
                </p>
              </motion.div>
            ) : (
              <motion.form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {FIELDS.map((field) => (
                    <div
                      key={field.name}
                      className={`flex flex-col gap-2 ${
                        field.name === "company" ? "sm:col-span-2" : ""
                      }`}
                    >
                      <label
                        htmlFor={`contact-${field.name}`}
                        className="mono-label"
                        style={{ color: "var(--tone-fg-3)" }}
                      >
                        {field.label}
                        {!field.required && (
                          <span style={{ color: "var(--tone-fg-4)" }}> · optional</span>
                        )}
                      </label>
                      <input
                        id={`contact-${field.name}`}
                        type={field.type}
                        name={field.name}
                        required={field.required}
                        onChange={handleChange}
                        className="px-4 py-4 outline-none transition-colors duration-300"
                        style={fieldStyle}
                        onFocus={(e) => focusOn(e.currentTarget)}
                        onBlur={(e) => focusOff(e.currentTarget)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-intent"
                    className="mono-label"
                    style={{ color: "var(--tone-fg-3)" }}
                  >
                    Intent
                  </label>
                  {/* Controlled, unlike the other fields — it has to reflect a
                      value set from outside by the hero CTA. */}
                  <select
                    id="contact-intent"
                    name="intent"
                    required
                    value={form.intent}
                    onChange={handleChange}
                    className="px-4 py-4 outline-none transition-colors duration-300"
                    style={{ ...fieldStyle, background: "var(--tone-bg)" }}
                    onFocus={(e) => focusOn(e.currentTarget)}
                    onBlur={(e) => focusOff(e.currentTarget)}
                  >
                    <option value="">Select…</option>
                    <option value="consultation">Consultation</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="ai">AI Consulting</option>
                    <option value="applications">Applications</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-message"
                    className="mono-label"
                    style={{ color: "var(--tone-fg-3)" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    onChange={handleChange}
                    className="px-4 py-4 resize-y outline-none transition-colors duration-300"
                    style={fieldStyle}
                    onFocus={(e) => focusOn(e.currentTarget)}
                    onBlur={(e) => focusOff(e.currentTarget)}
                  />
                </div>

                <Button type="submit" className="self-start mt-2">
                  Send Message
                </Button>
              </motion.form>
            )}
          </div>

          {/* Direct lines */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { label: "Email", value: "hello@nixe.in", href: "mailto:hello@nixe.in" },
              { label: "Location", value: "Markham, Ontario" },
            ].map((row) => (
              <div
                key={row.label}
                className="py-7"
                style={{ borderTop: "1px solid var(--tone-line)" }}
              >
                <div
                  className="mono-label mb-3"
                  style={{ color: "var(--tone-fg-4)", fontSize: "0.58rem" }}
                >
                  {row.label}
                </div>
                {row.href ? (
                  <a
                    href={row.href}
                    className="group relative inline-block transition-opacity duration-200 hover:opacity-70"
                    style={{ fontSize: "1.1rem", color: "var(--tone-fg)" }}
                  >
                    {row.value}
                    <span
                      className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                      style={{ background: "var(--tone-fg)" }}
                    />
                  </a>
                ) : (
                  <p style={{ fontSize: "1.1rem", color: "var(--tone-fg)" }}>{row.value}</p>
                )}
              </div>
            ))}

            <div
              className="pt-10 mono-label"
              style={{ color: "var(--tone-fg-4)", fontSize: "0.58rem", lineHeight: 2 }}
            >
              43.8561° N · 79.2673° W
              <br />
              REF: NXE-001
            </div>
          </motion.div>
        </div>
      </PlateInner>
    </Plate>
  );
}
