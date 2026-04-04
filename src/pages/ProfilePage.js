import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI, authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: { street: user?.address?.street || '', city: user?.address?.city || '', state: user?.address?.state || '', pincode: user?.address?.pincode || '' } });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await userAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('avatar', file);
      const { data } = await userAPI.uploadAvatar(fd);
      updateUser({ profileImage: data.profileImage });
      toast.success('Avatar updated!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await authAPI.changePassword(pwForm);
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 15, outline: 'none' };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 680 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 40 }}>My Profile</h1>

        {/* Avatar */}
        <div className="glass-card" style={{ padding: 28, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ position: 'relative' }}>
            {user?.profileImage?.url
              ? <img src={user.profileImage.url} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
              : <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'var(--accent)', border: '2px solid var(--border)' }}>{user?.name?.[0]}</div>}
            <label style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: uploading ? 'var(--text-tertiary)' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: uploading ? 'not-allowed' : 'pointer', border: '2px solid var(--bg-card)' }}>
              <Camera size={13} color="white" />
              <input type="file" accept="image/*" onChange={handleAvatar} disabled={uploading} style={{ display: 'none' }} />
            </label>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{user?.email}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}><span className={`badge ${user?.isVerified ? 'badge-success' : 'badge-warning'}`}>{user?.isVerified ? 'Verified' : 'Unverified'}</span><span className="badge badge-accent">{user?.role}</span></div>
          </div>
        </div>

        {/* Edit profile */}
        <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Edit Profile</h2>
          <form onSubmit={handleProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={labelStyle}>Full Name</label><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            </div>
            <div><label style={labelStyle}>Street Address</label><input style={inputStyle} value={form.address.street} onChange={e => setForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {['city', 'state', 'pincode'].map(k => (
                <div key={k}><label style={labelStyle}>{k.charAt(0).toUpperCase() + k.slice(1)}</label><input style={inputStyle} value={form.address[k]} onChange={e => setForm(f => ({ ...f, address: { ...f.address, [k]: e.target.value } }))} /></div>
              ))}
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
              <Save size={15} />{loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Change Password</h2>
          <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={labelStyle}>Current Password</label><input style={inputStyle} type="password" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} required /></div>
            <div><label style={labelStyle}>New Password</label><input style={inputStyle} type="password" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={8} /></div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>{loading ? 'Updating...' : 'Update Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
