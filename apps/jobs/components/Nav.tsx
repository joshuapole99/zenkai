'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { T } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

function ZMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={Math.round(size * 44 / 36)} height={size} viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="44" height="6" fill="#0F0E0E" />
      <polygon points="44,6 44,13 6,30 0,30 0,23 38,6" fill="#0F0E0E" />
      <rect x="0" y="30" width="44" height="6" fill="#0F0E0E" />
    </svg>
  );
}

export default function Nav() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [user, setUser] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const sb = createClient();
      sb.auth.getUser().then(({ data }) => setUser(!!data.user));
      sb.auth.onAuthStateChange((_, session) => setUser(!!session));
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const monoLink: React.CSSProperties = {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '12px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: 'rgba(15,14,14,0.45)',
    transition: 'color 0.15s',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        [data-job-nav] a:hover { color: #0F0E0E !important; }
        @keyframes zk-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width:640px) {
          [data-job-desk] { display:none !important; }
          [data-job-ham]  { display:flex !important; }
        }
      `}</style>

      <header data-job-nav="" style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: '#F5F3EC',
        borderBottom: '1px solid rgba(15,14,14,0.1)',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 32px', height: '58px',
          display: 'flex', alignItems: 'center',
        }}>
          <a href="https://zenkai.nl" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <ZMark size={20} />
            <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '16px', fontWeight: 700, color: '#0F0E0E', letterSpacing: '-0.02em' }}>
              Zenkai
            </span>
          </a>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'rgba(15,14,14,0.28)', letterSpacing: '0.06em', marginLeft: '10px' }}>
            / JOB
          </span>

          <nav data-job-desk="" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto' }}>
            <Link href="/analyse" style={monoLink}>{t.navAnalyse}</Link>
            <Link href="/pricing" style={monoLink}>{t.navPricing}</Link>
            <Link href="/blog"    style={monoLink}>{t.navBlog}</Link>
            <LanguageSwitcher />
            {user === null ? null : user ? (
              <Link href="/dashboard" style={{ ...monoLink, fontWeight: 500, color: '#0F0E0E', background: 'rgba(15,14,14,0.06)', padding: '6px 14px' }}>
                {t.navDashboard}
              </Link>
            ) : (
              <>
                <Link href="/login"  style={{ ...monoLink, padding: '6px 10px' }}>{t.navLogin}</Link>
                <Link href="/signup" style={{ ...monoLink, fontWeight: 500, color: '#F5F3EC', background: '#0F0E0E', padding: '6px 14px' }}>
                  {t.navSignup}
                </Link>
              </>
            )}
          </nav>

          <button
            data-job-ham=""
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'none', flexDirection: 'column', gap: '5px' }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: '22px', height: '1.5px', background: '#0F0E0E',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                transform: menuOpen && i === 0 ? 'rotate(45deg) translate(4.5px,4.5px)' :
                           menuOpen && i === 2 ? 'rotate(-45deg) translate(4.5px,-4.5px)' : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 199, background: '#F5F3EC', display: 'flex', flexDirection: 'column', padding: '80px 40px 48px', overflowY: 'auto' }}>
          {[
            { href: '/analyse', label: t.navAnalyse },
            { href: '/pricing', label: t.navPricing },
            { href: '/blog',    label: t.navBlog },
            ...(user ? [{ href: '/dashboard', label: t.navDashboard }] : [
              { href: '/login',  label: t.navLogin },
              { href: '/signup', label: t.navSignup },
            ]),
          ].map((item, i) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(38px, 10vw, 58px)',
              fontWeight: 700, color: '#0F0E0E',
              textDecoration: 'none', lineHeight: 1.05,
              padding: '12px 0',
              borderBottom: '1px solid rgba(15,14,14,0.1)',
              animation: `zk-up 0.3s ease ${i * 0.06}s both`,
            }}>{item.label}</a>
          ))}
          <p style={{ marginTop: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'rgba(15,14,14,0.25)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Zenkai Platform · zenkai.nl
          </p>
        </div>
      )}
    </>
  );
}
