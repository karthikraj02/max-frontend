import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin } from 'lucide-react';
import { orderAPI } from '../utils/api';

const STATUS_COLORS = { Pending: 'warning', Processing: 'accent', Paid: 'accent', Shipped: 'accent', 'Out for Delivery': 'accent', Delivered: 'success', Cancelled: 'error', Refunded: 'error' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { orderAPI.getMyOrders().then(r => setOrders(r.data.orders)).catch(()=>{}).finally(() => setLoading(false)); }, []);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 40 }}>My Orders</h1>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Package size={48} style={{ margin: '0 auto 16px', color: 'var(--text-tertiary)' }} />
            <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>No orders yet</h3>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: 24 }}>Your order history will appear here.</p>
            <Link to="/products"><button className="btn-primary">Start Shopping</button></Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map(order => (
              <div key={order._id} className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className={`badge badge-${STATUS_COLORS[order.orderStatus] || 'accent'}`}>{order.orderStatus}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  {order.orderItems?.slice(0, 3).map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--bg-elevated)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                  {order.orderItems?.length > 3 && <span style={{ fontSize: 12, color: 'var(--text-tertiary)', padding: '4px 10px' }}>+{order.orderItems.length - 3} more</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/orders/${order._id}/track`}><button className="btn-ghost" style={{ fontSize: 13, padding: '6px 14px' }}><MapPin size={13} /> Track</button></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
