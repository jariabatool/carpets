// // import { createContext, useContext, useState } from "react";

// // const CartContext = createContext();

// // export const CartProvider = ({ children }) => {
// //   const [cart, setCart] = useState([]);

// //   const addToCart = (product) => {
// //     setCart((prev) => {
// //       const exists = prev.find((item) => item._id === product._id);
// //       if (exists) {
// //         return prev.map((item) =>
// //           item._id === product._id
// //             ? { ...item, quantity: item.quantity + 1 }
// //             : item
// //         );
// //       } else {
// //         return [...prev, { ...product, quantity: 1 }];
// //       }
// //     });
// //   };

// //   const removeFromCart = (id) => {
// //     setCart((prev) => prev.filter((item) => item._id !== id));
// //   };

// //   const updateQuantity = (id, quantity) => {
// //     setCart((prev) =>
// //       prev.map((item) =>
// //         item._id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
// //       )
// //     );
// //   };

// //   // ✅ New: Clear cart completely
// //   const clearCart = () => {
// //     setCart([]);
// //   };

// //   return (
// //     <CartContext.Provider
// //       value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
// //     >
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };

// // export const useCart = () => useContext(CartContext);
// import { createContext, useContext, useState } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);

//   const addToCart = (product) => {
//     setCart((prev) => {
//       const exists = prev.find(
//         (item) =>
//           item._id === product._id &&
//           item.selectedVariant?.color === product.selectedVariant?.color &&
//           item.selectedVariant?.size === product.selectedVariant?.size
//       );

//       if (exists) {
//         return prev.map((item) =>
//           item._id === product._id &&
//           item.selectedVariant?.color === product.selectedVariant?.color &&
//           item.selectedVariant?.size === product.selectedVariant?.size
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         return [...prev, { ...product, quantity: 1 }];
//       }
//     });
//   };

//   const removeFromCart = (id, variant) => {
//     setCart((prev) =>
//       prev.filter(
//         (item) =>
//           item._id !== id ||
//           item.selectedVariant?.color !== variant?.color ||
//           item.selectedVariant?.size !== variant?.size
//       )
//     );
//   };

//   const updateQuantity = (id, variant, quantity) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item._id === id &&
//         item.selectedVariant?.color === variant?.color &&
//         item.selectedVariant?.size === variant?.size
//           ? { ...item, quantity: Math.max(quantity, 1) }
//           : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   return (
//     <CartContext.Provider
//       value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const exists = cart.find(
      (item) =>
        item._id === product._id &&
        JSON.stringify(item.selectedVariant) === JSON.stringify(product.selectedVariant)
    );

    if (exists) {
      setCart(
        cart.map((item) =>
          item._id === product._id &&
          JSON.stringify(item.selectedVariant) === JSON.stringify(product.selectedVariant)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId, variant) => {
    setCart(cart.filter(item => !(item._id === productId && JSON.stringify(item.selectedVariant) === JSON.stringify(variant))));
  };

  const updateQuantity = (productId, variant, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(
      cart.map((item) =>
        item._id === productId &&
        JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
