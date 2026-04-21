import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminAPI.getUsers({ limit: 50 }).then(r => setUsers(r.data.users)).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  const toggleActive = async (userId, isActive) => {
    try {
      await adminAPI.updateUser(userId, { isActive: !isActive });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !isActive } : u));
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 32 }}>Users ({users.length})</h1>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['User','Email','Role','Verified','Status','Action'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</td></tr>
              : users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {u.profileImage?.url ? <img src={u.profileImage.url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{u.name?.[0]}</div>}
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px' }}><span className={`badge ${u.role === 'admin' ? 'badge-accent' : ''}`} style={{ background: u.role === 'admin' ? undefined : 'var(--bg-elevated)', color: u.role === 'admin' ? undefined : 'var(--text-secondary)' }}>{u.role}</span></td>
                  <td style={{ padding: '14px 16px' }}><span className={`badge badge-${u.isVerified ? 'success' : 'warning'}`}>{u.isVerified ? 'Yes' : 'No'}</span></td>
                  <td style={{ padding: '14px 16px' }}><span className={`badge badge-${u.isActive ? 'success' : 'error'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ padding: '14px 16px' }}>
                    {u.role !== 'admin' && (
                      <button onClick={() => toggleActive(u._id, u.isActive)}
                        style={{ fontSize: 12, padding: '4px 12px', borderRadius: 8, border: `1px solid ${u.isActive ? 'var(--error)' : 'var(--success)'}`, color: u.isActive ? 'var(--error)' : 'var(--success)', background: 'transparent', cursor: 'pointer', transition: 'var(--transition)' }}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
