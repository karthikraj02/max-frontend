// src/pages/CheckoutPage.js

import React from 'react';
import CheckoutButton from '../components/CheckoutButton'; // <-- New, see code below

const CheckoutPage = () => {
  // You will probably get totalAmount from CartContext or your checkout state
  const totalAmount = 111; // Replace with actual amount logic!

  return (
    <div>
      <h2>Checkout</h2>
      {/* Your shipping, order summary, etc. */}
      <CheckoutButton totalAmount={totalAmount} />
    </div>
  );
};

export default CheckoutPage;
