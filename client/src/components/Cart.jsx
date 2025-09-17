// // import { useCart } from "../context/CartContext";
// // import "./Cart.css";
// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // export default function Cart() {
// //   const { cart, updateQuantity, removeFromCart } = useCart();
// //   const [isOpen, setIsOpen] = useState(false);
// //   const navigate = useNavigate();

// //   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

// //   const handleRemove = (item) => {
// //     const confirmed = window.confirm("Are you sure you want to remove this item?");
// //     if (confirmed) {
// //       removeFromCart(item._id, item.selectedVariant);
// //     }
// //   };

// //   return (
// //     <div className="cart-wrapper">
// //       {/* <div className="cart-icon" onClick={() => setIsOpen(!isOpen)}>
// //         🛒
// //         {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
// //       </div> */}
// //       <div className="cart-icon" onClick={() => setIsOpen(!isOpen)}>
// //         🛒
// //         {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
// //       </div>
// //       {isOpen && (
// //         <div className="cart-dropdown">
// //           <h3>Your Cart</h3>
// //           {cart.length === 0 ? (
// //             <p>No items in cart.</p>
// //           ) : (
// //             <>
// //               {cart.map((item) => (
// //                 <div className="cart-item" key={`${item._id}-${item.selectedVariant?.color}-${item.selectedVariant?.size}`}>
// //                   <img src={item.images?.[0]} alt={item.name} />
// //                   <div className="item-info">
// //                     <h4>{item.name}</h4>
// //                     {item.selectedVariant && (
// //                       <p className="variant-info">
// //                         Variant: {item.selectedVariant.color} / {item.selectedVariant.size}
// //                       </p>
// //                     )}
// //                     <p>${item.price}</p>
// //                     <div className="quantity-controls">
// //                       <button
// //                         onClick={() =>
// //                           updateQuantity(item._id, item.selectedVariant, item.quantity - 1)
// //                         }
// //                         disabled={item.quantity <= 1}
// //                       >
// //                         -
// //                       </button>
// //                       <span>{item.quantity}</span>
// //                       <button
// //                         onClick={() => {
// //                           if (item.quantity < item.availableQuantity) {
// //                             updateQuantity(item._id, item.selectedVariant, item.quantity + 1);
// //                           } else {
// //                             alert("No more available quantity");
// //                           }
// //                         }}
// //                       >
// //                         +
// //                       </button>
// //                       <button
// //                         className="remove-btn"
// //                         onClick={() => handleRemove(item)}
// //                       >
// //                         ❌
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //               <button
// //                 className="checkout-btn"
// //                 onClick={() => {
// //                   setIsOpen(false);
// //                   navigate("/checkout");
// //                 }}
// //               >
// //                 Proceed to Checkout
// //               </button>
// //             </>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// import { useCart } from "../context/CartContext";
// import "./Cart.css";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Cart() {
//   const { cart, updateQuantity, removeFromCart } = useCart();
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

//   const handleRemove = (item) => {
//     const confirmed = window.confirm("Are you sure you want to remove this item?");
//     if (confirmed) {
//       removeFromCart(item._id, item.selectedVariant);
//     }
//   };

//   const handleIncrease = (item) => {
//     if (item.quantity < item.availableQuantity) {
//       updateQuantity(item._id, item.selectedVariant, item.quantity + 1);
//     } else {
//       alert("No more available quantity for this variant.");
//     }
//   };

//   const handleDecrease = (item) => {
//     if (item.quantity > 1) {
//       updateQuantity(item._id, item.selectedVariant, item.quantity - 1);
//     }
//   };

//   return (
//     <div className="cart-wrapper">
//       <div className="cart-icon" onClick={() => setIsOpen(!isOpen)}>
//         🛒
//         {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
//       </div>

//       {isOpen && (
//         <div className="cart-dropdown">
//           <div className="cart-header">
//             <h3>Your Cart ({totalItems} items)</h3>
//             <button className="close-cart" onClick={() => setIsOpen(false)}>
//               ×
//             </button>
//           </div>
          
