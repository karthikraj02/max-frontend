import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  const sections = [
    { title: 'Shop', links: [{ label: 'All Products', to: '/products' }, { label: 'Speakers', to: '/products?category=Speakers' }, { label: 'Lights', to: '/products?category=Lights' }, { label: 'Cables', to: '/products?category=Cables' }, { label: 'Accessories', to: '/products?category=Accessories' }, { label: 'Mic', to: '/products?category=Mic' }] },
    { title: 'Account', links: [{ label: 'Profile', to: '/profile' }, { label: 'Orders', to: '/orders' }, { label: 'Wishlist', to: '/wishlist' }, { label: 'Sign In', to: '/login' }] },
    { title: 'Company', links: [{ label: 'About', to: '#' }, { label: 'Privacy Policy', to: '#' }, { label: 'Terms of Service', to: '#' }, { label: 'Contact', to: '#' }] },
  ];

  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '60px 0 32px', background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 16 }}>
              PRO<span style={{ color: 'var(--accent)' }}>TECH</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.7, maxWidth: 280 }}>
              Premium tech products for the modern world. Curated, quality-first, delivered to your door.
            </p>
          </div>
          {sections.map(s => (
            <div key={s.title}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>{s.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {s.links.map(l => (
                  <Link key={l.label} to={l.to} style={{ fontSize: 14, color: 'var(--text-secondary)', transition: 'var(--transition)' }}
                    onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>© {year} ProTech. All rights reserved.</p>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            <a href="https://beautiful-alpaca-6b1495.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              Crafted with precision. Built for the future.
            </a>
          </p>
        </div>
      </div>
      <style>{`@media(max-width:768px){footer .container > div:first-child{grid-template-columns:1fr 1fr!important;gap:32px!important}}`}</style>
    </footer>
  );
}
