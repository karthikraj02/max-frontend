import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { userAPI } from '../utils/api';
import ProductCard from '../components/common/ProductCard';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { userAPI.getWishlist().then(r => setWishlist(r.data.wishlist)).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 40 }}>My Wishlist</h1>
        {loading ? <div style={{ color: 'var(--text-tertiary)' }}>Loading...</div>
          : wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Heart size={48} style={{ margin: '0 auto 16px', color: 'var(--text-tertiary)' }} />
              <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Wishlist is empty</h3>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: 24 }}>Save items you love for later.</p>
              <Link to="/products"><button className="btn-primary">Browse Products</button></Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24 }}>
              {wishlist.map((p, i) => <ProductCard key={p._id} product={p} delay={i} />)}
            </div>
          )}
      </div>
    </div>
  );
}