//           <div className="cart-content">
//             {cart.length === 0 ? (
//               <p className="empty-cart">No items in cart.</p>
//             ) : (
//               <>
//                 <div className="cart-items">
//                   {cart.map((item) => (
//                     <div className="cart-item" key={`${item._id}-${item.selectedVariant?.color}-${item.selectedVariant?.size}`}>
//                       <img src={item.images?.[0]} alt={item.name} />
//                       <div className="item-info">
//                         <h4>{item.name}</h4>
//                         {item.selectedVariant && (
//                           <p className="variant-info">
//                             {item.selectedVariant.color} / {item.selectedVariant.size}
//                           </p>
//                         )}
//                         <p className="item-price">${item.price}</p>
//                         <div className="quantity-controls">
//                           <button
//                             onClick={() => handleDecrease(item)}
//                             disabled={item.quantity <= 1}
//                           >
//                             −
//                           </button>
//                           <span>{item.quantity}</span>
//                           <button
//                             onClick={() => handleIncrease(item)}
//                           >
//                             +
//                           </button>
//                         </div>
//                         <button
//                           className="remove-btn"
//                           onClick={() => handleRemove(item)}
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="cart-footer">
//                   <button
//                     className="checkout-btn"
//                     onClick={() => {
//                       setIsOpen(false);
//                       navigate("/checkout");
//                     }}
//                   >
//                     Proceed to Checkout
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import "./Cart.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth(); // Get current user
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleRemove = (item) => {
    const confirmed = window.confirm("Are you sure you want to remove this item?");
    if (confirmed) {
      removeFromCart(item._id, item.selectedVariant);
    }
  };

  const handleIncrease = (item) => {
    // Check available quantity from selectedVariant instead of item.availableQuantity
    const availableQuantity = item.selectedVariant?.quantity || item.quantity;
    if (item.quantity < availableQuantity) {
      updateQuantity(item._id, item.selectedVariant, item.quantity + 1);
    } else {
      alert("No more available quantity for this variant.");
    }
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.selectedVariant, item.quantity - 1);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      alert("Please login to proceed to checkout");
      navigate("/login");
      return;
    }
    
    if (user.role !== 'buyer') {
      alert("Only buyers can proceed to checkout");
      return;
    }
    
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="cart-wrapper">
      <div className="cart-icon" onClick={() => setIsOpen(!isOpen)}>
        🛒
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </div>

      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <h3>
              {user ? `${user.name}'s Cart` : 'Your Cart'} 
              <span className="cart-item-count">({totalItems} items)</span>
            </h3>
            <button className="close-cart" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>
          
          <div className="cart-content">
            {cart.length === 0 ? (
              <p className="empty-cart">No items in cart.</p>
            ) : (
              <>
                {!user && (
                  <div className="guest-warning">
                    <p>⚠️ You are shopping as a guest. 
                    <button 
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/login");
                      }}
                      className="login-link"
                    >
                      Login
                    </button> to save your cart.</p>
                  </div>
                )}
                
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={`${item._id}-${item.selectedVariant?.color}-${item.selectedVariant?.size}`}>
                      <img src={item.images?.[0]} alt={item.name} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        {item.selectedVariant && (
                          <p className="variant-info">
                            {item.selectedVariant.color} / {item.selectedVariant.size}
                          </p>
                        )}
                        <p className="item-price">${item.price}</p>
                        <div className="quantity-controls">
                          <button
                            onClick={() => handleDecrease(item)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleIncrease(item)}
                            disabled={item.quantity >= (item.selectedVariant?.quantity || item.quantity)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemove(item)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="cart-footer">
                  <button
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={!user || user.role !== 'buyer'}
                  >
                    {!user ? 'Login to Checkout' : 
                     user.role !== 'buyer' ? 'Only buyers can checkout' : 
                     'Proceed to Checkout'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}