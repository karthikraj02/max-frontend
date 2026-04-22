// src/components/CheckoutButton.js
import React from 'react';

const CheckoutButton = ({ totalAmount }) => {
  const handlePayment = async () => {
    try {
      // Call backend to create order
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/payment/create-order`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount }),
        }
      );
      const data = await response.json();
      if (!data.orderId) {
        alert(data.error || 'Order creation failed');
        return;
      }

      // Razorpay key debug
      console.log('RAZORPAY KEY', process.env.REACT_APP_RAZORPAY_KEY_ID);

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

      console.log('Razorpay Options', options);
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
