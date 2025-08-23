// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import ProductSlider from '../components/ProductSlider';
// import FilterModal from '../components/FilterModal';
// import './SubcategoryPage.css';

// export default function SubcategoryPage() {
//   const { name } = useParams();
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [subcategory, setSubcategory] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showFilters, setShowFilters] = useState(false);
//   const [filterMeta, setFilterMeta] = useState(null);
//   const [activeFilters, setActiveFilters] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     Promise.all([
//       fetch(`/api/subcategory/${name}`).then(res => res.json()),
//       fetch(`/api/products/subcategory/${name}`).then(res => res.json()),
//       fetch(`/api/filter-meta?subcategory=${name}`).then(res => res.json())
//     ])
//     .then(([subcategoryData, productsData, filterMetaData]) => {
//       setSubcategory(subcategoryData);
//       setProducts(productsData);
//       setFilteredProducts(productsData);
//       setFilterMeta(filterMetaData);
//       setLoading(false);
//     })
//     .catch(err => {
//       console.error('Error:', err);
//       setLoading(false);
//     });
//   }, [name]);

//   const applyFilters = (filters) => {
//     setActiveFilters(filters);
    
//     let filtered = [...products];
    
//     if (filters.minPrice || filters.maxPrice) {
//       filtered = filtered.filter(product => {
//         const minPrice = filters.minPrice ? Number(filters.minPrice) : 0;
//         const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
//         return product.variants.some(variant => 
//           variant.price >= minPrice && variant.price <= maxPrice
//         );
//       });
//     }
    
//     if (filters.colors && filters.colors.length > 0) {
//       filtered = filtered.filter(product =>
//         product.variants.some(variant =>
//           filters.colors.includes(variant.color)
//         )
//       );
//     }
    
//     if (filters.sizes && filters.sizes.length > 0) {
//       filtered = filtered.filter(product =>
//         product.variants.some(variant =>
//           filters.sizes.includes(variant.size)
//         )
//       );
//     }
    
//     if (filters.sort) {
//       switch (filters.sort) {
//         case 'price-low':
//           filtered.sort((a, b) => {
//             const aMinPrice = Math.min(...a.variants.map(v => v.price));
//             const bMinPrice = Math.min(...b.variants.map(v => v.price));
//             return aMinPrice - bMinPrice;
//           });
//           break;
//         case 'price-high':
//           filtered.sort((a, b) => {
//             const aMaxPrice = Math.max(...a.variants.map(v => v.price));
//             const bMaxPrice = Math.max(...b.variants.map(v => v.price));
//             return bMaxPrice - aMaxPrice;
//           });
//           break;
//         case 'newest':
//           filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//           break;
//         default:
//           break;
//       }
//     }
    
//     setFilteredProducts(filtered);
//     setShowFilters(false);
//   };

//   const clearFilters = () => {
//     setActiveFilters({});
//     setFilteredProducts(products);
//   };

//   const hasActiveFilters = Object.keys(activeFilters).length > 0;

//   if (loading) return <div className="loading">Loading...</div>;
//   if (!subcategory) return <div className="error">Subcategory not found</div>;

//   return (
//     <div className="subcategory-full-page">
//       {/* Header Section */}
//       <div className="subcategory-header">
//         <div className="header-content">
//           <div className="header-left">
//             <h1>{subcategory.name}</h1>
//             {subcategory.description && (
//               <p className="subcategory-description">{subcategory.description}</p>
//             )}
//           </div>
          
//           <div className="header-right">
//             <button 
//               className="filter-btn"
//               onClick={() => setShowFilters(true)}
//             >
//               <span className="filter-icon">🎛️</span>
//               Filters
//               {hasActiveFilters && <span className="filter-badge">•</span>}
//             </button>
//           </div>
//         </div>
        
//         {hasActiveFilters && (
//           <div className="active-filters-container">
//             <div className="active-filters">
//               <span className="filters-label">Active filters:</span>
//               <div className="filter-tags">
//                 {activeFilters.minPrice && (
//                   <span className="filter-tag">Min ₹{activeFilters.minPrice}</span>
//                 )}
//                 {activeFilters.maxPrice && (
//                   <span className="filter-tag">Max ₹{activeFilters.maxPrice}</span>
//                 )}
//                 {activeFilters.colors?.map(color => (
//                   <span key={color} className="filter-tag color-tag">
//                     🎨 {color}
//                   </span>
//                 ))}
//                 {activeFilters.sizes?.map(size => (
//                   <span key={size} className="filter-tag size-tag">
//                     📏 {size}
//                   </span>
//                 ))}
//               </div>
//               <button className="clear-filters-btn" onClick={clearFilters}>
//                 🗑️ Clear All
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Products Section */}
//       <div className="products-container">
//         {filteredProducts.length === 0 ? (
//           <div className="no-products">
//             <div className="no-products-icon">🔍</div>
//             <h3>No products found</h3>
//             <p>{hasActiveFilters ? 'Try adjusting your filters' : 'Check back later for new arrivals'}</p>
//             {hasActiveFilters && (
//               <button className="clear-filters-btn large" onClick={clearFilters}>
//                 Clear All Filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="products-header">
//               <span className="products-count">
//                 {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
//               </span>
//             </div>
//             <div  className="slider-container">
//             <ProductSlider products={filteredProducts} />
//             </div>
//           </>
//         )}
//       </div>

