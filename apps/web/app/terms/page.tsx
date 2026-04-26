import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Zenkai",
  description: "Terms and conditions for using the Zenkai fitness app.",
};

export default function TermsPage() {
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
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#7C3AED" }}>Legal</p>
          <h1 className="text-3xl font-black text-white">Terms of Service</h1>
          <p className="text-sm text-gray-500 mt-2">Last updated: April 2026</p>
        </div>

        <div className="space-y-10 text-sm text-gray-400 leading-relaxed">
          <Section title="1. Acceptance of terms">
            By creating a Zenkai account or using our service, you agree to these Terms of Service.
            If you do not agree, do not use Zenkai. These terms apply to all users of the application,
            including free trial users and paying subscribers.
          </Section>

          <Section title="2. Description of service">
            Zenkai is a fitness gamification application that provides:
            <ul className="mt-3 space-y-2 pl-4">
              <Item>Daily workout quests tailored to your fitness level.</Item>
              <Item>A character progression system (XP, levels, streaks).</Item>
              <Item>A Zenkai Boost mechanic — comeback quests for users who fall off track.</Item>
              <Item>Food check and HP logging tools.</Item>
            </ul>
            <p className="mt-3">
              Zenkai is not a medical service. Content is for general fitness purposes only and does
              not constitute medical advice. Always consult a healthcare professional before beginning
              any exercise program.
            </p>
          </Section>

          <Section title="3. Account responsibilities">
            You are responsible for:
            <ul className="mt-3 space-y-2 pl-4">
              <Item>Keeping your login credentials secure.</Item>
              <Item>All activity that occurs under your account.</Item>
              <Item>Providing accurate information during signup and onboarding.</Item>
              <Item>Using Zenkai only for lawful, personal purposes.</Item>
            </ul>
            <p className="mt-3">
              You may not create accounts for others without their consent, or use automated tools
              to access the service.
            </p>
          </Section>

          <Section title="4. Free trial and subscription">
            <p>
              Zenkai offers a 7-day free trial with full access to all features. After the trial,
              continued access requires a paid subscription at €4.99 per month.
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              <Item>Payments are processed by Lemon Squeezy, our payment provider.</Item>
              <Item>Subscriptions renew automatically unless cancelled before the renewal date.</Item>
              <Item>You may cancel at any time from your account settings.</Item>
              <Item>Refunds are handled on a case-by-case basis. Contact support@zenkai.app.</Item>
            </ul>
          </Section>

          <Section title="5. Acceptable use">
            You agree not to:
            <ul className="mt-3 space-y-2 pl-4">
              <Item>Attempt to reverse-engineer, hack, or disrupt the Zenkai service.</Item>
              <Item>Upload harmful, offensive, or illegal content.</Item>
              <Item>Impersonate other users or Zenkai staff.</Item>
              <Item>Use the service in any way that violates applicable law.</Item>
            </ul>
            <p className="mt-3">
              Violation of these terms may result in immediate account termination without refund.
            </p>
          </Section>

          <Section title="6. Health disclaimer">
            Zenkai provides workout suggestions for general fitness purposes. These suggestions:
            <ul className="mt-3 space-y-2 pl-4">
              <Item>Are not personalized medical advice.</Item>
              <Item>Should be adapted to your own physical ability and health conditions.</Item>
              <Item>Are performed entirely at your own risk.</Item>
            </ul>
            <p className="mt-3">
              Zenkai is not liable for any injury, illness, or harm that may result from following
              workout suggestions provided by the app.
            </p>
          </Section>

          <Section title="7. Intellectual property">
            All content within Zenkai — including the name, design, code, and character system —
            is the property of Zenkai. You may not reproduce, distribute, or create derivative works
            without written permission.
          </Section>

          <Section title="8. Termination">
            We reserve the right to suspend or terminate your account if you violate these terms,
            engage in fraudulent activity, or if we discontinue the service. You may delete your
            account at any time. Upon deletion, your data will be removed within 30 days.
          </Section>

          <Section title="9. Limitation of liability">
            To the maximum extent permitted by law, Zenkai shall not be liable for any indirect,
            incidental, or consequential damages arising from your use of the service. Our total
            liability shall not exceed the amount you paid to us in the past 12 months.
          </Section>

          <Section title="10. Changes to these terms">
            We may update these terms at any time. When we do, we will update the date at the top
            of this page. Continued use of Zenkai after changes constitutes acceptance of the
            updated terms.
          </Section>

          <Section title="11. Contact">
            For questions about these terms:
            <br />
            <a href="mailto:support@zenkai.app" className="text-white hover:underline">support@zenkai.app</a>
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
      <span style={{ color: "#7C3AED" }} className="flex-shrink-0 mt-0.5">—</span>
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
