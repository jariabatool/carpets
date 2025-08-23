// // import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import Lightbox from "yet-another-react-lightbox";
// // import "yet-another-react-lightbox/styles.css";
// // import "./ProductDetailPage.css";
// // import { useCart } from "../context/CartContext.jsx"; // ✅ IMPORT HERE

// // export default function ProductDetailPage() {
// //   const { id } = useParams();
// //   const { addToCart } = useCart(); // ✅ USE INSIDE COMPONENT
// //   const [product, setProduct] = useState(null);
// //   const [open, setOpen] = useState(false);
// //   const [selectedIndex, setSelectedIndex] = useState(0);

// //   useEffect(() => {
// //     fetch(`/api/products/${id}`)
// //       .then((res) => res.json())
// //       .then((data) => setProduct(data))
// //       .catch((err) => console.error("Failed to load product:", err));
// //   }, [id]);

// //   if (!product) return <div className="loading">Loading...</div>;

// //   return (
// //     <div className="detail-page">
// //       <div className="product-detail-card">
// //         <div className="image-section">
// //           <img
// //             className="main-image"
// //             src={product.images?.[selectedIndex]}
// //             alt={product.name}
// //             onClick={() => setOpen(true)}
// //           />

// //           <div className="thumbnails">
// //             {product.images?.map((img, index) => (
// //               <img
// //                 key={index}
// //                 src={img}
// //                 alt={`${product.name}-${index}`}
// //                 className={`thumbnail ${selectedIndex === index ? "active-thumb" : ""}`}
// //                 onClick={() => setSelectedIndex(index)}
// //               />
// //             ))}
// //           </div>
// //         </div>

// //         <div className="detail-info">
// //           <h2>{product.name}</h2>
// //           <p className="description">{product.description}</p>
// //           <p className="price">${product.price}</p>
// //           {product.totalQuantity && (
// //             <p className="quantity-info">
// //               In Stock: {product.availableQuantity} / {product.totalQuantity}
// //             </p>
// //           )}
// //           <button
// //             className="add-to-cart-btn"
// //             onClick={() => addToCart(product)}
// //             disabled={product.availableQuantity <= 0}
// //           >
// //             {product.availableQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
// //           </button>
// //         </div>
// //       </div>

// //       {open && (
// //         <Lightbox
// //           open={open}
// //           close={() => setOpen(false)}
// //           index={selectedIndex}
// //           slides={product.images.map((img) => ({ src: img }))}
// //         />
// //       )}
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Lightbox from "yet-another-react-lightbox";
// import "yet-another-react-lightbox/styles.css";
// import "./ProductDetailPage.css";
// import { useCart } from "../context/CartContext.jsx";

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const { addToCart } = useCart();
//   const [product, setProduct] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [selectedColor, setSelectedColor] = useState("");
//   const [selectedSize, setSelectedSize] = useState("");

//   useEffect(() => {
//     fetch(`/api/products/${id}`)
//       .then((res) => res.json())
//       .then((data) => setProduct(data))
//       .catch((err) => console.error("Failed to load product:", err));
//   }, [id]);

//   if (!product) return <div className="loading">Loading...</div>;

//   // Extract unique color and size options from variants
//   const colors = [...new Set(product.variant?.map(v => v.color))];
//   const sizes = [...new Set(product.variant?.map(v => v.size))];

//   // Find the selected variant
//   const selectedVariant = product.variant?.find(v => v.color === selectedColor && v.size === selectedSize);

//   const handleAddToCart = () => {
//     if (!selectedVariant) {
//       alert("Please select color and size.");
//       return;
//     }

//     const productWithVariant = {
//       ...product,
//       price: selectedVariant.price,
//       selectedVariant: {
//         color: selectedColor,
//         size: selectedSize,
//         price: selectedVariant.price,
//       }
//     };

//     addToCart(productWithVariant);
//   };

//   return (
//     <div className="detail-page">
//       <div className="product-detail-card">
//         <div className="image-section">
//           <img
//             className="main-image"
//             src={product.images?.[selectedIndex]}
//             alt={product.name}
//             onClick={() => setOpen(true)}
//           />

//           <div className="thumbnails">
//             {product.images?.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt={`${product.name}-${index}`}
//                 className={`thumbnail ${selectedIndex === index ? "active-thumb" : ""}`}
//                 onClick={() => setSelectedIndex(index)}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="detail-info">
//           <h2>{product.name}</h2>
//           <p className="description">{product.description}</p>
//           <p className="price">${selectedVariant?.price || product.price}</p>
//           <p className="quantity-info">
//             In Stock: {product.availableQuantity} / {product.totalQuantity}
//           </p>

//           <div className="variant-selectors">
//             <label>
//               Color:
//               <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)}>
//                 <option value="">--Select--</option>
//                 {colors.map(color => (
//                   <option key={color} value={color}>{color}</option>
//                 ))}
//               </select>
//             </label>
//             <label>
//               Size:
//               <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
//                 <option value="">--Select--</option>
//                 {sizes.map(size => (
//                   <option key={size} value={size}>{size}</option>
//                 ))}
//               </select>
//             </label>
//           </div>

//           <button
//             className="add-to-cart-btn"
//             onClick={handleAddToCart}
//             disabled={!selectedVariant || selectedVariant.quantity <= 0}
//           >
//             {selectedVariant?.quantity > 0 ? "Add to Cart" : "Out of Stock"}
//           </button>
//         </div>
//       </div>

//       {open && (
//         <Lightbox
//           open={open}
//           close={() => setOpen(false)}
//           index={selectedIndex}
//           slides={product.images.map((img) => ({ src: img }))}
//         />
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./ProductDetailPage.css";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Failed to load product:", err));
  }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  // ✅ Use variants (plural)
  const colors = [...new Set(product.variants?.map(v => v.color))];
  const sizes = [...new Set(product.variants?.map(v => v.size))];

  // ✅ Match selected variant
  const selectedVariant = product.variants?.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select color and size.");
      return;
    }

    const productWithVariant = {
      ...product,
      price: selectedVariant.price, // ✅ always from variant
      selectedVariant: {
        color: selectedColor,
        size: selectedSize,
        price: selectedVariant.price,
      }
    };

    addToCart(productWithVariant);
  };

  return (
    <div className="detail-page">
      <div className="product-detail-card">
        <div className="image-section">
          <img
            className="main-image"
            src={product.images?.[selectedIndex]}
            alt={product.name}
            onClick={() => setOpen(true)}
          />

          <div className="thumbnails">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name}-${index}`}
                className={`thumbnail ${selectedIndex === index ? "active-thumb" : ""}`}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="detail-info">
          <h2>{product.name}</h2>
          <p className="description">{product.description}</p>

          {/* ✅ Always show price from selected variant */}
          <p className="price">
            {selectedVariant ? `$${selectedVariant.price}` : "Select a variant to see price"}
          </p>

          <p className="quantity-info">
            In Stock: {selectedVariant ? selectedVariant.quantity : 0} / {product.totalQuantity}
          </p>

          <div className="variant-selectors">
            <label>
              Color:
              <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)}>
                <option value="">--Select--</option>
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </label>
            <label>
              Size:
              <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
                <option value="">--Select--</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.quantity <= 0}
          >
            {selectedVariant?.quantity > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={selectedIndex}
          slides={product.images.map((img) => ({ src: img }))}
        />
      )}
    </div>
  );
}
