import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, subtotal, tax, shipping, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cartItems.length === 0) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ShoppingBag size={64} style={{ margin: '0 auto 24px', color: 'var(--text-tertiary)' }} />
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Looks like you haven't added anything yet.</p>
        <Link to="/products"><button className="btn-primary">Start Shopping <ArrowRight size={16} /></button></Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 40 }}>Shopping Cart</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence>
              {cartItems.map(item => {
                const price = item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price;
                return (
                  <motion.div key={item._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
                    <img src={item.images?.[0]?.url} alt={item.name} style={{ width: 88, height: 88, borderRadius: 12, objectFit: 'cover', background: 'var(--bg-elevated)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/products/${item._id}`} style={{ fontSize: 15, fontWeight: 600, display: 'block', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</Link>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 12 }}>{item.brand} · {item.category}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer' }}><Minus size={12} /></button>
                          <span style={{ width: 28, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer' }}><Plus size={12} /></button>
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>₹{(price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} style={{ padding: 8, borderRadius: 8, color: 'var(--text-tertiary)', transition: 'var(--transition)', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.background = 'rgba(255,69,58,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}>
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 28, position: 'sticky', top: 80 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Order Summary</h3>
            {[['Subtotal', subtotal], ['GST (18%)', tax], ['Shipping', shipping === 0 ? 'FREE' : shipping]].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontWeight: 500, color: val === 'FREE' ? 'var(--success)' : 'inherit' }}>{val === 'FREE' ? 'FREE' : `₹${val.toLocaleString()}`}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 4, display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>₹{total.toLocaleString()}</span>
            </div>
            {shipping > 0 && <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>Add ₹{(1000 - subtotal + 1).toLocaleString()} more for free shipping</p>}
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}
              onClick={() => user ? navigate('/checkout') : navigate('/login?redirect=/checkout')}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <Link to="/products"><button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 10, fontSize: 14 }}>Continue Shopping</button></Link>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.container>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
