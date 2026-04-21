import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Upload } from 'lucide-react';
import { adminAPI, productAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics','Audio','Wearables','Accessories','Computers','Phones','Tablets','Home','Other'];
const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' };

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({ name:'',shortDescription:'',description:'',price:'',originalPrice:'',discount:0,category:'Electronics',brand:'',stock:'',sku:'',isFeatured:false,features:'',specifications:'' });

  useEffect(() => {
    if (isEdit) {
      productAPI.getById(id).then(r => {
        const p = r.data.product;
        setForm({ ...p, features: p.features?.join('\n') || '', specifications: p.specifications?.map(s => `${s.key}:${s.value}`).join('\n') || '' });
      }).catch(() => navigate('/admin/products'));
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      const features = form.features.split('\n').filter(Boolean);
      const specifications = form.specifications.split('\n').filter(Boolean).map(s => { const [k,...v] = s.split(':'); return { key: k.trim(), value: v.join(':').trim() }; });
      const payload = { ...form, features, specifications };
      Object.entries(payload).forEach(([k, v]) => {
        if (Array.isArray(v) || (typeof v === 'object' && v !== null)) fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      images.forEach(img => fd.append('images', img));
      if (isEdit) { await adminAPI.updateProduct(id, fd); toast.success('Product updated!'); }
      else { await adminAPI.createProduct(fd); toast.success('Product created!'); }
      navigate('/admin/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 32 }}>{isEdit ? 'Edit' : 'New'} Product</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Basic Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Product Name *</label><input style={inputStyle} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required /></div>
            <div><label style={labelStyle}>Brand *</label><input style={inputStyle} value={form.brand} onChange={e=>setForm(f=>({...f,brand:e.target.value}))} required /></div>
            <div><label style={labelStyle}>Category *</label>
              <select style={inputStyle} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Short Description</label><input style={inputStyle} value={form.shortDescription} onChange={e=>setForm(f=>({...f,shortDescription:e.target.value}))} /></div>
            <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Description *</label><textarea style={{...inputStyle,resize:'vertical',minHeight:100}} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} required /></div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Pricing & Stock</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div><label style={labelStyle}>Price (₹) *</label><input style={inputStyle} type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} required /></div>
            <div><label style={labelStyle}>Discount (%)</label><input style={inputStyle} type="number" min={0} max={100} value={form.discount} onChange={e=>setForm(f=>({...f,discount:e.target.value}))} /></div>
            <div><label style={labelStyle}>Stock *</label><input style={inputStyle} type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} required /></div>
            <div><label style={labelStyle}>SKU</label><input style={inputStyle} value={form.sku} onChange={e=>setForm(f=>({...f,sku:e.target.value}))} /></div>
            <div style={{ display:'flex',flexDirection:'column',justifyContent:'flex-end' }}>
              <label style={{ display:'flex',alignItems:'center',gap:10,cursor:'pointer',paddingBottom:12 }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e=>setForm(f=>({...f,isFeatured:e.target.checked}))} />
                <span style={{ fontSize:14 }}>Featured Product</span>
              </label>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Images</h3>
          <label style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12,padding:32,border:'2px dashed var(--border)',borderRadius:'var(--radius-lg)',cursor:'pointer',transition:'var(--transition)' }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
            <Upload size={32} color="var(--text-tertiary)" />
            <span style={{ fontSize:14,color:'var(--text-secondary)' }}>Click to upload images (max 8)</span>
            <input type="file" multiple accept="image/*" style={{ display:'none' }} onChange={e=>setImages([...e.target.files])} />
          </label>
          {images.length>0 && <div style={{ display:'flex',gap:8,flexWrap:'wrap',marginTop:12 }}>{images.map((f,i)=><div key={i} style={{ position:'relative' }}><img src={URL.createObjectURL(f)} alt="" style={{ width:64,height:64,borderRadius:8,objectFit:'cover' }} /><button type="button" onClick={()=>setImages(im=>im.filter((_,j)=>j!==i))} style={{ position:'absolute',top:-6,right:-6,width:18,height:18,borderRadius:'50%',background:'var(--error)',display:'flex',alignItems:'center',justifyContent:'center',border:'none',cursor:'pointer' }}><X size={10} color="white" /></button></div>)}</div>}
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Features & Specifications</h3>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
            <div><label style={labelStyle}>Features (one per line)</label><textarea style={{...inputStyle,resize:'vertical',minHeight:120}} placeholder="48MP Camera&#10;Face ID&#10;5G Ready" value={form.features} onChange={e=>setForm(f=>({...f,features:e.target.value}))} /></div>
            <div><label style={labelStyle}>Specifications (Key:Value per line)</label><textarea style={{...inputStyle,resize:'vertical',minHeight:120}} placeholder="Display:6.7 OLED&#10;RAM:8GB" value={form.specifications} onChange={e=>setForm(f=>({...f,specifications:e.target.value}))} /></div>
          </div>
        </div>

        <div style={{ display:'flex',gap:12 }}>
          <button className="btn-primary" type="submit" disabled={loading} style={{ padding:'12px 32px' }}>{loading?'Saving...':isEdit?'Update Product':'Create Product'}</button>
          <button type="button" className="btn-secondary" onClick={()=>navigate('/admin/products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
