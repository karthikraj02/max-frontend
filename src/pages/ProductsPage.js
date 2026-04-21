import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { productAPI } from '../utils/api';
import ProductCard from '../components/common/ProductCard';

const CATEGORIES = ['All', 'LOUDSPEAKERS', 'SPEAKERS', 'CABINETS', 'AMPLIFIERS', 'MIXERS', 'DJ CONSOLES', 'OTHERS'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (category !== 'All') {
        const categoryMap = {
          'LOUDSPEAKERS': 'Audio',
          'SPEAKERS': 'Audio',
          'CABINETS': 'Accessories',
          'AMPLIFIERS': 'Electronics',
          'MIXERS': 'Other',
          'DJ CONSOLES': 'Electronics',
          'OTHERS': 'Other'
        };
        params.category = categoryMap[category] || category;
      }
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [category, search, sort, minPrice, maxPrice, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [category, search, sort, minPrice, maxPrice]);

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value && value !== 'All') p.set(key, value); else p.delete(key);
    setSearchParams(p);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>
            {search ? `Results for "${search}"` : category !== 'All' ? category : 'All Products'}
          </h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>{total} products found</p>
        </div>

        {/* Category Chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => updateParam('category', cat)}
              style={{
                padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500,
                background: category === cat ? 'var(--accent)' : 'var(--bg-card)',
                color: category === cat ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${category === cat ? 'var(--accent)' : 'var(--border)'}`,
                transition: 'var(--transition)', cursor: 'pointer',
              }}>{cat}</button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <button className="btn-secondary" style={{ gap: 8, fontSize: 13, padding: '8px 16px' }} onClick={() => setFiltersOpen(o => !o)}>
            <SlidersHorizontal size={15} /> Filters {filtersOpen ? <X size={14} /> : <ChevronDown size={14} />}
          </button>
          <select value={sort} onChange={e => updateParam('sort', e.target.value)}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', padding: '8px 12px', fontSize: 13, cursor: 'pointer', outline: 'none' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Filter Panel */}
        {filtersOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 24, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Price Range</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input className="input-field" type="number" placeholder="Min ₹" style={{ width: 100 }}
                  defaultValue={minPrice} onBlur={e => updateParam('minPrice', e.target.value)} />
                <span style={{ color: 'var(--text-tertiary)' }}>–</span>
                <input className="input-field" type="number" placeholder="Max ₹" style={{ width: 100 }}
                  defaultValue={maxPrice} onBlur={e => updateParam('maxPrice', e.target.value)} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Availability</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={searchParams.get('inStock') === 'true'} onChange={e => updateParam('inStock', e.target.checked ? 'true' : '')} />
                In Stock Only
              </label>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24 }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ aspectRatio: '1' }} />
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="skeleton" style={{ height: 12, width: '40%' }} />
                  <div className="skeleton" style={{ height: 16, width: '80%' }} />
                  <div className="skeleton" style={{ height: 20, width: '30%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>No products found</h3>
            <p style={{ color: 'var(--text-tertiary)' }}>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24 }}>
              {products.map((p, i) => <ProductCard key={p._id} product={p} delay={i} />)}
            </div>
            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
                {[...Array(pages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', border: `1px solid ${page === i + 1 ? 'var(--accent)' : 'var(--border)'}`, background: page === i + 1 ? 'var(--accent)' : 'transparent', color: page === i + 1 ? 'white' : 'var(--text-secondary)', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'var(--transition)' }}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
