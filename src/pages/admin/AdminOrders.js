import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const STATUSES = ['Pending','Processing','Paid','Shipped','Out for Delivery','Delivered','Cancelled','Refunded'];
const STATUS_COLORS = { Pending:'warning',Processing:'accent',Paid:'accent',Shipped:'accent','Out for Delivery':'accent',Delivered:'success',Cancelled:'error',Refunded:'error' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => { adminAPI.getOrders({ limit: 50 }).then(r => setOrders(r.data.orders)).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  const handleStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await adminAPI.updateOrderStatus(orderId, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
      toast.success('Order status updated');
    } catch { toast.error('Failed to update'); }
    finally { setUpdating(null); }
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 32 }}>Orders</h1>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Order ID','Customer','Items','Total','Status','Action'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</td></tr>
              : orders.map(o => (
                <tr key={o._id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 500 }}>#{o._id.slice(-8).toUpperCase()}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{o.user?.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{o.orderItems?.length} item(s)</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600 }}>₹{o.totalAmount?.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px' }}><span className={`badge badge-${STATUS_COLORS[o.orderStatus]||'accent'}`}>{o.orderStatus}</span></td>
                  <td style={{ padding: '14px 16px' }}>
                    <select value={o.orderStatus} onChange={e => handleStatus(o._id, e.target.value)} disabled={updating === o._id}
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', padding: '6px 10px', fontSize: 12, cursor: 'pointer', outline: 'none' }}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
