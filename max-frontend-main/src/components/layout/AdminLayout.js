import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, X, ExternalLink, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', to: '/admin' },
    { icon: <Package size={18} />, label: 'Products', to: '/admin/products' },
    { icon: <ShoppingCart size={18} />, label: 'Orders', to: '/admin/orders' },
    { icon: <Users size={18} />, label: 'Users', to: '/admin/users' },
    { icon: <BarChart2 size={18} />, label: 'Analytics', to: '/admin/analytics' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div style={{
        width: collapsed ? 64 : 240, flexShrink: 0, background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100,
      }}>
        {/* Header */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!collapsed && <span style={{ fontSize: 16, fontWeight: 700 }}>NEXUS <span style={{ color: 'var(--accent)' }}>ADMIN</span></span>}
          <button className="btn-ghost" style={{ padding: 6 }} onClick={() => setCollapsed(c => !c)}>
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/admin'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: 14,
                color: isActive ? 'white' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent)' : 'transparent',
                transition: 'var(--transition)', fontWeight: isActive ? 500 : 400,
                overflow: 'hidden', whiteSpace: 'nowrap',
              })}
              onMouseEnter={(e) => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={(e) => { if (!e.currentTarget.style.background.includes('var(--accent)')) e.currentTarget.style.background = 'transparent'; }}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button className="btn-ghost" style={{ justifyContent: 'flex-start', gap: 12, padding: '10px 12px', fontSize: 14, overflow: 'hidden', whiteSpace: 'nowrap' }}
            onClick={() => navigate('/')}>
            <ExternalLink size={18} />{!collapsed && 'View Store'}
          </button>
          <button className="btn-ghost" style={{ justifyContent: 'flex-start', gap: 12, padding: '10px 12px', fontSize: 14, color: 'var(--error)', overflow: 'hidden', whiteSpace: 'nowrap' }}
            onClick={() => { logout(); navigate('/login'); }}>
            <LogOut size={18} />{!collapsed && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: collapsed ? 64 : 240, transition: 'margin-left 0.25s ease', minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{ height: 60, borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--accent)' }}>Administrator</div>
            </div>
            {user?.profileImage?.url
              ? <img src={user.profileImage.url} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
              : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>{user?.name?.[0]}</div>
            }
          </div>
        </div>
        <div style={{ padding: 24 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
