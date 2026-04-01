import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Package, Truck, Home, CreditCard } from 'lucide-react';
import { orderAPI } from '../utils/api';

const STEPS = [
  { status: 'Pending', icon: <Circle size={18} />, label: 'Order Placed' },
  { status: 'Paid', icon: <CreditCard size={18} />, label: 'Payment Confirmed' },
  { status: 'Processing', icon: <Package size={18} />, label: 'Processing' },
  { status: 'Shipped', icon: <Truck size={18} />, label: 'Shipped' },
  { status: 'Out for Delivery', icon: <Truck size={18} />, label: 'Out for Delivery' },
  { status: 'Delivered', icon: <Home size={18} />, label: 'Delivered' },
];

const STATUS_ORDER = ['Pending', 'Paid', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { orderAPI.getById(id).then(r => setOrder(r.data.order)).catch(()=>{}).finally(()=>setLoading(false)); }, [id]);

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'var(--accent)' }}>Loading...</div></div>;
  if (!order) return null;

  const currentIdx = STATUS_ORDER.indexOf(order.orderStatus);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>Track Order</h1>
        <p style={{ color: 'var(--text-tertiary)', marginBottom: 40, fontSize: 14 }}>Order #{order._id.slice(-8).toUpperCase()}</p>

        {/* Tracking steps */}
        <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
          {STEPS.map((step, i) => {
            const stepIdx = STATUS_ORDER.indexOf(step.status);
            const done = stepIdx <= currentIdx;
            const active = stepIdx === currentIdx;
            return (
              <div key={step.status} style={{ display: 'flex', gap: 20, position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <motion.div initial={{ scale: 0.5 }} animate={{ scale: done ? 1 : 0.8 }}
                    style={{ width: 40, height: 40, borderRadius: '50%', background: done ? 'var(--accent)' : 'var(--bg-elevated)', border: `2px solid ${done ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: done ? 'white' : 'var(--text-tertiary)', transition: 'all 0.3s', flexShrink: 0, zIndex: 1 }}>
                    {done && stepIdx < currentIdx ? <CheckCircle size={18} /> : step.icon}
                  </motion.div>
                  {i < STEPS.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 32, background: stepIdx < currentIdx ? 'var(--accent)' : 'var(--border)', margin: '4px 0', transition: 'background 0.3s' }} />}
                </div>
                <div style={{ paddingBottom: i < STEPS.length - 1 ? 24 : 0, paddingTop: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: done ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{step.label}</div>
                  {active && <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 2 }}>Current Status</div>}
                  {order.statusHistory?.find(h => h.status === step.status) && (
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{new Date(order.statusHistory.find(h => h.status === step.status).timestamp).toLocaleString()}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order details */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Order Items</h3>
          {order.orderItems?.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 14, marginBottom: 14, borderBottom: i < order.orderItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <img src={item.image} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', background: 'var(--bg-elevated)' }} />
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div><div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Qty: {item.quantity}</div></div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>Total: ₹{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
