import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await authAPI.forgotPassword({ email }); setStep(2); toast.success('OTP sent!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await authAPI.resetPassword({ email, otp, newPassword }); toast.success('Password reset! Please login.'); navigate('/login'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/"><div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 8 }}>NEXUS<span style={{ color: 'var(--accent)' }}>STORE</span></div></Link>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Reset Password</h1>
        </div>
        <div className="glass-card" style={{ padding: 32 }}>
          {step === 1 ? (
            <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Email Address</label>
                <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: 14 }}>{loading ? 'Sending...' : 'Send OTP'}</button>
            </form>
          ) : (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>OTP</label>
                <input className="input-field" placeholder="6-digit code" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} maxLength={6} style={{ fontSize: 24, letterSpacing: 8, textAlign: 'center' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>New Password</label>
                <input className="input-field" type="password" placeholder="Min 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} />
              </div>
              <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: 14 }}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            </form>
          )}
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
