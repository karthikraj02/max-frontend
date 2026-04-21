import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Mail, Instagram } from 'lucide-react';

export default function Footer() {
  const [showContact, setShowContact] = useState(false);
  const year = new Date().getFullYear();
  const sections = [
    { title: 'Shop', links: [{ label: 'All Products', to: '/products' }, { label: 'Speakers', to: '/products?category=Speakers' }, { label: 'Lights', to: '/products?category=Lights' }, { label: 'Cables', to: '/products?category=Cables' }, { label: 'Accessories', to: '/products?category=Accessories' }, { label: 'Mic', to: '/products?category=Mic' }] },
    { title: 'Account', links: [{ label: 'Profile', to: '/profile' }, { label: 'Orders', to: '/orders' }, { label: 'Wishlist', to: '/wishlist' }, { label: 'Sign In', to: '/login' }] },
    { title: 'Company', links: [{ label: 'About', to: '#' }, { label: 'Privacy Policy', to: '#' }, { label: 'Terms of Service', to: '#' }, { label: 'Contact', action: () => setShowContact(true) }] },
  ];

  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '60px 0 32px', background: 'var(--bg-secondary)', position: 'relative' }}>
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
                  l.action ? (
                    <button key={l.label} onClick={l.action} style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0, fontSize: 14, color: 'var(--text-secondary)', transition: 'var(--transition)', cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{l.label}</button>
                  ) : (
                    <Link key={l.label} to={l.to} style={{ fontSize: 14, color: 'var(--text-secondary)', transition: 'var(--transition)' }}
                      onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{l.label}</Link>
                  )
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

      <AnimatePresence>
        {showContact && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowContact(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="glass-card"
              style={{ width: '90%', maxWidth: 400, padding: 32, position: 'relative' }}
            >
              <button onClick={() => setShowContact(false)} className="btn-ghost" style={{ position: 'absolute', top: 16, right: 16, padding: 6, borderRadius: '50%' }}>
                <X size={20} color="var(--text-secondary)" />
              </button>
              
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>Contact Us</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <a href="https://wa.me/918073121177" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', transition: 'var(--transition)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-elevated)'}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(37, 211, 102, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366' }}>
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 2 }}>Phone & WhatsApp</div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>+91 8073 121 177</div>
                  </div>
                </a>

                <a href="mailto:protechaudiosolutions@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', transition: 'var(--transition)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-elevated)'}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(234, 67, 53, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA4335' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 2 }}>Email Address</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>protechaudiosolutions<br/>@gmail.com</div>
                  </div>
                </a>

                <a href="https://www.instagram.com/protechco.in/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', transition: 'var(--transition)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-elevated)'}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(225, 48, 108, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E1306C' }}>
                    <Instagram size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 2 }}>Instagram</div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>@protechco.in</div>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`@media(max-width:768px){footer .container > div:first-child{grid-template-columns:1fr 1fr!important;gap:32px!important}}`}</style>
    </footer>
  );
}
