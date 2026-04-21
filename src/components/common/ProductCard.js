import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { DB_TO_UI } from '../../utils/categoryMapper';

export default function ProductCard({ product, delay = 0 }) {
  const { addToCart, cartItems } = useCart();
  const inCart = cartItems.some(i => i._id === product._id);

  const price = product.discount > 0 ? Math.round(product.price * (1 - product.discount / 100)) : product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4 }}
      style={{ height: '100%' }}
    >
      <Link to={`/products/${product._id}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          transition: 'var(--transition)', height: '100%', display: 'flex', flexDirection: 'column',
        }}
          onMouseEnter={e => { e.currentTarget.style.border = '1px solid var(--border-hover)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          onMouseLeave={e => { e.currentTarget.style.border = '1px solid var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>

          {/* Image */}
          <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
            <img src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
            {/* Badges */}
            <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexDirection: 'column' }}>
              {product.discount > 0 && (
                <span className="badge badge-success">{product.discount}% OFF</span>
              )}
              {product.stock === 0 && (
                <span className="badge badge-error">Out of Stock</span>
              )}
              {product.isFeatured && (
                <span className="badge badge-accent">Featured</span>
              )}
            </div>
            {/* Wishlist hint */}
            <div style={{ position: 'absolute', top: 12, right: 12, opacity: 0, transition: 'var(--transition)' }}
              className="wishlist-btn">
              <button style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', color: 'var(--text-secondary)', transition: 'var(--transition)' }}>
                <Heart size={14} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 1 }}>{product.brand} · {DB_TO_UI[product.category] || product.category}</div>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3, color: 'var(--text-primary)' }}>{product.name}</div>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', gap: 1 }}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={11} fill={s <= Math.round(product.ratings) ? '#ff9f0a' : 'transparent'} stroke={s <= Math.round(product.ratings) ? '#ff9f0a' : '#555'} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>({product.numReviews})</span>
              </div>
            )}

            {/* Price & CTA */}
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>₹{price.toLocaleString()}</div>
                {product.discount > 0 && (
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</div>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: inCart ? 'var(--success)' : 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', transition: 'var(--transition)', flexShrink: 0,
                  opacity: product.stock === 0 ? 0.4 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (product.stock > 0) e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <ShoppingBag size={16} />
              </button>
            </div>
          </div>
        </div>
      </Link>
      <style>{`.wishlist-btn{opacity:0!important} div:hover > .wishlist-btn{opacity:1!important}`}</style>
    </motion.div>
  );
}
