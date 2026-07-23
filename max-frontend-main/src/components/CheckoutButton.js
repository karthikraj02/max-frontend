// src/components/CheckoutButton.js
import React from 'react';
import { paymentAPI } from '../utils/api';

const CheckoutButton = ({ totalAmount }) => {
  const handlePayment = async () => {
    try {
      const { data } = await paymentAPI.createRazorpayOrder({ amount: totalAmount });
      if (!data.orderId) {
        alert(data.error || 'Order creation failed');
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "ProTech",
        description: `Order #${data.orderId}`,
        handler: function (response) {
          alert('Payment ID: ' + response.razorpay_payment_id);
        },
        prefill: {},
        theme: { color: "#1A202C" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert('Payment init error: ' + error.message);
      console.error(error);
    }
  };

  return (
    <button onClick={handlePayment}>
      Pay ₹{totalAmount}
    </button>
  );
};

export default CheckoutButton;
