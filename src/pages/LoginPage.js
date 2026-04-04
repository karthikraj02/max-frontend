import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 60%), var(--bg-primary)', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/"><div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 8 }}>PRO<span style={{ color: 'var(--accent)' }}>TECH</span></div></Link>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6 }}>Sign in to your account</p>
        </div>
        <div className="glass-card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Email</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--accent)' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input className="input-field" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: 14, marginTop: 8 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
