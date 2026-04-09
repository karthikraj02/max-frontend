import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck, Star, Speaker, Lightbulb, Cable, Settings, Mic, Smartphone, Package } from 'lucide-react';
import { productAPI } from '../utils/api';
import ProductCard from '../components/common/ProductCard';

const fadeUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } };

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getFeatured().then(({ data }) => {
      setFeatured(data.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = [
    { name: 'Speakers', icon: Speaker, color: '#6366f1', animate: { scale: [1, 1.1, 1], y: [0, -2, 0] }, duration: 2.5 },
    { name: 'Lights', icon: Lightbulb, color: '#8b5cf6', animate: { filter: ['drop-shadow(0 0 2px #8b5cf640)', 'drop-shadow(0 0 12px #8b5cf680)', 'drop-shadow(0 0 2px #8b5cf640)'] }, duration: 2 },
    { name: 'Cables', icon: Cable, color: '#06b6d4', animate: { y: [0, -4, 0] }, duration: 3 },
    { name: 'Accessories', icon: Settings, color: '#10b981', animate: { rotate: [0, 90] }, duration: 4, ease: 'linear' },
    { name: 'Mic', icon: Mic, color: '#f59e0b', animate: { y: [0, -3, 0], scale: [1, 1.05, 1] }, duration: 2.5 },
    { name: 'Tablets', icon: Smartphone, color: '#ef4444', animate: { rotateZ: [0, -5, 5, 0] }, duration: 4 },
    { name: 'Misc', icon: Package, color: '#6366f1', animate: { y: [0, -5, 0] }, duration: 2.2 },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 60%), var(--bg-primary)',
        position: 'relative', overflow: 'hidden', paddingTop: 80,
      }}>
        {/* Animated background orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[
            { w: 600, h: 600, top: '-10%', left: '-10%', color: 'rgba(99,102,241,0.06)' },
            { w: 500, h: 500, bottom: '-10%', right: '-10%', color: 'rgba(139,92,246,0.06)' },
            { w: 300, h: 300, top: '40%', left: '60%', color: 'rgba(6,182,212,0.04)' },
          ].map((orb, i) => (
            <motion.div key={i}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', borderRadius: '50%',
                width: orb.w, height: orb.h,
                top: orb.top, left: orb.left, bottom: orb.bottom, right: orb.right,
                background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }} />
          ))}
        </div>

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div {...fadeUp}>
            <span className="badge badge-accent" style={{ marginBottom: 24, display: 'inline-flex' }}>
              ✦ New Era of Technology
            </span>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ delay: 0.1, duration: 0.7 }}
            style={{ fontSize: 'clamp(48px,8vw,96px)', fontWeight: 700, letterSpacing: '-3px', lineHeight: 1.0, marginBottom: 24 }}>
            The Future <br />
            <span style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Is Here.
            </span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ delay: 0.2 }}
            style={{ fontSize: 'clamp(16px,2.5vw,22px)', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.6 }}>
            Premium technology products, curated for those who demand the extraordinary.
          </motion.p>

          <motion.div {...fadeUp} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => navigate('/products')}>
              Shop Now <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => navigate('/products?featured=true')}>
              Explore Featured
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
            {[
              { icon: <Zap size={24} />, title: 'Express Delivery', desc: 'Same-day delivery in select cities' },
              { icon: <Shield size={24} />, title: '2-Year Warranty', desc: 'All products covered end-to-end' },
              { icon: <Truck size={24} />, title: 'Free Shipping', desc: 'On all orders above ₹1,000' },
              { icon: <Star size={24} />, title: 'Premium Quality', desc: 'Only the finest, hand-picked products' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                <div className="glass-card" style={{ padding: 24, textAlign: 'center', transition: 'var(--transition)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent)' }}>
                    {f.icon}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>BROWSE BY</div>
              <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-1px' }}>Categories</h2>
            </div>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}>
              All Products <ArrowRight size={14} />
            </Link>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16 }}>
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.06, y: -6, boxShadow: `0 16px 32px ${cat.color}30` }}
                style={{ borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
                <Link to={`/products?category=${cat.name}`}>
                  <div className="glass-card" style={{ padding: '28px 16px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s', border: '1px solid var(--border)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + '60'; e.currentTarget.style.boxShadow = `0 16px 32px ${cat.color}20`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <motion.div
                      animate={cat.animate}
                      transition={{ duration: cat.duration, repeat: Infinity, ease: cat.ease || 'easeInOut', repeatType: 'loop' }}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, color: cat.color }}>
                      <cat.icon size={42} strokeWidth={1.5} />
                    </motion.div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>HAND-PICKED</div>
              <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-1px' }}>Featured Products</h2>
            </div>
            <Link to="/products?featured=true" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}>
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <div className="skeleton" style={{ aspectRatio: '1' }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 12, width: '40%' }} />
                    <div className="skeleton" style={{ height: 16, width: '80%' }} />
                    <div className="skeleton" style={{ height: 20, width: '30%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24 }}>
              {featured.map((p, i) => <ProductCard key={p._id} product={p} delay={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{
              borderRadius: 'var(--radius-xl)', padding: '64px 48px', textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)',
              border: '1px solid rgba(99,102,241,0.2)',
              position: 'relative', overflow: 'hidden',
            }}>
              <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 16 }}>
                Ready to experience the future?
              </h2>
              <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
                Join thousands of satisfied customers. Discover products that change everything.
              </p>
              <button className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }} onClick={() => navigate('/products')}>
                Shop Now <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
