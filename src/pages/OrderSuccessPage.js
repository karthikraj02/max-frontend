import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { orderAPI } from '../utils/api';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { orderAPI.getById(id).then(r => setOrder(r.data.order)).catch(() => {}); }, [id]);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 24px' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          <CheckCircle size={72} color="var(--success)" style={{ margin: '0 auto 24px' }} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 12 }}>Order Placed!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8, fontSize: 16, lineHeight: 1.6 }}>
            Your payment was successful. We're getting your order ready.
          </p>
          {order && <p style={{ color: 'var(--text-tertiary)', fontSize: 13, marginBottom: 32 }}>Order #{order._id.toString().slice(-8).toUpperCase()}</p>}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/orders/${id}/track`}><button className="btn-primary"><Package size={16} /> Track Order</button></Link>
            <Link to="/products"><button className="btn-secondary">Continue Shopping <ArrowRight size={16} /></button></Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
