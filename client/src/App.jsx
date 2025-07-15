// // // // // // client/src/App.jsx
// // // // // import { useEffect, useState } from 'react';
// // // // // import { useNavigate } from 'react-router-dom';
// // // // // import ProductSlider from './components/ProductSlider';
// // // // // import Cart from './components/Cart';
// // // // // import './App.css';

// // // // // function App() {
// // // // //   const [previews, setPreviews] = useState({});
// // // // //   const [darkMode, setDarkMode] = useState(false);
// // // // //   const navigate = useNavigate();

// // // // //   const toggleTheme = () => setDarkMode(!darkMode);

// // // // //   useEffect(() => {
// // // // //     fetch('/api/products/preview')
// // // // //       .then((res) => res.json())
// // // // //       .then((data) => setPreviews(data))
// // // // //       .catch((err) => console.error('Error fetching preview data:', err));
// // // // //   }, []);

// // // // //   return (
// // // // //     <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
// // // // //       <button className="theme-toggle" onClick={toggleTheme}>
// // // // //         {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
// // // // //       </button>
      
// // // // //       {/* Cart Icon and Overlay */}
// // // // //       <Cart />

// // // // //       <header className="hero-banner">
// // // // //         <div className="overlay">
// // // // //           <h1>Welcome to Our Carpet & Rug Store</h1>
// // // // //         </div>
// // // // //       </header>

// // // // //       <div className="product-section">
// // // // //         {Object.entries(previews).map(([key, products]) => {
// // // // //           const [type, subcategory] = key.split('-');
// // // // //           return (
// // // // //             <div key={key} className="category-section">
// // // // //               <h2>{subcategory} {type}</h2>
// // // // //               <ProductSlider products={products} />
// // // // //               <button
// // // // //                 className="see-more"
// // // // //                 onClick={() => navigate(`/category/${type}/${subcategory}`)}
// // // // //               >
// // // // //                 See More
// // // // //               </button>
// // // // //             </div>
// // // // //           );
// // // // //         })}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default App;
// // // // import { useEffect, useState } from 'react';
// // // // import { useNavigate } from 'react-router-dom';
// // // // import ProductSlider from './components/ProductSlider';
// // // // import Cart from './components/Cart';
// // // // import './App.css';

// // // // function App() {
// // // //   const [previews, setPreviews] = useState({});
// // // //   const [darkMode, setDarkMode] = useState(false);
// // // //   const navigate = useNavigate();

// // // //   const toggleTheme = () => setDarkMode(!darkMode);

// // // //   useEffect(() => {
// // // //     fetch('/api/products/preview')
// // // //       .then((res) => res.json())
// // // //       .then((data) => setPreviews(data))
// // // //       .catch((err) => console.error('Error fetching preview data:', err));
// // // //   }, []);

// // // //   return (
// // // //     <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
// // // //       <div className="top-buttons">
// // // //         <button className="theme-toggle" onClick={toggleTheme}>
// // // //           {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
// // // //         </button>

// // // //         <button className="manage-btn" onClick={() => navigate("/manage-products")}>
// // // //           🛠️ Manage Products
// // // //         </button>
// // // //       </div>

// // // //       {/* Cart Icon and Overlay */}
// // // //       <Cart />

// // // //       <header className="hero-banner">
// // // //         <div className="overlay">
// // // //           <h1>Welcome to Our Carpet & Rug Store</h1>
// // // //         </div>
// // // //       </header>

// // // //       <div className="product-section">
// // // //         {Object.entries(previews).map(([key, products]) => {
// // // //           const [type, subcategory] = key.split('-');
// // // //           return (
// // // //             <div key={key} className="category-section">
// // // //               <h2>{subcategory} {type}</h2>
// // // //               <ProductSlider products={products} />
// // // //               <button
// // // //                 className="see-more"
// // // //                 onClick={() => navigate(`/category/${type}/${subcategory}`)}
// // // //               >
// // // //                 See More
// // // //               </button>
// // // //             </div>
// // // //           );
// // // //         })}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default App;
// // // import { useEffect, useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import ProductSlider from './components/ProductSlider';
// // // import Cart from './components/Cart';
// // // import './App.css';

// // // function App() {
// // //   const [previews, setPreviews] = useState({});
// // //   const [darkMode, setDarkMode] = useState(false);
// // //   const [user, setUser] = useState(null);
// // //   const navigate = useNavigate();

// // //   const toggleTheme = () => setDarkMode(!darkMode);

// // //   useEffect(() => {
// // //     // Load user from localStorage if available
// // //     const storedUser = localStorage.getItem("user");
// // //     if (storedUser) {
// // //       setUser(JSON.parse(storedUser));
// // //     }

// // //     // Fetch product previews
// // //     fetch('/api/products/preview')
// // //       .then((res) => res.json())
// // //       .then((data) => setPreviews(data))
// // //       .catch((err) => console.error('Error fetching preview data:', err));
// // //   }, []);

// // //   return (
// // //     <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
// // //       <div className="top-buttons">
// // //         <button className="theme-toggle" onClick={toggleTheme}>
// // //           {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
// // //         </button>

// // //         {/* Conditionally show Manage Products for seller */}
// // //         {user?.role === 'seller' && (
// // //           <button className="manage-btn" onClick={() => navigate("/manage-products")}>
// // //             🛠️ Manage Products
// // //           </button>
// // //         )}

// // //         {/* Show Login if no user is logged in */}
// // //         {!user && (
// // //           <button className="login-btn" onClick={() => navigate("/login")}>
// // //             🔐 Login
// // //           </button>
// // //         )}
// // //       </div>

// // //       {/* Cart Icon and Overlay */}
// // //       <Cart />

