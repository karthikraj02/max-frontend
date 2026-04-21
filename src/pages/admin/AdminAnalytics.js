import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Package, Users, BarChart2, PieChart as PieIcon,
} from 'lucide-react';
import { adminAPI } from '../../utils/api';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#30d158', '#ff9f0a', '#ff453a', '#ec4899', '#f59e0b', '#10b981'];

const card = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 };
const metricCard = (accent) => ({
  ...card,
  borderLeft: `3px solid ${accent}`,
});

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.name.toLowerCase().includes('revenue') || p.name.toLowerCase().includes('₹') ? `₹${Number(p.value).toLocaleString()}` : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    adminAPI.getAnalytics()
      .then(r => setData(r.data.analytics))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: 'var(--text-tertiary)' }}>
        Loading analytics...
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: 'var(--error)' }}>
        Failed to load analytics. Please try again.
      </div>
    );
  }

  const { summary, monthlyData, topProducts, categoryRevenue, orderStatusCounts } = data;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'revenue', label: 'Revenue & Profit' },
    { id: 'products', label: 'Product Analytics' },
    { id: 'customers', label: 'Customer Demand' },
  ];

  const tabStyle = (id) => ({
    padding: '8px 18px', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 500,
    cursor: 'pointer', transition: 'var(--transition)',
    background: activeTab === id ? 'var(--accent)' : 'transparent',
    color: activeTab === id ? 'white' : 'var(--text-secondary)',
    border: activeTab === id ? 'none' : '1px solid var(--border)',
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' }}>Analytics</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} style={tabStyle(t.id)} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
            <div style={metricCard('#6366f1')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>GROSS REVENUE</div>
                  <div style={{ fontSize: 26, fontWeight: 700 }}>₹{summary.grossRevenue.toLocaleString()}</div>
                </div>
                <DollarSign size={20} color="#6366f1" />
              </div>
            </div>
            <div style={metricCard('#30d158')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>NET REVENUE</div>
                  <div style={{ fontSize: 26, fontWeight: 700 }}>₹{summary.netRevenue.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>After GST deduction</div>
                </div>
                <TrendingUp size={20} color="#30d158" />
              </div>
            </div>
            <div style={metricCard('#ff9f0a')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>TAX COLLECTED</div>
                  <div style={{ fontSize: 26, fontWeight: 700 }}>₹{summary.taxCollected.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>GST (18%)</div>
                </div>
                <TrendingDown size={20} color="#ff9f0a" />
              </div>
            </div>
            <div style={metricCard('#06b6d4')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>CONVERSION RATE</div>
                  <div style={{ fontSize: 26, fontWeight: 700 }}>{summary.conversionRate}%</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{summary.paidOrders} paid / {summary.totalOrders} orders</div>
                </div>
                <ShoppingCart size={20} color="#06b6d4" />
              </div>
            </div>
          </div>

          {/* Stock Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div style={metricCard('#30d158')}>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>IN STOCK PRODUCTS</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--success)' }}>{summary.stockSummary.inStock}</div>
            </div>
            <div style={metricCard('#ff453a')}>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>OUT OF STOCK</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--error)' }}>{summary.stockSummary.outOfStock}</div>
            </div>
            <div style={metricCard('#8b5cf6')}>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>TOTAL STOCK UNITS</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{summary.stockSummary.totalStock?.toLocaleString()}</div>
            </div>
          </div>

          {/* Monthly Trend */}
          <div style={{ ...card, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <BarChart2 size={18} color="var(--accent)" />
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Monthly Revenue & Orders (Last 12 Months)</h2>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue (₹)" fill="#6366f1" radius={[3, 3, 0, 0]} />
                <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#06b6d4" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <PieIcon size={18} color="var(--accent)" />
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Order Status Breakdown</h2>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={orderStatusCounts}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%" cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={3}
                  >
                    {orderStatusCounts.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, name]} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top 5 Products */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <Package size={18} color="var(--accent)" />
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Top Products by Sales</h2>
              </div>
              {topProducts.slice(0, 5).map((p, i) => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: COLORS[i] + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: COLORS[i] }}>{i + 1}</div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{p.totalQty} units sold</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>₹{p.totalRevenue?.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── REVENUE & PROFIT TAB ── */}
      {activeTab === 'revenue' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Gross Revenue', value: `₹${summary.grossRevenue.toLocaleString()}`, color: '#6366f1' },
              { label: 'Total Tax (GST 18%)', value: `₹${summary.taxCollected.toLocaleString()}`, color: '#ff9f0a' },
              { label: 'Net Revenue', value: `₹${summary.netRevenue.toLocaleString()}`, color: '#30d158' },
            ].map(m => (
              <div key={m.label} style={metricCard(m.color)}>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>{m.label.toUpperCase()}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Net vs Gross Revenue Line Chart */}
          <div style={{ ...card, marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Gross vs Net Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                <Line type="monotone" dataKey="revenue" name="Gross Revenue (₹)" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="netRevenue" name="Net Revenue (₹)" stroke="#30d158" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="tax" name="Tax (₹)" stroke="#ff9f0a" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Profit/Loss Table */}
          <div style={card}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Monthly Profit & Loss Statement</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Month', 'Gross Revenue', 'Tax (GST)', 'Net Revenue', 'Orders'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...monthlyData].reverse().map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 500 }}>{row.label}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13 }}>₹{row.revenue.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--warning)' }}>₹{row.tax.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>₹{row.netRevenue.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13 }}>{row.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── PRODUCT ANALYTICS TAB ── */}
      {activeTab === 'products' && (
        <>
          {/* Category Revenue */}
          <div style={{ ...card, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <BarChart2 size={18} color="var(--accent)" />
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Revenue by Category</h2>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryRevenue} layout="vertical" margin={{ top: 4, right: 24, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="_id" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue (₹)" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  {categoryRevenue.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Full List */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Package size={18} color="var(--accent)" />
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Top 10 Products by Sales</h2>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Rank', 'Product', 'Units Sold', 'Revenue'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: COLORS[i % COLORS.length] + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: COLORS[i % COLORS.length] }}>{i + 1}</div>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 500 }}>{p.name || 'Unknown Product'}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13 }}>{p.totalQty} units</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>₹{p.totalRevenue?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── CUSTOMER DEMAND TAB ── */}
      {activeTab === 'customers' && (
        <>
          {/* User Growth Chart */}
          <div style={{ ...card, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Users size={18} color="var(--accent)" />
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>New Customer Registrations per Month</h2>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="users" name="New Users" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Demand by Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <PieIcon size={18} color="var(--accent)" />
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Category Demand Share</h2>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={categoryRevenue}
                    dataKey="revenue"
                    nameKey="_id"
                    cx="50%" cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={2}
                  >
                    {categoryRevenue.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Revenue']} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Order Volume Trend */}
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <ShoppingCart size={18} color="var(--accent)" />
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Order Volume Trend</h2>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" name="Orders" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Demand Table */}
          <div style={{ ...card, marginTop: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Category Demand Details</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Category', 'Total Orders', 'Revenue', 'Revenue Share'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categoryRevenue.map((c, i) => {
                  const totalRev = categoryRevenue.reduce((sum, x) => sum + x.revenue, 0);
                  const share = totalRev > 0 ? ((c.revenue / totalRev) * 100).toFixed(1) : 0;
                  return (
                    <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{c._id}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 13 }}>{c.orders}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>₹{c.revenue.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'var(--bg-elevated)', borderRadius: 3, maxWidth: 120 }}>
                            <div style={{ width: `${share}%`, height: '100%', background: COLORS[i % COLORS.length], borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
