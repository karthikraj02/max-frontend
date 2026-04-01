import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, paymentAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cartItems, subtotal, tax, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: user?.phone || '',
    street: user?.address?.street || '', city: user?.address?.city || '',
    state: user?.address?.state || '', pincode: user?.address?.pincode || '', country: 'India',
  });

  const handleAddressChange = e => setAddress(a => ({ ...a, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // 1. Create order in DB
      const orderPayload = {
        orderItems: cartItems.map(i => ({ product: i._id, name: i.name, image: i.images?.[0]?.url || '', price: i.discount > 0 ? Math.round(i.price * (1 - i.discount / 100)) : i.price, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod: 'razorpay',
      };
      const { data: orderData } = await orderAPI.create(orderPayload);
      const dbOrder = orderData.order;

      // 2. Create Razorpay order
      const { data: rpData } = await paymentAPI.createRazorpayOrder({ amount: total, orderId: dbOrder._id });

      // 3. Open Razorpay checkout
      const options = {
        key: rpData.keyId,
        amount: rpData.amount,
        currency: rpData.currency,
        name: 'NexusStore',
        description: `Order #${dbOrder._id.toString().slice(-8).toUpperCase()}`,
        order_id: rpData.orderId,
        prefill: { name: user.name, email: user.email, contact: address.phone },
        theme: { color: '#6366f1' },
        handler: async (response) => {
          try {
            await orderAPI.markPaid(dbOrder._id, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            navigate(`/order-success/${dbOrder._id}`);
          } catch {
            toast.error('Payment verification failed. Contact support.');
            navigate(`/orders`);
          }
        },
        modal: { ondismiss: () => { toast.error('Payment cancelled'); setLoading(false); } },
      };

      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => { const rp = new window.Razorpay(options); rp.open(); };
        document.body.appendChild(script);
      } else {
        const rp = new window.Razorpay(options);
        rp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = 'text', required = true, half }) => (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>{label}</label>
      <input className="input-field" type={type} name={name} value={address[name]} onChange={handleAddressChange} required={required} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 40 }}>Checkout</h1>

        {/* Steps */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 40 }}>
          {['Shipping', 'Review & Pay'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: i < step ? 'pointer' : 'default' }} onClick={() => i < step && setStep(i + 1)}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= i + 1 ? 'var(--accent)' : 'var(--bg-card)', border: `1px solid ${step >= i + 1 ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: step >= i + 1 ? 'white' : 'var(--text-tertiary)' }}>{i + 1}</div>
                <span style={{ fontSize: 14, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{s}</span>
              </div>
              {i < 1 && <div style={{ width: 40, height: 1, background: 'var(--border)', margin: '0 8px' }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          <div>
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="glass-card" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <MapPin size={18} color="var(--accent)" />
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>Shipping Address</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <InputField label="Full Name" name="fullName" />
                    <InputField label="Phone" name="phone" type="tel" half />
                    <InputField label="Street Address" name="street" />
                    <InputField label="City" name="city" half />
                    <InputField label="State" name="state" half />
                    <InputField label="Pincode" name="pincode" half />
                  </div>
                  <button className="btn-primary" style={{ marginTop: 24, width: '100%', justifyContent: 'center', padding: 14 }}
                    onClick={() => { if (Object.values(address).every(v => v)) setStep(2); else toast.error('Please fill all fields'); }}>
                    Continue to Review
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="glass-card" style={{ padding: 28, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <MapPin size={16} color="var(--accent)" />
                    <span style={{ fontSize: 15, fontWeight: 600 }}>Delivering to</span>
                    <button className="btn-ghost" style={{ marginLeft: 'auto', fontSize: 12 }} onClick={() => setStep(1)}>Change</button>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{address.fullName} · {address.phone}<br />{address.street}, {address.city}, {address.state} {address.pincode}</p>
                </div>
                <div className="glass-card" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <CreditCard size={18} color="var(--accent)" />
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>Order Items ({cartItems.length})</h2>
                  </div>
                  {cartItems.map(item => {
                    const price = item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price;
                    return (
                      <div key={item._id} style={{ display: 'flex', gap: 14, paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid var(--border)' }}>
                        <img src={item.images?.[0]?.url} alt={item.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', background: 'var(--bg-elevated)' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Qty: {item.quantity}</div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>₹{(price * item.quantity).toLocaleString()}</div>
                      </div>
                    );
                  })}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'var(--accent-subtle)', borderRadius: 10, marginTop: 8 }}>
                    <Lock size={14} color="var(--accent)" />
                    <span style={{ fontSize: 12, color: 'var(--accent)' }}>Secured by Razorpay. Your payment info is encrypted.</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order total */}
          <div className="glass-card" style={{ padding: 24, position: 'sticky', top: 80 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Price Details</h3>
            {[['Items Total', subtotal], ['GST (18%)', tax], ['Shipping', shipping === 0 ? 'FREE' : shipping]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{l}</span>
                <span style={{ color: v === 'FREE' ? 'var(--success)' : 'inherit', fontWeight: 500 }}>{v === 'FREE' ? 'FREE' : `₹${v.toLocaleString()}`}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 4, display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>₹{total.toLocaleString()}</span>
            </div>
            {step === 2 && (
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15 }}
                onClick={handlePlaceOrder} disabled={loading}>
                {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.container>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
