import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, ChevronLeft, Plus, Minus, Check, Truck, Shield } from 'lucide-react';
import { productAPI, userAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/common/ProductCard';
import toast from 'react-hot-toast';
import { DB_TO_UI } from '../utils/categoryMapper';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [pd, rd] = await Promise.all([productAPI.getById(id), productAPI.getRelated(id)]);
        setProduct(pd.data.product);
        setRelated(rd.data.products);
      } catch { navigate('/products'); }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--accent)', fontSize: 16 }}>Loading...</div>
    </div>
  );
  if (!product) return null;

  const price = product.discount > 0 ? Math.round(product.price * (1 - product.discount / 100)) : product.price;

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`Added ${qty} × ${product.name} to cart`);
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please sign in'); return; }
    try {
      await userAPI.toggleWishlist(product._id);
      setInWishlist(w => !w);
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to review'); return; }
    setSubmittingReview(true);
    try {
      await productAPI.createReview(id, reviewForm);
      toast.success('Review submitted!');
      const { data } = await productAPI.getById(id);
      setProduct(data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) { toast.error(err.response?.data?.message || err.message || 'Failed to submit review'); }
    finally { setSubmittingReview(false); }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Back */}
        <button className="btn-ghost" style={{ marginBottom: 32 }} onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> Back
        </button>

        {/* Main product section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, marginBottom: 80 }}>
          {/* Images */}
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '1', marginBottom: 12 }}>
              <img src={product.images?.[activeImg]?.url} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', border: `2px solid ${activeImg === i ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', transition: 'var(--transition)', padding: 0 }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{product.brand} · {DB_TO_UI[product.category] || product.category}</div>
            <h1 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 16 }}>{product.name}</h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= Math.round(product.ratings) ? '#ff9f0a' : 'transparent'} stroke={s <= Math.round(product.ratings) ? '#ff9f0a' : '#555'} />)}
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{product.ratings.toFixed(1)} ({product.numReviews} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 36, fontWeight: 700 }}>₹{price.toLocaleString()}</span>
              {product.discount > 0 && <>
                <span style={{ fontSize: 18, color: 'var(--text-tertiary)', textDecoration: 'line-through', marginLeft: 12 }}>₹{product.price.toLocaleString()}</span>
                <span className="badge badge-success" style={{ marginLeft: 10 }}>Save {product.discount}%</span>
              </>}
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>{product.description}</p>

            {/* Features */}
            {product.features?.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>Key Features</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {product.features.map(f => (
                    <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 100, fontSize: 12 }}>
                      <Check size={11} color="var(--success)" />{f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div style={{ marginBottom: 24, fontSize: 14 }}>
              {product.stock > 0
                ? <span style={{ color: 'var(--success)' }}>✓ In Stock ({product.stock} available)</span>
                : <span style={{ color: 'var(--error)' }}>✗ Out of Stock</span>}
            </div>

            {/* Qty + CTA */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 4 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, color: 'var(--text-secondary)', transition: 'var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Minus size={14} />
                </button>
                <span style={{ width: 32, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, color: 'var(--text-secondary)', transition: 'var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Plus size={14} />
                </button>
              </div>
              <button className="btn-primary" style={{ flex: 1, minWidth: 180 }} onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingBag size={16} /> Add to Cart
              </button>
              <button onClick={handleWishlist}
                style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: inWishlist ? 'rgba(255,69,58,0.1)' : 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)', cursor: 'pointer' }}>
                <Heart size={18} fill={inWishlist ? '#ff453a' : 'none'} stroke={inWishlist ? '#ff453a' : 'currentColor'} />
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[{ icon: <Truck size={14} />, text: 'Free shipping over ₹1,000' }, { icon: <Shield size={14} />, text: '2-year warranty' }].map(b => (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)' }}>
                  {b.icon}{b.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        {product.specifications?.length > 0 && (
          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 24 }}>Specifications</h2>
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              {product.specifications.map((s, i) => (
                <div key={i} style={{ display: 'flex', borderBottom: i < product.specifications.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 200, padding: '14px 20px', background: 'var(--bg-elevated)', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>{s.key}</div>
                  <div style={{ padding: '14px 20px', fontSize: 14 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 24 }}>Reviews ({product.numReviews})</h2>
          {user && (
            <form onSubmit={handleReview} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Write a Review</div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setReviewForm(r => ({ ...r, rating: s }))}>
                    <Star size={24} fill={s <= reviewForm.rating ? '#ff9f0a' : 'none'} stroke={s <= reviewForm.rating ? '#ff9f0a' : '#555'} />
                  </button>
                ))}
              </div>
              <textarea className="input-field" rows={3} placeholder="Share your experience..." value={reviewForm.comment}
                onChange={e => setReviewForm(r => ({ ...r, comment: e.target.value }))} style={{ resize: 'vertical', marginBottom: 12 }} required />
              <button className="btn-primary" type="submit" disabled={submittingReview}>{submittingReview ? 'Submitting...' : 'Submit Review'}</button>
            </form>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {!product.reviews?.some(r => r.createdAt) ? (
              <p style={{ color: 'var(--text-tertiary)' }}>No reviews yet. Be the first!</p>
            ) : product.reviews?.filter(r => r.createdAt).map(r => (
              <div key={r._id} className="glass-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name || 'Anonymous User'}</div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= r.rating ? '#ff9f0a' : 'none'} stroke={s <= r.rating ? '#ff9f0a' : '#555'} />)}
                  </div>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.comment}</p>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 24 }}>You Might Also Like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 24 }}>
              {related.map((p, i) => <ProductCard key={p._id} product={p} delay={i} />)}
            </div>
          </div>
        )}
      </div>
      <style>{`@media(max-width:768px){.container>div:nth-child(2){grid-template-columns:1fr!important;gap:32px!important}}`}</style>
    </div>
  );
}
