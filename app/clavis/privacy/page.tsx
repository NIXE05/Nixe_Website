import Link from "next/link";

const EFFECTIVE = "8 June 2026";
const UPDATED = "8 June 2026";
const CONTACT = "nixe.cxt@gmail.com";
const AMBER = "#F59E0B";

// ─── Reusable styles ─────────────────────────────────────────────────────────
const sectionHeaderStyle: React.CSSProperties = {
  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
  fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  lineHeight: 1.15,
  color: "var(--color-nixe-ink)",
};

const subHeaderStyle: React.CSSProperties = {
  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
  fontSize: "1.05rem",
  fontWeight: 700,
  letterSpacing: "-0.005em",
  color: "var(--color-nixe-ink)",
};

const bodyStyle: React.CSSProperties = {
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "rgba(10,10,10,0.78)",
};

const captionStyle: React.CSSProperties = {
  fontSize: "0.92rem",
  lineHeight: 1.65,
  color: "rgba(10,10,10,0.62)",
};

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({
  num,
  title,
  children,
  id,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="border-t pt-10 md:pt-14" style={{ borderColor: "rgba(10,10,10,0.1)" }}>
      <div className="mono-label mb-3" style={{ color: "rgba(10,10,10,0.5)" }}>
        SECTION {num}
      </div>
      <h2 className="mb-6 md:mb-8" style={sectionHeaderStyle}>
        {title}
      </h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

// ─── Table primitive ─────────────────────────────────────────────────────────
function Table({ headers, rows }: { headers: string[]; rows: (React.ReactNode | string)[][] }) {
  return (
    <div className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0" style={{ scrollbarWidth: "thin" }}>
      <table className="w-full text-left border-collapse" style={{ fontSize: "0.92rem", minWidth: 560 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(10,10,10,0.18)" }}>
            {headers.map((h) => (
              <th
                key={h}
                className="mono-label py-3 pr-4 align-bottom"
                style={{ color: "rgba(10,10,10,0.6)", fontWeight: 600 }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(10,10,10,0.08)" }}>
              {row.map((cell, j) => (
                <td key={j} className="py-4 pr-4 align-top" style={{ color: "rgba(10,10,10,0.78)", lineHeight: 1.55 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Inline wordmark ─────────────────────────────────────────────────────────
function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: AMBER }} />
      <span
        style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: "1.1rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: dark ? "var(--color-nixe-pearl)" : "var(--color-nixe-ink)",
        }}
      >
        Clavis
      </span>
    </span>
  );
}

// ─── Top nav ─────────────────────────────────────────────────────────────────
function PrivacyNav() {
  return (
    <nav
      className="sticky top-0 z-[1000] flex items-center justify-between px-6 md:px-10 py-5"
      style={{
        background: "rgba(250,250,247,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(10,10,10,0.08)",
      }}
    >
      <Link
        href="/clavis"
        data-cursor-hover
        className="mono-label inline-flex items-center"
        style={{ color: "rgba(10,10,10,0.7)" }}
      >
        ← CLAVIS
      </Link>

      <span className="mono-label hidden sm:block" style={{ color: "rgba(10,10,10,0.45)" }}>
        PRIVACY POLICY
      </span>

      <a
        href={`mailto:${CONTACT}?subject=Privacy%20request%20—%20Clavis`}
        data-cursor-hover
        className="mono-label inline-flex items-center"
        style={{ color: "rgba(10,10,10,0.7)" }}
      >
        {CONTACT} →
      </a>
    </nav>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function PrivacyFooter() {
  return (
    <footer
      className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-10 py-12"
      style={{
        background: "var(--color-nixe-graphite)",
        color: "var(--color-nixe-pearl)",
        borderTop: "1px solid rgba(245,244,239,0.08)",
      }}
    >
      <div className="flex items-center gap-4">
        <Wordmark dark />
        <span className="mono-label" style={{ color: "rgba(245,244,239,0.4)" }}>
          By NIXE · Privacy Policy
        </span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/clavis"
          data-cursor-hover
          className="mono-label transition-colors duration-200"
          style={{ color: "rgba(245,244,239,0.5)" }}
        >
          ← Back to Clavis
        </Link>
        <Link
          href="/"
          data-cursor-hover
          className="mono-label transition-colors duration-200"
          style={{ color: "rgba(245,244,239,0.5)" }}
        >
          ← Back to NIXE
        </Link>
      </div>
    </footer>
  );
}

// ─── Page export ─────────────────────────────────────────────────────────────
export default function ClavisPrivacyPage() {
  return (
    <>
      <PrivacyNav />

      <main
        className="relative"
        style={{
          background: "var(--color-nixe-paper)",
          paddingTop: "clamp(64px, 10vh, 120px)",
          paddingBottom: "clamp(80px, 12vh, 160px)",
        }}
      >
        <div className="px-6 md:px-10 max-w-[820px] mx-auto">
          {/* Header */}
          <header className="mb-14 md:mb-20">
            <div className="mono-label mb-5" style={{ color: "rgba(10,10,10,0.55)" }}>
              CLAVIS · LEGAL
            </div>
            <h1
              className="text-nixe-ink uppercase mb-8"
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
              }}
            >
              Privacy Policy
            </h1>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
              <div>
                <span className="mono-label mr-2" style={{ color: "rgba(10,10,10,0.5)" }}>
                  EFFECTIVE
                </span>
                <span className="mono-label" style={{ color: "var(--color-nixe-ink)" }}>
                  {EFFECTIVE}
                </span>
              </div>
              <div>
                <span className="mono-label mr-2" style={{ color: "rgba(10,10,10,0.5)" }}>
                  LAST UPDATED
                </span>
                <span className="mono-label" style={{ color: "var(--color-nixe-ink)" }}>
                  {UPDATED}
                </span>
              </div>
            </div>

            <p style={{ ...bodyStyle, fontSize: "1.05rem" }}>
              This Privacy Policy describes how <strong>NIXE Labs</strong> (&ldquo;NIXE
              Labs&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a sole
              proprietorship operated by Harish Sivaram, collects, uses, and protects
              information in the <strong>Clavis</strong> hotel operating system — the Clavis
              web application, mobile apps, WhatsApp interfaces and related backend services
              (together, the &ldquo;Service&rdquo;).
            </p>
            <p className="mt-4" style={bodyStyle}>
              Clavis is sold to and used by hotels. This means we act in two different roles
              depending on the data — see Section 1. If you have any questions, contact us at{" "}
              <a
                href={`mailto:${CONTACT}`}
                data-cursor-hover
                className="border-b transition-colors"
                style={{ color: "var(--color-nixe-ink)", borderColor: "rgba(10,10,10,0.3)" }}
              >
                {CONTACT}
              </a>
              .
            </p>
          </header>

          {/* §1 */}
          <Section num="01" title="Who we are, and our two roles" id="roles">
            <p style={bodyStyle}>
              For the purposes of the EU/UK General Data Protection Regulation (GDPR), the
              California Consumer Privacy Act (CCPA/CPRA), and India&rsquo;s Digital Personal
              Data Protection Act, 2023 (DPDP Act), <strong>NIXE Labs</strong> (sole
              proprietor: Harish Sivaram) operates Clavis. Our responsibility depends on
              whose data it is:
            </p>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>
                <strong>We are the controller</strong> of the data belonging to the hotel and
                its staff who hold Clavis accounts — for example, the account and billing
                details of the hotel and the login profiles of owners, managers and staff.
              </li>
              <li>
                <strong>We are a processor</strong> of the data a hotel&rsquo;s guests
                generate — for example, guest profiles, bookings, folios, ID documents and
                messages. Here the <strong>hotel is the controller</strong>, and we process
                that data only on the hotel&rsquo;s documented instructions to provide the
                Service. See Section 8.
              </li>
            </ul>
            <ul className="list-none mt-2 flex flex-col gap-2" style={{ ...captionStyle, color: "rgba(10,10,10,0.7)" }}>
              <li>
                <span className="mono-label mr-2" style={{ color: "rgba(10,10,10,0.5)" }}>
                  CONTACT
                </span>
                {CONTACT}
              </li>
              <li>
                <span className="mono-label mr-2" style={{ color: "rgba(10,10,10,0.5)" }}>
                  PRODUCT
                </span>
                Clavis — hotel operating system
              </li>
            </ul>
          </Section>

          {/* §2 */}
          <Section num="02" title="Information we collect" id="data-collected">
            <p style={bodyStyle}>
              We collect only the information needed to run Clavis. We do <strong>not</strong>{" "}
              sell personal data, and we do <strong>not</strong> use it for advertising.
            </p>

            <h3 className="mt-2" style={subHeaderStyle}>
              2.1 Hotel &amp; staff account data (we are controller)
            </h3>
            <Table
              headers={["Category", "Examples", "Source"]}
              rows={[
                [
                  <strong key="acct">Account &amp; property details</strong>,
                  "Hotel/property name, address, GSTIN, room inventory, rate plans, billing contact",
                  "When you set up your property",
                ],
                [
                  <strong key="staff">Staff user profiles</strong>,
                  "Name, work email, phone, role (owner / manager / front desk / housekeeping / F&B / accountant), password (stored as a hash by our auth provider — we never see it in plain text)",
                  "When accounts are created",
                ],
                [
                  <strong key="hr">HR &amp; payroll data (if you enable it)</strong>,
                  "Employee records, attendance, leave, salary, statutory IDs (PF/ESI/PAN), bank details for payroll",
                  "When you use the HR & Payroll module",
                ],
                [
                  <strong key="bill">Billing data</strong>,
                  "Subscription tier, invoices, payment status",
                  "Your Clavis subscription",
                ],
              ]}
            />

            <h3 className="mt-6" style={subHeaderStyle}>
              2.2 Guest data (we are processor, on the hotel&rsquo;s behalf)
            </h3>
            <Table
              headers={["Category", "Examples", "Source"]}
              rows={[
                [
                  <strong key="gp">Guest profiles</strong>,
                  "Name, contact number, email, nationality, preferences (room, floor, diet), stay history",
                  "Bookings, check-in, prior stays",
                ],
                [
                  <strong key="id">Identity documents</strong>,
                  "ID type and number (Aadhaar / passport / driving licence), and — for foreign nationals — the data required for Form C / the digital C-register",
                  "Captured at check-in by the hotel, as required by law",
                ],
                [
                  <strong key="res">Reservations &amp; folios</strong>,
                  "Booking dates, room, rate, channel/OTA source, charges for room, F&B, laundry, minibar, travel desk, banquets",
                  "During the guest's stay",
                ],
                [
                  <strong key="pay">Payment records</strong>,
                  "Amount, method, status, and references — card details are handled by our payment processor and are not stored by Clavis",
                  "Payments and checkout",
                ],
                [
                  <strong key="msg">Guest messages</strong>,
                  "WhatsApp and in-app messages between the guest, hotel staff and the Clavis AI",
                  "Guest communication",
                ],
              ]}
            />

            <h3 className="mt-6" style={subHeaderStyle}>
              2.3 Information collected automatically
            </h3>
            <Table
              headers={["Category", "Examples", "Purpose"]}
              rows={[
                [
                  <strong key="auth">Authentication tokens</strong>,
                  "Session and refresh tokens kept on your device/browser",
                  "Keeping you signed in",
                ],
                [
                  <strong key="audit">Activity &amp; audit logs</strong>,
                  "Who did what and when inside the Service (sign-ins, approvals, changes), timestamps",
                  "Security, accountability and the in-app audit trail",
                ],
                [
                  <strong key="meta">Technical metadata</strong>,
                  "Platform, app/browser version, request timestamps, error diagnostics",
                  "Service operation and troubleshooting",
                ],
              ]}
            />

            <h3 className="mt-6" style={subHeaderStyle}>
              2.4 What we do NOT collect
            </h3>
            <ul className="list-disc pl-6 flex flex-col gap-1" style={bodyStyle}>
              <li>Raw card numbers, CVVs or full bank credentials (these stay with our payment processor)</li>
              <li>Advertising identifiers or cross-app/cross-site tracking data</li>
              <li>Behavioural data sold to or shared with advertising networks</li>
            </ul>
          </Section>

          {/* §3 */}
          <Section num="03" title="How we use information" id="purposes">
            <p style={bodyStyle}>
              We use information for the following purposes (with the GDPR legal basis noted
              in brackets):
            </p>
            <ol className="list-decimal pl-6 flex flex-col gap-3" style={bodyStyle}>
              <li>
                <strong>To provide and operate the Service</strong> — running reservations,
                billing, housekeeping, channels, payroll and messaging. <em>[Performance of contract]</em>
              </li>
              <li>
                <strong>To power Clavis AI</strong> — drafting guest replies, suggesting
                rates, preparing folios, writing the morning briefing (see Section 4).{" "}
                <em>[Performance of contract / legitimate interests]</em>
              </li>
              <li>
                <strong>To send operational messages</strong> — booking confirmations,
                pre-arrival check-in, invoices and staff task notifications via WhatsApp,
                email and push. <em>[Performance of contract]</em>
              </li>
              <li>
                <strong>To meet legal obligations</strong> — GST invoicing and returns,
                Form C / guest-register requirements, statutory payroll filings, and tax
                record-keeping. <em>[Legal obligation]</em>
              </li>
              <li>
                <strong>To protect security</strong> — auditing access, detecting abuse and
                rate-limiting. <em>[Legitimate interests / legal obligation]</em>
              </li>
              <li>
                <strong>To support and improve the Service</strong> — responding to support
                requests and fixing problems. <em>[Legitimate interests]</em>
              </li>
            </ol>
          </Section>

          {/* §4 */}
          <Section num="04" title="The Clavis AI" id="ai">
            <p style={bodyStyle}>
              Clavis includes AI agents that read your operational data to draft replies,
              suggest pricing, prepare the night audit and write your morning briefing. A
              few commitments about how that works:
            </p>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>
                <strong>Your data is not used to train third-party foundation models.</strong>{" "}
                We send data to our AI provider only to generate output for you, under terms
                that prohibit using it to train their general models.
              </li>
              <li>
                <strong>A human stays in control.</strong> For anything that materially
                affects a guest or your finances, the AI proposes and a manager approves —
                you set what the AI may do autonomously and within what limits (e.g. price
                floors and ceilings).
              </li>
              <li>
                <strong>Suggestions are clearly marked.</strong> The interface distinguishes
                facts from AI suggestions so staff always know which is which.
              </li>
              <li>
                We do <strong>not</strong> use AI to make decisions producing legal or
                similarly significant effects about a person without human involvement.
              </li>
            </ul>
          </Section>

          {/* §5 */}
          <Section num="05" title="Service providers and international transfers" id="processors">
            <p style={bodyStyle}>
              We share data with the following sub-processors strictly to operate the
              Service. Each is bound by contract to protect it.
            </p>
            <Table
              headers={["Provider", "Purpose", "Data shared"]}
              rows={[
                [
                  <strong key="sb">Supabase Inc.</strong>,
                  "Database, authentication, realtime and file storage",
                  "Account, staff and guest data described in Section 2",
                ],
                [
                  <strong key="rzp">Razorpay</strong>,
                  "Payment processing (cards, UPI, net banking, pay links) and, where enabled, payroll disbursement",
                  "Payment amount, references and the details needed to take payment; card data is handled by Razorpay, not stored by Clavis",
                ],
                [
                  <strong key="meta">Meta Platforms (WhatsApp Cloud API)</strong>,
                  "Sending and receiving guest and staff messages over WhatsApp",
                  "Phone numbers and message content for those conversations",
                ],
                [
                  <strong key="ota">OTA / channel partners</strong>,
                  "Two-way sync of rates, availability and bookings (e.g. Booking.com, MakeMyTrip, Expedia, Agoda)",
                  "Booking and rate/availability data for your property",
                ],
                [
                  <strong key="ai">Our AI provider</strong>,
                  "Generating AI agent output and briefings",
                  "The operational data needed to produce a given response (see Section 4)",
                ],
                [
                  <strong key="host">Cloud hosting provider</strong>,
                  "Running the Clavis backend",
                  "Data in transit and at rest in the hosting region",
                ],
              ]}
            />
            <p style={bodyStyle}>
              We do <strong>not</strong> use third-party advertising or cross-site analytics
              SDKs. Some providers may process data outside your country (for example, in the
              United States or the EU). Where this happens for EU/UK data, we rely on lawful
              transfer mechanisms such as the European Commission&rsquo;s Standard
              Contractual Clauses.
            </p>
          </Section>

          {/* §6 */}
          <Section num="06" title="How long we keep data (retention)" id="retention">
            <p style={bodyStyle}>
              Where the hotel is the controller of guest data, retention is governed by the
              hotel&rsquo;s instructions and by law. As a baseline:
            </p>
            <Table
              headers={["Type of data", "Retention"]}
              rows={[
                ["Hotel & staff account data", "For the life of the account; deleted on request after the account closes"],
                [
                  "Financial, tax & GST records",
                  "Retained for the period required by Indian tax and company law (generally up to 8 years), even after account closure",
                ],
                [
                  "Guest register / Form C data",
                  "Retained for the period required by applicable hospitality and immigration regulations",
                ],
                ["Guest messages & operational data", "Per the hotel's configured retention, then deleted or anonymised"],
                ["Security & audit logs", "Up to 12 months, then deleted"],
                ["Backups", "Routine backups may retain data for up to 30 days before being overwritten"],
              ]}
            />
          </Section>

          {/* §7 */}
          <Section num="07" title="Your rights" id="rights">
            <p style={bodyStyle}>
              Depending on where you live, you have rights over your personal data,
              including the right to <strong>access</strong>, <strong>correct</strong>,{" "}
              <strong>delete</strong>, <strong>port</strong>, and <strong>object to</strong>{" "}
              or <strong>restrict</strong> certain processing, and to{" "}
              <strong>withdraw consent</strong> where we rely on it.
            </p>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>
                <strong>EU/UK (GDPR):</strong> you may also lodge a complaint with your local
                supervisory authority.
              </li>
              <li>
                <strong>California (CCPA/CPRA):</strong> rights to know, delete, correct, and
                non-discrimination. We do <strong>not</strong> &ldquo;sell&rdquo; or
                &ldquo;share&rdquo; personal information as those terms are defined.
              </li>
              <li>
                <strong>India (DPDP Act, 2023):</strong> rights to access, correction and
                erasure, grievance redressal, and to nominate another individual to exercise
                your rights.
              </li>
            </ul>
            <p style={bodyStyle}>
              If you are a <strong>hotel guest</strong>, the hotel is the controller of your
              data — please direct your request to the hotel, and we will assist them as
              their processor. For hotel and staff account data, email{" "}
              <a
                href={`mailto:${CONTACT}?subject=Privacy%20request%20—%20Clavis`}
                data-cursor-hover
                className="border-b transition-colors"
                style={{ color: "var(--color-nixe-ink)", borderColor: "rgba(10,10,10,0.3)" }}
              >
                {CONTACT}
              </a>
              . We respond within <strong>30 days</strong>.
            </p>
          </Section>

          {/* §8 */}
          <Section num="08" title="Guest data and the hotel's responsibility" id="processor">
            <p style={bodyStyle}>
              When a hotel uses Clavis to process its guests&rsquo; data, the hotel is the{" "}
              <strong>controller</strong> and NIXE Labs is the <strong>processor</strong>. We
              process guest data only:
            </p>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>on the hotel&rsquo;s documented instructions and to provide the Service;</li>
              <li>under appropriate confidentiality and security obligations;</li>
              <li>with sub-processors that are themselves bound by equivalent terms; and</li>
              <li>returning or deleting guest data at the end of the engagement, except where law requires us to keep it.</li>
            </ul>
            <p style={bodyStyle}>
              Hotels are responsible for collecting guest data lawfully (including giving
              guests appropriate notice and obtaining any required consent) and for using the
              Service in line with this policy.
            </p>
          </Section>

          {/* §9 */}
          <Section num="09" title="Security" id="security">
            <p style={bodyStyle}>We protect data using, among other measures:</p>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li><strong>Encryption in transit</strong> — all connections use HTTPS/TLS.</li>
              <li><strong>Encryption at rest</strong> — data stored in our database is encrypted at rest.</li>
              <li>
                <strong>Role-based access &amp; row-level security</strong> — staff see only
                what their role and property allow; tenants are isolated from one another.
              </li>
              <li><strong>Audit logging</strong> — security-relevant events are logged for monitoring.</li>
              <li><strong>Rate limiting</strong> — repeated failed sign-ins trigger a temporary lockout.</li>
            </ul>
            <p style={bodyStyle}>
              No system is 100% secure. If we become aware of a breach affecting personal
              data, we will notify affected controllers and the relevant authorities as
              required by law.
            </p>
          </Section>

          {/* §10 */}
          <Section num="10" title="WhatsApp and guest messaging" id="whatsapp">
            <p style={bodyStyle}>
              Clavis uses the WhatsApp Business (Meta Cloud API) to send and receive guest
              and staff messages — pre-arrival check-in links, confirmations, invoices, room
              service and task updates. Message content and phone numbers for those
              conversations are processed by Meta in order to deliver them. Standard WhatsApp
              terms and Meta&rsquo;s own policies apply to the WhatsApp service itself. Guests
              can opt out of non-essential messages at any time.
            </p>
          </Section>

          {/* §11 */}
          <Section num="11" title="Children's privacy" id="children">
            <p style={bodyStyle}>
              Clavis is a business tool intended for use by hotel staff and is not directed
              at children. We do not knowingly collect personal data directly from children
              through the staff-facing Service. Where a guest record relates to a minor (for
              example, a child included on a booking), that data is provided and controlled
              by the hotel.
            </p>
          </Section>

          {/* §12 */}
          <Section num="12" title="Cookies and tracking technologies" id="cookies">
            <p style={bodyStyle}>
              The Clavis web application uses only essential cookies and similar technologies
              required to keep you signed in and to operate the Service securely. We do not
              use advertising cookies and we do not track you across other apps or websites.
            </p>
          </Section>

          {/* §13 */}
          <Section num="13" title="Changes to this policy" id="changes">
            <p style={bodyStyle}>We may update this Privacy Policy from time to time. When we do, we will:</p>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>
                Update the <strong>&ldquo;Last updated&rdquo;</strong> date at the top of this page.
              </li>
              <li>
                For material changes (e.g. a new sub-processor or new category of data),
                notify hotels via the Service or by email.
              </li>
            </ul>
            <p style={bodyStyle}>
              Continued use of Clavis after the effective date of an updated policy
              constitutes acceptance of the changes.
            </p>
          </Section>

          {/* §14 */}
          <Section num="14" title="Contact us" id="contact">
            <p style={bodyStyle}>
              If you have questions, complaints, or requests relating to your privacy or this
              policy:
            </p>
            <div
              className="p-6 mt-2"
              style={{
                background: "var(--color-nixe-bone)",
                border: "1px solid rgba(10,10,10,0.08)",
                borderRadius: 16,
              }}
            >
              <div className="mono-label mb-2" style={{ color: "rgba(10,10,10,0.55)" }}>
                NIXE LABS
              </div>
              <p style={{ ...bodyStyle, marginBottom: 8 }}>
                Email:{" "}
                <a
                  href={`mailto:${CONTACT}?subject=Privacy%20request%20—%20Clavis`}
                  data-cursor-hover
                  className="border-b transition-colors"
                  style={{ color: "var(--color-nixe-ink)", borderColor: "rgba(10,10,10,0.3)" }}
                >
                  {CONTACT}
                </a>
              </p>
              <p style={captionStyle}>
                Subject line for privacy requests: <em>&ldquo;Privacy request — Clavis&rdquo;</em>
              </p>
            </div>
            <p style={bodyStyle}>
              We aim to respond within <strong>7 days</strong> for general queries and within{" "}
              <strong>30 days</strong> for formal rights requests.
            </p>
          </Section>

          {/* Closing disclaimer */}
          <div className="mt-16 pt-10 border-t" style={{ borderColor: "rgba(10,10,10,0.1)" }}>
            <p style={{ ...captionStyle, fontStyle: "italic" }}>
              Clavis is in pre-launch. This policy is provided in good faith and is intended
              to align with the GDPR, UK GDPR, CCPA/CPRA, and India&rsquo;s DPDP Act, 2023.
              It is not legal advice and will be finalised before general availability. When
              NIXE Labs operates Clavis under a registered legal entity, Sections 1 and 14
              will be updated with the registered name and address.
            </p>
          </div>
        </div>
      </main>

      <PrivacyFooter />
    </>
  );
}
