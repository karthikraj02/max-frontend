import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { productAPI, adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => { productAPI.getAll({ limit: 50 }).then(r => setProducts(r.data.products)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await adminAPI.deleteProduct(id); setProducts(p => p.filter(x => x._id !== id)); toast.success('Product deleted'); }
    catch { toast.error('Failed to delete'); }
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
            {['Product','Category','Price','Stock','Status','Actions'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</td></tr>
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
                  <td style={{ padding: '12px 16px' }}><span className={`badge badge-${p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'error'}`}>{p.stock}</span></td>
                  <td style={{ padding: '12px 16px' }}><span className={`badge badge-${p.isActive !== false ? 'success' : 'error'}`}>{p.isActive !== false ? 'Active' : 'Inactive'}</span></td>
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
