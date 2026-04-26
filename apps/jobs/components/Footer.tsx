'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { T } from '@/lib/i18n';

function ZMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={Math.round(size * 44 / 36)} height={size} viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="44" height="6" fill="#F5F3EC" />
      <polygon points="44,6 44,13 6,30 0,30 0,23 38,6" fill="#F5F3EC" />
      <rect x="0" y="30" width="44" height="6" fill="#F5F3EC" />
    </svg>
  );
}

const PLATFORM = [
  { label: 'Scan',    href: 'https://scan.zenkai.nl' },
  { label: 'Goals',   href: 'https://goals.zenkai.nl' },
  { label: 'Job',     href: 'https://job.zenkai.nl' },
  { label: 'Workout', href: 'https://workout.zenkai.nl' },
];

export default function Footer() {
  const { lang } = useLanguage();
  const t = T[lang];

  return (
    <footer style={{ background: '#0F0E0E', padding: '48px 32px 32px', fontFamily: "'IBM Plex Mono', monospace" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: '32px', flexWrap: 'wrap',
          paddingBottom: '32px',
          borderBottom: '1px solid rgba(245,243,236,0.08)',
        }}>
          <a href="https://zenkai.nl" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <ZMark size={18} />
            <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '16px', fontWeight: 700, color: '#F5F3EC', letterSpacing: '-0.02em' }}>
              Zenkai
            </span>
          </a>

          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(245,243,236,0.25)' }}>Platform</span>
              {PLATFORM.map(l => (
                <a key={l.label} href={l.href} style={{ fontSize: '12px', color: 'rgba(245,243,236,0.4)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,243,236,0.75)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,243,236,0.4)')}
                >{l.label}</a>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(245,243,236,0.25)' }}>Job</span>
              <Link href="/blog"    style={{ fontSize: '12px', color: 'rgba(245,243,236,0.4)', textDecoration: 'none' }}>Blog</Link>
              <Link href="/pricing" style={{ fontSize: '12px', color: 'rgba(245,243,236,0.4)', textDecoration: 'none' }}>{t.navPricing}</Link>
              <Link href="/privacy" style={{ fontSize: '12px', color: 'rgba(245,243,236,0.4)', textDecoration: 'none' }}>{t.footerPrivacy}</Link>
              <Link href="/terms"   style={{ fontSize: '12px', color: 'rgba(245,243,236,0.4)', textDecoration: 'none' }}>{t.footerTerms}</Link>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(245,243,236,0.2)', letterSpacing: '0.04em' }}>© 2026 ZENKAI PLATFORM</span>
        </div>
      </div>
    </footer>
  );
}
