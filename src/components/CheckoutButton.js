import React from 'react';

const CheckoutButton = ({ totalAmount }) => {
  // This should be the amount in INR (e.g., 111 for ₹111)
  const handlePayment = async () => {
    try {
      // 1. Hit your backend to create a Razorpay order
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalAmount }),
        }
      );

      const data = await response.json();
      if (!data.orderId) {
        alert(data.error || "Order creation failed");
        return;
      }

      // 2. Log your Razorpay Key (DEBUGGING)
      console.log("RAZORPAY KEY", process.env.REACT_APP_RAZORPAY_KEY_ID);

      // 3. Prepare Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount, // amount in paise
        currency: data.currency,
        order_id: data.orderId,
        name: "ProTech",
        description: `Order #${data.orderId}`,
        handler: function (response) {
          // TODO: You can verify payment or show confirmation here!
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {
          // Optionally prefill customer info
          // name: "Customer Name",
          // email: "customer@example.com",
          // contact: "9999999999",
        },
        theme: {
          color: "#1A202C",
        },
      };

      console.log("Razorpay Options", options);

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment init error: " + error.message);
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