// // //       <header className="hero-banner">
// // //         <div className="overlay">
// // //           <h1>Welcome to Our Carpet & Rug Store</h1>
// // //         </div>
// // //       </header>

// // //       <div className="product-section">
// // //         {Object.entries(previews).map(([key, products]) => {
// // //           const [type, subcategory] = key.split('-');
// // //           return (
// // //             <div key={key} className="category-section">
// // //               <h2>{subcategory} {type}</h2>
// // //               <ProductSlider products={products} />
// // //               <button
// // //                 className="see-more"
// // //                 onClick={() => navigate(`/category/${type}/${subcategory}`)}
// // //               >
// // //                 See More
// // //               </button>
// // //             </div>
// // //           );
// // //         })}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default App;

// // import { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import ProductSlider from './components/ProductSlider';
// // import Cart from './components/Cart';
// // import './App.css';

// // function App() {
// //   const [previews, setPreviews] = useState({});
// //   const [darkMode, setDarkMode] = useState(false);
// //   const navigate = useNavigate();
// //   const [user, setUser] = useState(null);

// //   const toggleTheme = () => setDarkMode(!darkMode);

// //   useEffect(() => {
// //     const storedUser = localStorage.getItem('user');
// //     if (storedUser) {
// //       setUser(JSON.parse(storedUser));
// //     }

// //     fetch('/api/products/preview')
// //       .then((res) => res.json())
// //       .then((data) => setPreviews(data))
// //       .catch((err) => console.error('Error fetching preview data:', err));
// //   }, []);

// //   const handleLogout = () => {
// //     localStorage.removeItem('user');
// //     setUser(null);
// //     navigate('/login');
// //   };

// //   return (
// //     <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
// //       <div className="top-buttons">
// //         <button className="theme-toggle" onClick={toggleTheme}>
// //           {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
// //         </button>

// //         {user?.role === 'seller' ? (
// //           <button className="manage-btn" onClick={() => navigate("/manage-products")}>
// //             🛠️ Manage Products
// //           </button>
// //         ) : (
// //           <button className="login-btn" onClick={() => navigate("/login")}>
// //             Login
// //           </button>
// //         )}

// //         {user && (
// //           <button className="logout-btn" onClick={handleLogout}>
// //             Logout
// //           </button>
// //         )}
// //       </div>

// //       {/* ✅ Show Cart only if user is NOT a seller */}
// //       {user?.role !== 'seller' && <Cart />}

// //       <header className="hero-banner">
// //         <div className="overlay">
// //           <h1>Welcome to Our Carpet & Rug Store</h1>
// //         </div>
// //       </header>

// //       <div className="product-section">
// //         {Object.entries(previews).map(([key, products]) => {
// //           const [type, subcategory] = key.split('-');
// //           return (
// //             <div key={key} className="category-section">
// //               <h2>{subcategory} {type}</h2>
// //               <ProductSlider products={products} />
// //               <button
// //                 className="see-more"
// //                 onClick={() => navigate(`/category/${type}/${subcategory}`)}
// //               >
// //                 See More
// //               </button>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import ProductSlider from './components/ProductSlider';
// import Cart from './components/Cart';
// import './App.css';

// function App() {
//   const [previews, setPreviews] = useState({});
//   const [darkMode, setDarkMode] = useState(false);
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   useEffect(() => {
//     fetch('/api/products/preview')
//       .then(res => res.json())
//       .then(setPreviews)
//       .catch(console.error);
//   }, []);

//   const toggleTheme = () => setDarkMode(!darkMode);

//   return (
//     <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
//       <div className="top-buttons">
//         <button className="theme-toggle" onClick={toggleTheme}>
//           {darkMode ? '☀ Light' : '🌙 Dark'}
//         </button>
        
//         {user?.role === 'seller' && (
//           <button className="manage-btn" onClick={() => navigate('/manage-products')}>
//             🛠️ Manage Products
//           </button>
//         )}

//         <button className="profile-btn" onClick={() => navigate('/profile')}>
//           👤
//         </button>
//         <button onClick={logout}>🚪 Logout</button>
//       </div>

//       {user?.role === 'user' && <Cart />}

//       <header className="hero-banner">
//         <div className="overlay">
//           <h1>Welcome to Our Carpet & Rug Store</h1>
//         </div>
//       </header>

//       <div className="product-section">
//         {Object.entries(previews).map(([key, products]) => {
//           const [type, subcategory] = key.split('-');
//           return (
//             <div key={key} className="category-section">
//               <h2>{subcategory} {type}</h2>
//               <ProductSlider products={products} />
//               <button
//                 className="see-more"
//                 onClick={() => navigate(`/category/${type}/${subcategory}`)}
//               >
//                 See More
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default App;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductSlider from './components/ProductSlider';
import Cart from './components/Cart';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const [previews, setPreviews] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetch('/api/products/preview')
      .then((res) => res.json())
      .then((data) => setPreviews(data))
      .catch((err) => console.error('Error fetching preview data:', err));
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="top-buttons">
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>

        {user?.role === 'seller' && (
          <button className="manage-btn" onClick={() => navigate("/manage-products")}>
            🛠️ Manage Products
          </button>
        )}
      </div>

      {/* ✅ Only user sees cart */}
      {/* {user?.role === 'user' && <Cart />} */}

      <header className="hero-banner">
        <div className="overlay">
          <h1>Welcome to Our Carpet & Rug Store</h1>
        </div>
      </header>

      <div className="product-section">
        {Object.entries(previews).map(([key, products]) => {
          const [type, subcategory] = key.split('-');
          return (
            <div key={key} className="category-section">
              <h2>{subcategory} {type}</h2>
              <ProductSlider products={products} />
              <button
                className="see-more"
                onClick={() => navigate(`/category/${type}/${subcategory}`)}
              >
                See More
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
