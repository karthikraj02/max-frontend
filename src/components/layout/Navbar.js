import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Heart, Menu, X, LogOut, Settings, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { productAPI } from '../../utils/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (q) => {
    setSearchQuery(q);
    clearTimeout(debounceRef.current);
    if (q.length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await productAPI.getSuggestions(q);
        setSuggestions(data.suggestions || []);
      } catch { setSuggestions([]); }
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  const navLinks = [
    { label: 'Products', to: '/products' },
    { label: 'Loudspeakers', to: '/products?category=LOUDSPEAKERS' },
    { label: 'Speakers', to: '/products?category=SPEAKERS' },
    { label: 'Cabinets', to: '/products?category=CABINETS' },
    { label: 'Amplifiers', to: '/products?category=AMPLIFIERS' },
    { label: 'Mixers', to: '/products?category=MIXERS' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 'var(--nav-height)',
        background: scrolled ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', flexShrink: 0 }}>
            PRO<span style={{ color: 'var(--accent)' }}>TECH</span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '8px 14px', borderRadius: 'var(--radius-sm)',
                fontSize: 14, color: 'var(--text-secondary)',
                transition: 'var(--transition)',
              }}
                onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'var(--bg-card)'; }}
                onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent'; }}
              >{l.label}</Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Search */}
            <div ref={searchRef} style={{ position: 'relative' }}>
              <button className="btn-ghost" style={{ padding: '8px' }} onClick={() => setSearchOpen(o => !o)}>
                <Search size={18} />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="search-dropdown-wrapper"
                    style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: 8,
                      width: 320, background: 'var(--bg-card)', zIndex: 1001,
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                      padding: 12, boxShadow: 'var(--shadow-lg)',
                    }}>
                    <form onSubmit={handleSearchSubmit}>
                      <input className="input-field" autoFocus placeholder="Search products..."
                        value={searchQuery} onChange={e => handleSearch(e.target.value)}
                        style={{ marginBottom: suggestions.length > 0 ? 8 : 0 }} />
                    </form>
                    {suggestions.length > 0 && (
                      <div>{suggestions.map(s => (
                        <div key={s._id} onClick={() => { navigate(`/products/${s._id}`); setSearchOpen(false); setSearchQuery(''); }}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 8, cursor: 'pointer', transition: 'var(--transition)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <img src={s.images?.[0]?.url} alt={s.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{s.category}</div>
                          </div>
                        </div>
                      ))}</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            {user && (
              <Link to="/wishlist">
                <button className="btn-ghost" style={{ padding: '8px' }}><Heart size={18} /></button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" style={{ position: 'relative' }}>
              <button className="btn-ghost" style={{ padding: '8px' }}>
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 2, right: 2, background: 'var(--accent)',
                    color: 'white', borderRadius: '50%', width: 16, height: 16,
                    fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{cartCount > 9 ? '9+' : cartCount}</span>
                )}
              </button>
            </Link>

            {/* User menu */}
            {user ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button className="btn-ghost" style={{ padding: '8px' }} onClick={() => setUserMenuOpen(o => !o)}>
                  {user.profileImage?.url
                    ? <img src={user.profileImage.url} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                    : <User size={18} />}
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      style={{
                        position: 'absolute', top: '100%', right: 0, marginTop: 8,
                        width: 200, background: 'var(--bg-card)',
                        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                        padding: 8, boxShadow: 'var(--shadow-lg)',
                      }}>
                      <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{user.email}</div>
                      </div>
                      {[
                        { icon: <User size={14} />, label: 'Profile', to: '/profile' },
                        { icon: <Package size={14} />, label: 'My Orders', to: '/orders' },
                        ...(user.role === 'admin' ? [{ icon: <Settings size={14} />, label: 'Admin Panel', to: '/admin' }] : []),
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', transition: 'var(--transition)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                            {item.icon}{item.label}
                          </div>
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
                        <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, fontSize: 13, color: 'var(--error)', width: '100%', transition: 'var(--transition)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,69,58,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <LogOut size={14} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login"><button className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>Sign In</button></Link>
            )}

            {/* Mobile hamburger */}
            <button className="btn-ghost mobile-menu-btn" style={{ padding: '8px', display: 'none' }} onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 280, zIndex: 999,
              background: 'var(--bg-card)', borderLeft: '1px solid var(--border)',
              padding: '80px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8,
            }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{ padding: '12px 16px', borderRadius: 10, fontSize: 16, color: 'var(--text-secondary)', transition: 'var(--transition)' }}>
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .search-dropdown-wrapper {
            position: fixed !important;
            top: var(--nav-height) !important;
            left: 16px !important;
            right: 16px !important;
            width: auto !important;
            margin-top: 8px !important;
          }
        }
      `}</style>
    </>
  );
}
