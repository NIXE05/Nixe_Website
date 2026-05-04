"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type FormData = { name: string; email: string; company: string; intent: string; message: string };

export function Contact() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", company: "", intent: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("NIXE contact form:", form);
    setSent(true);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      style={{
        background: "#F0EFEA",
        borderTop: "1px solid rgba(10,10,10,0.07)",
        paddingTop: "clamp(80px,12vh,180px)",
        paddingBottom: "clamp(80px,12vh,180px)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none blueprint-dot" />
      <div className="w-full px-6 md:px-10 max-w-[1440px] mx-auto">
        <div className="mono-label mb-16 md:mb-24" style={{ color: "rgba(10,10,10,0.55)" }}>
          05 / CONTACT
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
          {/* Left */}
          <div>
            <motion.h2
              className="text-nixe-ink font-bold uppercase mb-16"
              style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", fontSize: "clamp(2rem, 5vw, 5.5rem)", letterSpacing: "-0.03em", lineHeight: 0.95, fontWeight: 800 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              Let&apos;s build something worth shipping.
            </motion.h2>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="py-14 border text-center"
                style={{ borderColor: "rgba(10,10,10,0.12)" }}
              >
                <p className="text-nixe-ink font-bold text-2xl">Message received.</p>
                <p className="mt-4 text-sm" style={{ color: "rgba(10,10,10,0.45)" }}>We&apos;ll be in touch shortly.</p>
              </motion.div>
            ) : (
              <motion.form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {([
                  { name: "name",    label: "Name",    type: "text",  required: true },
                  { name: "email",   label: "Email",   type: "email", required: true },
                  { name: "company", label: "Company", type: "text",  required: false },
                ] as const).map(field => (
                  <div key={field.name} className="flex flex-col gap-2">
                    <label className="mono-label" style={{ color: "rgba(10,10,10,0.62)" }}>{field.label}</label>
                    <input
                      type={field.type} name={field.name} required={field.required}
                      onChange={handleChange}
                      className="bg-transparent text-nixe-ink px-4 py-4 text-sm outline-none transition-colors duration-300"
                      style={{ border: "1px solid rgba(10,10,10,0.15)", fontSize: "0.95rem" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(10,10,10,0.45)")}
                      onBlur={e  => (e.currentTarget.style.borderColor = "rgba(10,10,10,0.15)")}
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2">
                  <label className="mono-label" style={{ color: "rgba(10,10,10,0.62)" }}>Intent</label>
                  <select
                    name="intent" required onChange={handleChange}
                    className="text-nixe-ink px-4 py-4 text-sm outline-none"
                    style={{ background: "#F0EFEA", border: "1px solid rgba(10,10,10,0.15)", fontSize: "0.95rem" }}
                  >
                    <option value="">Select…</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="ai">AI Consulting</option>
                    <option value="applications">Applications</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="mono-label" style={{ color: "rgba(10,10,10,0.62)" }}>Message</label>
                  <textarea
                    name="message" required rows={5} onChange={handleChange}
                    className="bg-transparent text-nixe-ink px-4 py-4 text-sm resize-y outline-none"
                    style={{ border: "1px solid rgba(10,10,10,0.15)", fontSize: "0.95rem" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(10,10,10,0.45)")}
                    onBlur={e  => (e.currentTarget.style.borderColor = "rgba(10,10,10,0.15)")}
                  />
                </div>

                <button
                  type="submit"
                  data-cursor-hover
                  className="group/btn relative isolate inline-flex h-[52px] items-center justify-center px-8 self-start transition-all duration-300 hover:bg-nixe-ink"
                  style={{ border: "1px solid rgba(10,10,10,0.25)" }}
                >
                  <div className="absolute left-0 size-[8px] -translate-x-6 rounded-sm opacity-0 blur-[12px] transition-all duration-400 group-hover/btn:-translate-x-[5px] group-hover/btn:opacity-100 group-hover/btn:blur-0" style={{ background: "rgba(10,10,10,0.6)" }} />
                  <div className="relative isolate flex overflow-hidden -translate-x-[4px] transition-transform duration-400 group-hover/btn:translate-x-[4px]">
                    <span className="mono-label text-nixe-ink transition-transform duration-400 group-hover/btn:-translate-y-full group-hover/btn:text-nixe-pearl">Send Message</span>
                    <span className="mono-label text-nixe-ink group-hover/btn:text-nixe-pearl absolute inset-0 translate-y-full transition-transform duration-400 group-hover/btn:translate-y-0" aria-hidden="true">Send Message</span>
                  </div>
                  {(["top-0 left-0","top-0 right-0 rotate-90","bottom-0 right-0 rotate-180","bottom-0 left-0 -rotate-90"] as const).map(pos => (
                    <svg key={pos} className={`absolute size-[9px] ${pos}`} style={{ color: "rgba(10,10,10,0.25)" }} width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M0.5 0.2L0.5 9.2M0.2 0.5L9.2 0.5" stroke="currentColor"/>
                    </svg>
                  ))}
                </button>
              </motion.form>
            )}
          </div>

          {/* Right */}
          <motion.div
            className="flex flex-col gap-8 md:pt-14"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div>
              <div className="mono-label mb-3" style={{ color: "rgba(10,10,10,0.55)" }}>Email</div>
              <a href="mailto:hello@nixe.in" className="group relative inline-block text-nixe-ink hover:opacity-60 transition-opacity duration-200" style={{ fontSize: "1.1rem" }} data-cursor-hover>
                hello@nixe.in
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-nixe-ink transition-all duration-300 group-hover:w-full" />
              </a>
            </div>
            <div>
              <div className="mono-label mb-3" style={{ color: "rgba(10,10,10,0.55)" }}>Schedule</div>
              <a href="#" className="group relative inline-block text-nixe-ink hover:opacity-60 transition-opacity duration-200" style={{ fontSize: "1.1rem" }} data-cursor-hover>
                Book a call →
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-nixe-ink transition-all duration-300 group-hover:w-full" />
              </a>
            </div>
            <div className="mt-4 pt-8 border-t" style={{ borderColor: "rgba(10,10,10,0.08)" }}>
              <div className="mono-label mb-3" style={{ color: "rgba(10,10,10,0.55)" }}>Location</div>
              <p style={{ color: "rgba(10,10,10,0.78)", fontSize: "1.1rem" }}>Markham, Ontario</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