//       <button className="back-btn" onClick={() => navigate(-1)}>⬅ Go Back</button>

//       {showFilters && filterMeta && (
//         <FilterModal
//           filterMeta={filterMeta}
//           currentFilters={activeFilters}
//           onApply={applyFilters}
//           onClose={() => setShowFilters(false)}
//         />
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FilterModal from '../components/FilterModal';
import './SubcategoryPage.css';

export default function SubcategoryPage() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterMeta, setFilterMeta] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`/api/subcategory/${name}`).then(res => res.json()),
      fetch(`/api/products/subcategory/${name}`).then(res => res.json()),
      fetch(`/api/filter-meta?subcategory=${name}`).then(res => res.json())
    ])
      .then(([subcategoryData, productsData, filterMetaData]) => {
        setSubcategory(subcategoryData);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setFilterMeta(filterMetaData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, [name]);

  const applyFilters = (filters) => {
    setActiveFilters(filters);

    let filtered = [...products];

    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter(product => {
        const minPrice = filters.minPrice ? Number(filters.minPrice) : 0;
        const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
        return product.variants.some(variant =>
          variant.price >= minPrice && variant.price <= maxPrice
        );
      });
    }

    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.variants.some(variant =>
          filters.colors.includes(variant.color)
        )
      );
    }

    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.variants.some(variant =>
          filters.sizes.includes(variant.size)
        )
      );
    }

    if (filters.sort) {
      switch (filters.sort) {
        case 'price-low':
          filtered.sort((a, b) => {
            const aMinPrice = Math.min(...a.variants.map(v => v.price));
            const bMinPrice = Math.min(...b.variants.map(v => v.price));
            return aMinPrice - bMinPrice;
          });
          break;
        case 'price-high':
          filtered.sort((a, b) => {
            const aMaxPrice = Math.max(...a.variants.map(v => v.price));
            const bMaxPrice = Math.max(...b.variants.map(v => v.price));
            return bMaxPrice - aMaxPrice;
          });
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
    }

    setFilteredProducts(filtered);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setFilteredProducts(products);
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  if (loading) return <div className="loading">Loading...</div>;
  if (!subcategory) return <div className="error">Subcategory not found</div>;

  return (
    <div className="subcategory-full-page">
      {/* Header Section */}
      <div className="subcategory-header">
        <div className="header-content">
          <div className="header-left">
            <h1>{subcategory.name}</h1>
            {subcategory.description && (
              <p className="subcategory-description">{subcategory.description}</p>
            )}
          </div>

          <div className="header-right">
            <button
              className="filter-btn"
              onClick={() => setShowFilters(true)}
            >
              <span className="filter-icon">🎛️</span>
              Filters
              {hasActiveFilters && <span className="filter-badge">•</span>}
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="active-filters-container">
            <div className="active-filters">
              <span className="filters-label">Active filters:</span>
              <div className="filter-tags">
                {activeFilters.minPrice && (
                  <span className="filter-tag">Min ₹{activeFilters.minPrice}</span>
                )}
                {activeFilters.maxPrice && (
                  <span className="filter-tag">Max ₹{activeFilters.maxPrice}</span>
                )}
                {activeFilters.colors?.map(color => (
                  <span key={color} className="filter-tag color-tag">
                    🎨 {color}
                  </span>
                ))}
                {activeFilters.sizes?.map(size => (
                  <span key={size} className="filter-tag size-tag">
                    📏 {size}
                  </span>
                ))}
              </div>
              <button className="clear-filters-btn" onClick={clearFilters}>
                🗑️ Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className="products-container">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">🔍</div>
            <h3>No products found</h3>
            <p>{hasActiveFilters ? 'Try adjusting your filters' : 'Check back later for new arrivals'}</p>
            {hasActiveFilters && (
              <button className="clear-filters-btn large" onClick={clearFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="products-header">
              <span className="products-count">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {/* Product Grid Instead of Slider */}
            <div className="product-grid">
              {filteredProducts.map(product => (
                <div key={product._id} className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
                  <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">
                      From ₹{Math.min(...product.variants.map(v => v.price))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Go Back</button>

      {showFilters && filterMeta && (
        <FilterModal
          filterMeta={filterMeta}
          currentFilters={activeFilters}
          onApply={applyFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}
