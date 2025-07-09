// // client/src/pages/CategoryPage.jsx
// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import ProductSlider from '../components/ProductSlider';
// import './CategoryPage.css';

// export default function CategoryPage() {
//   const { type, subcategory } = useParams();
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(`/api/products?type=${type}&subcategory=${subcategory}`)
//       .then(res => res.json())
//       .then(data => setProducts(data))
//       .catch(err => console.error('Error:', err));
//   }, [type, subcategory]);

//   return (
//     <div className="category-full-page">
//       <h1>{subcategory} {type}</h1>
//       {products.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <ProductSlider products={products} />
//       )}
//       <button className="back-btn" onClick={() => navigate(-1)}>⬅ Go Back</button>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductSlider from '../components/ProductSlider';
import './CategoryPage.css';

export default function CategoryPage() {
  const { type, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/products?type=${type}&subcategory=${subcategory}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error:', err));
  }, [type, subcategory]);

  return (
    <div className="category-full-page">
      <h1>{subcategory} {type}</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        // If ProductSlider is updated to handle variants, pass products directly
        <ProductSlider products={products} />
      )}
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Go Back</button>
    </div>
  );
}
