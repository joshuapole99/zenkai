import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Zenkai",
  description: "How Zenkai collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <Link href="/" className="font-black text-lg tracking-tight gradient-text">ZENKAI</Link>
        <Link href="/" className="text-xs text-gray-500 hover:text-white transition-colors">Back to home</Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#FF6B35" }}>Legal</p>
          <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: April 2026</p>
        </div>

        <div className="space-y-10 text-sm text-gray-400 leading-relaxed">
          <Section title="1. Who we are">
            Zenkai (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a fitness application that helps you train
            consistently through gamified daily quests and character progression. We are committed to
            protecting your personal data and being transparent about how we use it.
          </Section>

          <Section title="2. Data we collect">
            When you use Zenkai, we collect the following data:
            <ul className="mt-3 space-y-2 pl-4">
              <Item>Email address — used to identify your account and send transactional messages.</Item>
              <Item>Username and character name — used to personalize your in-app experience.</Item>
              <Item>Fitness data — quest completions, XP, streaks, food check responses. Used to power your character progression.</Item>
              <Item>Onboarding choices — character class, goal, and fitness level. Used to calibrate daily quests.</Item>
            </ul>
            <p className="mt-3">We do not collect any health data beyond what you voluntarily log inside the app.</p>
          </Section>

          <Section title="3. How we use your data">
            Your data is used exclusively to:
            <ul className="mt-3 space-y-2 pl-4">
              <Item>Provide and improve the Zenkai service.</Item>
              <Item>Personalize your quests and character experience.</Item>
              <Item>Send you account-related emails (e.g. password resets).</Item>
              <Item>Analyze usage patterns in aggregate to improve product features.</Item>
            </ul>
            <p className="mt-3">We never sell your data to third parties. We never use your data for advertising.</p>
          </Section>

          <Section title="4. Data storage">
            Your data is stored in a secure PostgreSQL database hosted on Neon. All data is encrypted
            in transit via HTTPS. Passwords are hashed using bcrypt and are never stored in plain text.
          </Section>

          <Section title="5. Cookies">
            We use a single HTTP-only cookie to maintain your login session. This cookie contains a
            signed JWT token and expires after 7 days. We do not use tracking cookies or third-party
            analytics cookies.
          </Section>

          <Section title="6. Your rights">
            You have the right to:
            <ul className="mt-3 space-y-2 pl-4">
              <Item>Access the personal data we hold about you.</Item>
              <Item>Request correction of inaccurate data.</Item>
              <Item>Request deletion of your account and all associated data.</Item>
              <Item>Withdraw consent at any time by deleting your account.</Item>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:privacy@zenkai.app" className="text-white hover:underline">privacy@zenkai.app</a>.
            </p>
          </Section>

          <Section title="7. Third-party services">
            Zenkai uses the following third-party services:
            <ul className="mt-3 space-y-2 pl-4">
              <Item>Neon — database hosting (your data is stored here).</Item>
              <Item>Vercel — application hosting and deployment.</Item>
              <Item>Lemon Squeezy — payment processing (only if you subscribe).</Item>
            </ul>
            Each service operates under its own privacy policy and data protection standards.
          </Section>

          <Section title="8. Children">
            Zenkai is not directed at children under the age of 13. We do not knowingly collect
            data from children. If you believe a child has created an account, contact us at
            privacy@zenkai.app and we will delete it promptly.
          </Section>

          <Section title="9. Changes to this policy">
            We may update this policy from time to time. When we do, we will update the date at
            the top of this page. Continued use of Zenkai after changes constitutes acceptance
            of the updated policy.
          </Section>

          <Section title="10. Contact">
            For any privacy-related questions:
            <br />
            <a href="mailto:privacy@zenkai.app" className="text-white hover:underline">privacy@zenkai.app</a>
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-bold text-white mb-3">{title}</h2>
      <div>{children}</div>
    </div>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span style={{ color: "#FF6B35" }} className="flex-shrink-0 mt-0.5">—</span>
      <span>{children}</span>
    </li>
  );
}

function Footer() {
  return (
    <footer className="border-t py-8 px-6 mt-16" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-700">© 2026 Zenkai. Every setback makes you stronger.</p>
        <div className="flex gap-5 text-xs">
          <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
