// import { useState } from "react";
// import { useCart } from "../context/CartContext";
// import { useNavigate } from "react-router-dom";
// import "./CheckoutPage.css";

// export default function CheckoutPage() {
//   const { cart, clearCart } = useCart();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     address: "",
//     paymentMethod: "cod"
//   });

//   const [submitted, setSubmitted] = useState(false);

//   const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const delivery = 250;
//   const grandTotal = totalAmount + delivery;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (cart.length === 0) return;

//     try {
//       const res = await fetch("/api/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           buyer: {
//             name: formData.name,
//             email: formData.email,
//             mobile: formData.mobile,
//             address: formData.address
//           },
//           products: cart.map((item) => ({
//             productId: item._id,
//             name: item.name,
//             sellerId: item.sellerId,
//             price: item.price,
//             quantity: item.quantity
//           })),
//           totalAmount,
//           deliveryCharges: delivery,
//           paymentMethod: formData.paymentMethod,
//           paid: formData.paymentMethod === "online"
//         })
//       });

//       if (res.ok) {
//         setSubmitted(true);
//         clearCart(); // ✅ clear only after success
//       } else {
//         alert("Order failed. Please try again.");
//       }
//     } catch (err) {
//       console.error("Order error:", err);
//       alert("Something went wrong.");
//     }
//   };

//   if (submitted) {
//     return (
//       <div className="checkout-container">
//         <h2>🎉 Order Confirmed!</h2>
//         <p>Thank you for your purchase. We’ll process it shortly.</p>
//         <button onClick={() => navigate("/")}>Go to Home Page</button>
//       </div>
//     );
//   }

//   return (
//     <div className="checkout-container">
//       <h2>Checkout</h2>
//       <form onSubmit={handleSubmit} className="checkout-form">
//         <input
//           type="text"
//           placeholder="Name"
//           required
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           required
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//         />
//         <input
//           type="tel"
//           placeholder="Mobile Number"
//           required
//           value={formData.mobile}
//           onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
//         />
//         <textarea
//           placeholder="Address"
//           required
//           value={formData.address}
//           onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//         ></textarea>

//         <select
//           value={formData.paymentMethod}
//           onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
//         >
//           <option value="cod">Cash on Delivery</option>
//           <option value="online">Online Payment</option>
//         </select>

//         <div className="summary">
//           <h4>Order Summary:</h4>
//           {cart.map((item) => (
//             <p key={item._id}>
//               {item.name} x {item.quantity} = ${item.price * item.quantity}
//             </p>
//           ))}
//           <p>Delivery Charges: ${delivery}</p>
//           <p><strong>Total: ${grandTotal}</strong></p>
//         </div>

//         <button type="submit" disabled={cart.length === 0}>Confirm Order</button>
//       </form>
//     </div>
//   );
// }
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    paymentMethod: "cod"
  });

  const [submitted, setSubmitted] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 250;
  const grandTotal = totalAmount + delivery;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer: {
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            address: formData.address
          },
          products: cart.map((item) => ({
            productId: item._id,
            name: item.name,
            sellerId: item.sellerId,
            price: item.price,
            quantity: item.quantity,
            variant: {
              color: item.selectedVariant?.color || null,
              size: item.selectedVariant?.size || null
            }
          })),
          totalAmount,
          deliveryCharges: delivery,
          paymentMethod: formData.paymentMethod,
          paid: formData.paymentMethod === "online"
        })
      });

      if (res.ok) {
        setSubmitted(true);
        clearCart();
      } else {
        alert("Order failed. Please try again.");
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong.");
    }
  };

  if (submitted) {
    return (
      <div className="checkout-container">
        <h2>🎉 Order Confirmed!</h2>
        <p>Thank you for your purchase. We’ll process it shortly.</p>
        <button onClick={() => navigate("/")}>Go to Home Page</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <input
          type="text"
          placeholder="Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Mobile Number"
          required
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
        />
        <textarea
          placeholder="Address"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        ></textarea>

        <select
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
        >
          <option value="cod">Cash on Delivery</option>
          <option value="online">Online Payment</option>
        </select>

        <div className="summary">
          <h4>Order Summary:</h4>
          {cart.map((item) => (
            <p key={item._id}>
              {item.name} ({item.selectedVariant?.color}, {item.selectedVariant?.size}) x {item.quantity} = ${item.price * item.quantity}
            </p>
          ))}
          <p>Delivery Charges: ${delivery}</p>
          <p><strong>Total: ${grandTotal}</strong></p>
        </div>

        <button type="submit" disabled={cart.length === 0}>Confirm Order</button>
      </form>
    </div>
  );
}
