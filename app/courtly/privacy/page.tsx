import Link from "next/link";

const EFFECTIVE = "7 May 2026";
const UPDATED = "7 May 2026";
const CONTACT = "nixe.cxt@gmail.com";

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
    <section
      id={id}
      className="border-t pt-10 md:pt-14"
      style={{ borderColor: "rgba(10,10,10,0.1)" }}
    >
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
function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: (React.ReactNode | string)[][];
}) {
  return (
    <div
      className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0"
      style={{ scrollbarWidth: "thin" }}
    >
      <table
        className="w-full text-left border-collapse"
        style={{
          fontSize: "0.92rem",
          minWidth: 560,
        }}
      >
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
                <td
                  key={j}
                  className="py-4 pr-4 align-top"
                  style={{ color: "rgba(10,10,10,0.78)", lineHeight: 1.55 }}
                >
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

// ─── Top nav (server-rendered, no scroll listener — keeps it static + simple) ─
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
        href="/courtly"
        data-cursor-hover
        className="mono-label inline-flex items-center"
        style={{ color: "rgba(10,10,10,0.7)" }}
      >
        ← COURTLY
      </Link>

      <span className="mono-label hidden sm:block" style={{ color: "rgba(10,10,10,0.45)" }}>
        PRIVACY POLICY
      </span>

      <a
        href={`mailto:${CONTACT}?subject=Privacy%20request%20—%20Courtly`}
        data-cursor-hover
        className="mono-label inline-flex items-center"
        style={{ color: "rgba(10,10,10,0.7)" }}
      >
        {CONTACT} →
      </a>
    </nav>
  );
}

