import React, { useEffect, useState } from 'react';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { adminAPI } from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminAPI.getDashboard().then(r => setStats(r.data.stats)).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  const StatCard = ({ icon, label, value, color }) => (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{loading ? '...' : value}</div>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
      </div>
    </div>
  );

  const STATUS_COLORS = { Pending: '#ff9f0a', Processing: '#6366f1', Paid: '#6366f1', Shipped: '#06b6d4', Delivered: '#30d158', Cancelled: '#ff453a' };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 32 }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={<Users size={22} />} label="Total Users" value={stats?.totalUsers?.toLocaleString() || 0} color="#6366f1" />
        <StatCard icon={<Package size={22} />} label="Products" value={stats?.totalProducts?.toLocaleString() || 0} color="#8b5cf6" />
        <StatCard icon={<ShoppingCart size={22} />} label="Total Orders" value={stats?.totalOrders?.toLocaleString() || 0} color="#06b6d4" />
        <StatCard icon={<TrendingUp size={22} />} label="Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} color="#30d158" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent Orders */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Recent Orders</h2>
          {loading ? <div style={{ color: 'var(--text-tertiary)' }}>Loading...</div>
            : stats?.recentOrders?.map(o => (
              <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>#{o._id.slice(-8).toUpperCase()}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{o.user?.name}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 100, background: (STATUS_COLORS[o.orderStatus] || '#6366f1') + '20', color: STATUS_COLORS[o.orderStatus] || '#6366f1' }}>{o.orderStatus}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>₹{o.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            ))}
        </div>

        {/* Low Stock */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Low Stock Alert</h2>
          {loading ? <div style={{ color: 'var(--text-tertiary)' }}>Loading...</div>
            : stats?.lowStockProducts?.length === 0
              ? <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>All products are well-stocked 🎉</p>
              : stats?.lowStockProducts?.map(p => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  <img src={p.images?.[0]?.url} alt={p.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{p.category}</div>
                  </div>
                  <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 100, background: p.stock === 0 ? 'rgba(255,69,58,0.15)' : 'rgba(255,159,10,0.15)', color: p.stock === 0 ? '#ff453a' : '#ff9f0a', fontWeight: 600 }}>{p.stock} left</span>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
