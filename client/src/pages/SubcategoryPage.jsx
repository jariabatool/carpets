import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductSlider from '../components/ProductSlider';
import './CategoryPage.css'; // Reuse the same CSS

export default function SubcategoryPage() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch subcategory details and products
    Promise.all([
      fetch(`/api/subcategory/${name}`).then(res => res.json()),
      fetch(`/api/products/subcategory/${name}`).then(res => res.json())
    ])
    .then(([subcategoryData, productsData]) => {
      setSubcategory(subcategoryData);
      setProducts(productsData);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error:', err);
      setLoading(false);
    });
  }, [name]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!subcategory) return <div className="error">Subcategory not found</div>;

  return (
    <div className="category-full-page">
      <h1>{subcategory.name}</h1>
      {subcategory.description && (
        <p className="category-description">{subcategory.description}</p>
      )}
      
      {products.length === 0 ? (
        <p>No products found in this subcategory.</p>
      ) : (
        <ProductSlider products={products} />
      )}
      
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Go Back</button>
    </div>
  );
}