// ─── Footer (matches the Courtly footer pattern) ─────────────────────────────
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
        <span
          className="select-none tracking-[0.12em]"
          style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: "1.1rem",
            fontWeight: 800,
          }}
        >
          COURTLY
        </span>
        <span className="mono-label" style={{ color: "rgba(245,244,239,0.4)" }}>
          By NIXE · Privacy Policy
        </span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/courtly"
          data-cursor-hover
          className="mono-label transition-colors duration-200"
          style={{ color: "rgba(245,244,239,0.5)" }}
        >
          ← Back to Courtly
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
export default function CourtlyPrivacyPage() {
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
              COURTLY · LEGAL
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
              proprietorship operated by Harish Sivaram, collects, uses, and shares
              information when you use the <strong>Courtly</strong> mobile application (the
              &ldquo;App&rdquo;) and related backend services (together, the &ldquo;Service&rdquo;).
            </p>
            <p className="mt-4" style={bodyStyle}>
              If you have any questions, contact us at{" "}
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
          <Section num="01" title="Who we are (Data Controller)" id="controller">
            <p style={bodyStyle}>
              For the purposes of the EU/UK General Data Protection Regulation (GDPR), the
              California Consumer Privacy Act (CCPA/CPRA), and India&rsquo;s Digital
              Personal Data Protection Act, 2023 (DPDP Act), <strong>NIXE Labs</strong>{" "}
              (sole proprietor: Harish Sivaram) is the data controller responsible for
              your personal data.
            </p>
            <ul
              className="list-none mt-2 flex flex-col gap-2"
              style={{ ...captionStyle, color: "rgba(10,10,10,0.7)" }}
            >
              <li>
                <span className="mono-label mr-2" style={{ color: "rgba(10,10,10,0.5)" }}>
                  CONTACT
                </span>
                {CONTACT}
              </li>
              <li>
                <span className="mono-label mr-2" style={{ color: "rgba(10,10,10,0.5)" }}>
                  BUNDLE ID
                </span>
                nixelabs.Courtly
              </li>
            </ul>
          </Section>

          {/* §2 */}
          <Section num="02" title="Information we collect" id="data-collected">
            <p style={bodyStyle}>
              We collect only the information needed to operate Courtly. We do{" "}
              <strong>not</strong> sell your personal data, and we do <strong>not</strong>{" "}
              use it for advertising.
            </p>

            <h3 className="mt-2" style={subHeaderStyle}>
              2.1 Information you provide
            </h3>
            <Table
              headers={["Category", "Examples", "Source"]}
              rows={[
                [
                  <strong key="acct">Account information</strong>,
                  "Email address, password (stored as a hash by our auth provider — we never see it in plain text), display name",
                  "When you sign up",
                ],
                [
                  <strong key="prof">Profile information</strong>,
                  "Display name, avatar image (optional)",
                  "Profile creation / edits",
                ],
                [
                  <strong key="grp">Group & social data</strong>,
                  "Group names, group memberships, invite codes, friend relationships, friend requests",
                  "When you create or join groups, send/accept friend requests",
                ],
                [
                  <strong key="match">Match records</strong>,
                  "Sport (badminton/tennis/squash), match type, venue, date, duration, scores, players involved, notes you write",
                  "When you log a match",
                ],
                [
                  <strong key="exp">Expense records</strong>,
                  "Expense title, amount, currency, who paid, who owes, split type (equal/unequal/percentage/shares), participant approvals, optional notes",
                  "When you log a shared expense",
                ],
                [
                  <strong key="settle">Settlement records</strong>,
                  "Payer, payee, amount, currency, optional notes (records of who has paid back whom)",
                  "When you mark a settlement",
                ],
                [
                  <strong key="sess">Game session data</strong>,
                  "Group, location, date/time, expected number of players, response deadline, recurring schedule, your RSVP status (in/out/waitlist)",
                  "When you create or respond to sessions",
                ],
              ]}
            />
            <blockquote
              className="border-l-2 pl-4 mt-4"
              style={{
                borderColor: "rgba(10,10,10,0.18)",
                color: "rgba(10,10,10,0.7)",
                fontStyle: "italic",
                fontSize: "0.98rem",
                lineHeight: 1.65,
              }}
            >
              <strong>Courtly does not process real-money payments.</strong> Expense and
              settlement amounts are records of money owed between you and your friends —
              Courtly does not transfer funds, store card details, or facilitate payment
              processing.
            </blockquote>

            <h3 className="mt-6" style={subHeaderStyle}>
              2.2 Information collected automatically
            </h3>
            <Table
              headers={["Category", "Examples", "Purpose"]}
              rows={[
                [
                  <strong key="auth">Authentication tokens</strong>,
                  "JWT access tokens, refresh tokens (stored securely in the iOS Keychain on your device)",
                  "Keeping you signed in",
                ],
                [
                  <strong key="push">Push notification token</strong>,
                  "Apple Push Notification service (APNs) device token",
                  "Sending you notifications about invites, RSVPs, expenses, settlements",
                ],
                [
                  <strong key="stats">Activity statistics (derived)</strong>,
                  "Total matches played, wins/losses, current and longest winning streaks, last match date",
                  "Calculated from your match history to display your stats page",
                ],
                [
                  <strong key="audit">Security audit logs</strong>,
                  "Sign-in events, sign-out events, password reset attempts, failure counts, timestamps",
                  "Detecting suspicious activity and protecting your account",
                ],
                [
                  <strong key="meta">Technical metadata</strong>,
                  "Platform (iOS), app version, request timestamps",
                  "Service operation and troubleshooting",
                ],
              ]}
            />
            <p style={bodyStyle}>
              We do <strong>not</strong> collect: precise or coarse location, contacts,
              photos library, microphone audio, health data, calendar data, advertising
              identifiers (IDFA), or device fingerprints.
            </p>

            <h3 className="mt-6" style={subHeaderStyle}>
              2.3 Information we do NOT collect
            </h3>
            <ul className="list-disc pl-6 flex flex-col gap-1" style={bodyStyle}>
              <li>Real-money payment information (no Stripe, Apple Pay, or in-app purchases)</li>
              <li>Third-party social-media profile data</li>
              <li>Behavioral tracking data for advertising purposes</li>
              <li>Cross-app or cross-website tracking</li>
            </ul>
          </Section>

          {/* §3 */}
          <Section num="03" title="How we use your information" id="purposes">
            <p style={bodyStyle}>
              We use your information for the following purposes (with the GDPR legal
              basis noted in brackets):
            </p>
            <ol className="list-decimal pl-6 flex flex-col gap-3" style={bodyStyle}>
              <li>
                <strong>To provide and operate the Service</strong> — running your account,
                syncing your data, calculating expense splits and statistics. <em>[Performance of contract]</em>
              </li>
              <li>
                <strong>To send notifications</strong> — match invitations, RSVP reminders,
                expense approvals, settlement notifications via APNs. <em>[Performance of contract / your consent at the OS prompt]</em>
              </li>
              <li>
                <strong>To enable group collaboration</strong> — Realtime updates so members
                of your group see new memberships, friendships, and game sessions
                immediately. <em>[Performance of contract]</em>
              </li>
              <li>
                <strong>To protect security</strong> — auditing sign-in events, rate-limiting
                failed login attempts, detecting abuse. <em>[Legitimate interests / legal obligation]</em>
              </li>
              <li>
                <strong>To respond to your requests</strong> — answering support emails,
                fulfilling deletion requests. <em>[Legitimate interests / legal obligation]</em>
              </li>
              <li>
                <strong>To comply with law</strong> — responding to lawful requests from
                authorities. <em>[Legal obligation]</em>
              </li>
            </ol>
            <p style={bodyStyle}>
              We will <strong>not</strong> use your data for automated decision-making that
              produces legal or similarly significant effects.
            </p>
          </Section>

          {/* §4 */}
          <Section num="04" title="Who can see your information (sharing within the App)" id="sharing">
            <p style={bodyStyle}>
              Courtly is a closed-group, invitation-based app. Other people who use Courtly
              may see your information as follows:
            </p>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>
                <strong>Anyone in a group with you</strong> can see: your display name,
                avatar, match history within that group, expenses you create or are a
                participant in, settlements involving you, and game sessions in that group.
              </li>
              <li>
                <strong>Your friends</strong> can see: your display name, avatar, and that
                you are friends with them.
              </li>
              <li>
                <strong>People you invite</strong> can see: your display name and the
                invite code you sent them.
              </li>
              <li>
                <strong>Group owners</strong> can see and remove members of groups they own.
              </li>
            </ul>
            <p style={bodyStyle}>
              Information you put into a free-text field (such as expense notes, match
              notes, or session location) will be visible to everyone in the relevant
              group. Do not put sensitive personal information in these fields.
            </p>
          </Section>

          {/* §5 */}
          <Section num="05" title="Service providers and international transfers" id="processors">
            <p style={bodyStyle}>
              We share data with the following third-party processors strictly to operate
              the Service:
            </p>
            <Table
              headers={["Provider", "Purpose", "Data shared", "Where data is processed"]}
              rows={[
                [
                  <strong key="sb">Supabase Inc.</strong>,
                  "Database, authentication, realtime, storage. All app data is stored and processed by Supabase.",
                  "All categories listed in Section 2",
                  "The Supabase region you have configured (please refer to our Supabase project for the specific region)",
                ],
                [
                  <strong key="apns">Apple Inc. — APNs</strong>,
                  "Delivering push notifications to your device",
                  "Push token + notification payload (e.g., “Alex invited you to a match”)",
                  "Apple infrastructure",
                ],
                [
                  <strong key="host">Backend hosting provider</strong>,
                  "Running the Courtly API server (e.g., Railway, Fly.io, or Render)",
                  "API requests + responses in transit",
                  "Provider's region",
                ],
              ]}
            />
            <p style={bodyStyle}>
              We do <strong>not</strong> use third-party analytics SDKs (no Google
              Analytics, Firebase Analytics, Mixpanel, Amplitude, Sentry, or similar) and
              we do <strong>not</strong> share data with advertising networks.
            </p>
            <p style={bodyStyle}>
              If you are located in the EU/UK, your data may be transferred to and
              processed in countries outside the European Economic Area (such as the
              United States). Where this happens, we rely on lawful transfer mechanisms
              such as the European Commission&rsquo;s Standard Contractual Clauses or an
              adequacy decision.
            </p>
          </Section>

          {/* §6 */}
          <Section num="06" title="How long we keep your data (retention)" id="retention">
            <Table
              headers={["Type of data", "Retention"]}
              rows={[
                ["Account profile, groups, friendships", "Until you request deletion"],
                [
                  "Matches and expenses you delete",
                  "Soft-deleted with a timestamp; permanently purged on account deletion",
                ],
                [
                  "Push notification tokens",
                  "Until you sign out, uninstall the app, or revoke notification permission",
                ],
                ["Security audit logs", "Up to 12 months, then deleted"],
                [
                  "Backups",
                  "Routine database backups may retain data for up to 30 days after deletion before being overwritten",
                ],
              ]}
            />
          </Section>

          {/* §7 */}
          <Section num="07" title="Your rights" id="rights">
            <p style={bodyStyle}>
              Depending on where you live, you have the following rights over your
              personal data:
            </p>

            <h3 className="mt-2" style={subHeaderStyle}>
              7.1 Everyone
            </h3>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li><strong>Access</strong> — Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction</strong> — Update inaccurate information (you can edit most of it yourself in the App).</li>
              <li><strong>Deletion</strong> — Request that we delete your account and personal data (see Section 8).</li>
              <li><strong>Withdraw consent</strong> — Where we rely on your consent (e.g., push notifications), you can withdraw it via iOS Settings.</li>
            </ul>

            <h3 className="mt-4" style={subHeaderStyle}>
              7.2 EU/UK additional rights
            </h3>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>Right to <strong>data portability</strong> (receive your data in a machine-readable format)</li>
              <li>Right to <strong>restrict</strong> or <strong>object</strong> to certain processing</li>
              <li>Right to lodge a complaint with your local <strong>supervisory authority</strong> (e.g., the UK ICO, the Irish DPC, or your national DPA)</li>
            </ul>

            <h3 className="mt-4" style={subHeaderStyle}>
              7.3 California (CCPA/CPRA) additional rights
            </h3>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>Right to know what personal information is collected, used, shared, or sold</li>
              <li>Right to delete personal information</li>
              <li>Right to <strong>non-discrimination</strong> for exercising your rights</li>
              <li>We <strong>do not &ldquo;sell&rdquo; or &ldquo;share&rdquo; personal information</strong> as those terms are defined under the CCPA</li>
            </ul>

            <h3 className="mt-4" style={subHeaderStyle}>
              7.4 India (DPDP Act, 2023) additional rights
            </h3>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>Right to access, correction, and erasure of your personal data</li>
              <li>Right to grievance redressal — contact us at {CONTACT}</li>
              <li>Right to nominate another individual to exercise your rights in the event of your death or incapacity</li>
            </ul>

            <p className="mt-4" style={bodyStyle}>
              To exercise any of these rights, email{" "}
              <a
                href={`mailto:${CONTACT}?subject=Privacy%20request%20—%20Courtly`}
                data-cursor-hover
                className="border-b transition-colors"
                style={{ color: "var(--color-nixe-ink)", borderColor: "rgba(10,10,10,0.3)" }}
              >
                {CONTACT}
              </a>
              . We will verify your identity (typically by confirming you control the
              email on the account) and respond within <strong>30 days</strong>.
            </p>
          </Section>

          {/* §8 */}
          <Section num="08" title="Account deletion" id="deletion">
            <p style={bodyStyle}>
              We do not yet provide an in-app account deletion button. To delete your
              account and associated personal data:
            </p>
            <ol className="list-decimal pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>
                Email{" "}
                <a
                  href={`mailto:${CONTACT}?subject=Delete%20my%20Courtly%20account`}
                  data-cursor-hover
                  className="border-b transition-colors"
                  style={{ color: "var(--color-nixe-ink)", borderColor: "rgba(10,10,10,0.3)" }}
                >
                  {CONTACT}
                </a>{" "}
                from the email address registered to your Courtly account.
              </li>
              <li>
                Include the subject line <strong>&ldquo;Delete my Courtly account&rdquo;</strong>.
              </li>
              <li>
                We will verify your identity and delete your account within{" "}
                <strong>30 days</strong> of your request.
              </li>
            </ol>

            <p className="mt-2" style={bodyStyle}>When you delete your account:</p>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>
                Your profile, friendships, group memberships, push tokens, and security
                logs are permanently deleted.
              </li>
              <li>
                Your matches, expenses, and settlements that involve other group members
                will be <strong>anonymised</strong> rather than deleted, because deleting
                them would alter records (e.g., who-owes-whom) for other users who relied
                on them. Anonymised records will show &ldquo;Deleted user&rdquo; in place
                of your name.
              </li>
              <li>
                Backups containing your data are overwritten on a rolling basis (within
                30 days).
              </li>
            </ul>
            <p style={bodyStyle}>
              Apple App Store policy requires us to offer this deletion path; we honour it.
            </p>
          </Section>

          {/* §9 */}
          <Section num="09" title="Children's privacy" id="children">
            <p style={bodyStyle}>
              Courtly is not directed at children under <strong>13</strong> years of age.
              We do not knowingly collect personal information from children under 13. If
              you are a parent or guardian and believe your child has provided us with
              personal data, please contact{" "}
              <a
                href={`mailto:${CONTACT}`}
                data-cursor-hover
                className="border-b transition-colors"
                style={{ color: "var(--color-nixe-ink)", borderColor: "rgba(10,10,10,0.3)" }}
              >
                {CONTACT}
              </a>{" "}
              and we will delete it.
            </p>
            <p style={bodyStyle}>
              If you are between 13 and 18 (or the age of majority where you live), please
              use Courtly only with the involvement of a parent or guardian.
            </p>
          </Section>

          {/* §10 */}
          <Section num="10" title="Security" id="security">
            <p style={bodyStyle}>We protect your data using:</p>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>
                <strong>Encryption in transit</strong> — All connections to the App and
                backend use HTTPS/TLS. Connections that are not HTTPS are rejected by the
                App.
              </li>
              <li>
                <strong>Encryption at rest</strong> — Data stored in Supabase is encrypted
                at rest.
              </li>
              <li>
                <strong>Authentication</strong> — Industry-standard JWT tokens stored in
                the iOS Keychain.
              </li>
              <li>
                <strong>Row-Level Security</strong> — Database-level access controls so
                users can only read/write their own data and data shared with their groups.
              </li>
              <li>
                <strong>Rate limiting</strong> — Repeated failed login attempts trigger a
                temporary lockout.
              </li>
              <li>
                <strong>Audit logs</strong> — Sign-in and security events are logged for
                monitoring.
              </li>
            </ul>
            <p style={bodyStyle}>
              No system is 100% secure. If we become aware of a data breach affecting your
              personal data, we will notify you and the relevant authorities as required
              by law.
            </p>
          </Section>

          {/* §11 */}
          <Section num="11" title="Push notifications" id="push">
            <p style={bodyStyle}>
              We send push notifications via APNs for events such as group invites, RSVP
              responses, expense approvals, and settlement updates. You can disable push
              notifications at any time via{" "}
              <strong>iOS Settings → Notifications → Courtly</strong>. Doing so will not
              affect your ability to use the rest of the App.
            </p>
          </Section>

          {/* §12 */}
          <Section num="12" title="Cookies and tracking technologies" id="cookies">
            <p style={bodyStyle}>
              The Courtly iOS app does not use cookies or web tracking technologies. We do
              not use the iOS Advertising Identifier (IDFA) and we have not implemented
              Apple&rsquo;s App Tracking Transparency (ATT) prompt because we do not track
              you across other apps or websites.
            </p>
          </Section>

          {/* §13 */}
          <Section num="13" title="Changes to this policy" id="changes">
            <p style={bodyStyle}>We may update this Privacy Policy from time to time. When we do, we will:</p>
            <ul className="list-disc pl-6 flex flex-col gap-2" style={bodyStyle}>
              <li>
                Update the <strong>&ldquo;Last updated&rdquo;</strong> date at the top of
                this page.
              </li>
              <li>
                For material changes (e.g., new categories of data collection, new
                third-party processors), notify you via the App or by email.
              </li>
            </ul>
            <p style={bodyStyle}>
              Continued use of Courtly after the effective date of an updated policy
              constitutes your acceptance of the changes.
            </p>
          </Section>

          {/* §14 */}
          <Section num="14" title="Contact us" id="contact">
            <p style={bodyStyle}>
              If you have questions, complaints, or requests relating to your privacy or
              this policy:
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
                  href={`mailto:${CONTACT}?subject=Privacy%20request%20—%20Courtly`}
                  data-cursor-hover
                  className="border-b transition-colors"
                  style={{ color: "var(--color-nixe-ink)", borderColor: "rgba(10,10,10,0.3)" }}
                >
                  {CONTACT}
                </a>
              </p>
              <p style={captionStyle}>
                Subject line for privacy requests:{" "}
                <em>&ldquo;Privacy request — Courtly&rdquo;</em>
              </p>
            </div>
            <p style={bodyStyle}>
              We aim to respond within <strong>7 days</strong> for general queries and
              within <strong>30 days</strong> for formal rights requests.
            </p>
          </Section>

          {/* Closing disclaimer */}
          <div
            className="mt-16 pt-10 border-t"
            style={{
              borderColor: "rgba(10,10,10,0.1)",
            }}
          >
            <p style={{ ...captionStyle, fontStyle: "italic" }}>
              This policy is provided in good faith and is intended to comply with the
              GDPR, UK GDPR, CCPA/CPRA, and India&rsquo;s DPDP Act, 2023. It is not legal
              advice. If you operate Courtly under a registered legal entity in the
              future, update Sections 1 and 14 with the registered name and address.
            </p>
          </div>
        </div>
      </main>

      <PrivacyFooter />
    </>
  );
}
