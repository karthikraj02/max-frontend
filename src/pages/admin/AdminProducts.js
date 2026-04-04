import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Check, X as XIcon } from 'lucide-react';
import { productAPI, adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Track which product is being restored and its quantity input
  const [restoring, setRestoring] = useState(null); // { id, qty }

  const fetchProducts = () => {
    productAPI.getAll({ limit: 100, showAll: true })
      .then(r => setProducts(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await adminAPI.deleteProduct(id);
      setProducts(p => p.filter(x => x._id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleMarkOutOfStock = async (product) => {
    if (!window.confirm(`Mark "${product.name}" as Out of Stock?`)) return;
    try {
      const { data } = await adminAPI.toggleProductStock(product._id);
      setProducts(p => p.map(x => x._id === product._id ? { ...x, stock: data.product.stock } : x));
      toast.success('Marked as out of stock');
    } catch { toast.error('Failed to update stock'); }
  };

  const handleRestoreStock = async (id) => {
    const qty = parseInt(restoring?.qty);
    if (!qty || qty <= 0) { toast.error('Please enter a valid quantity'); return; }
    try {
      const { data } = await adminAPI.toggleProductStock(id, qty);
      setProducts(p => p.map(x => x._id === id ? { ...x, stock: data.product.stock } : x));
      setRestoring(null);
      toast.success(`Stock restored to ${data.product.stock}`);
    } catch { toast.error('Failed to update stock'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' }}>Products ({products.length})</h1>
        <Link to="/admin/products/new"><button className="btn-primary"><Plus size={16} /> Add Product</button></Link>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Product', 'Category', 'Price', 'Stock', 'Status', 'Stock Toggle', 'Actions'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</td></tr>
              : products.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={p.images?.[0]?.url} alt={p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: 'var(--bg-elevated)' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{p.category}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>₹{p.price?.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge badge-${p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'error'}`}>{p.stock} units</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}><span className={`badge badge-${p.isActive !== false ? 'success' : 'error'}`}>{p.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ padding: '12px 16px' }}>
                    {p.stock > 0 ? (
                      <button
                        onClick={() => handleMarkOutOfStock(p)}
                        title="Click to mark Out of Stock"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, border: '1px solid rgba(48,209,88,0.4)', background: 'rgba(48,209,88,0.1)', color: 'var(--success)', cursor: 'pointer', transition: 'var(--transition)' }}
                      >
                        <ToggleRight size={14} /> In Stock
                      </button>
                    ) : restoring?.id === p._id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="number" min={1} placeholder="Qty"
                          value={restoring.qty}
                          onChange={e => setRestoring(r => ({ ...r, qty: e.target.value }))}
                          style={{ width: 64, padding: '4px 8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12 }}
                          autoFocus
                        />
                        <button onClick={() => handleRestoreStock(p._id)} style={{ padding: 4, background: 'rgba(48,209,88,0.15)', border: '1px solid rgba(48,209,88,0.4)', borderRadius: 6, color: 'var(--success)', cursor: 'pointer', display: 'flex' }}><Check size={13} /></button>
                        <button onClick={() => setRestoring(null)} style={{ padding: 4, background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.3)', borderRadius: 6, color: 'var(--error)', cursor: 'pointer', display: 'flex' }}><XIcon size={13} /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRestoring({ id: p._id, qty: '10' })}
                        title="Click to restore stock"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, border: '1px solid rgba(255,69,58,0.4)', background: 'rgba(255,69,58,0.1)', color: 'var(--error)', cursor: 'pointer', transition: 'var(--transition)' }}
                      >
                        <ToggleLeft size={14} /> Out of Stock
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/admin/products/${p._id}/edit`}><button className="btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }}><Edit size={13} /></button></Link>
                      <button className="btn-ghost" style={{ padding: '6px 10px', fontSize: 12, color: 'var(--error)' }} onClick={() => handleDelete(p._id, p.name)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
