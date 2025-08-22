// // import Cart from "./Cart";
// // import ThemeToggle from "./ThemeToggle";
// // import ProfileIcon from "./ProfileIcon";
// // import { Outlet, useNavigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// // import "./Layout.css";

// // export default function Layout() {
// //   const { user, loading } = useAuth();
// //   const navigate = useNavigate();

// //   // ⏳ Wait until user is loaded
// //   if (loading) return <div>Loading...</div>;

// //   // ❌ If no user, redirect to login
// //   if (!user) {
// //     navigate("/login");
// //     return null;
// //   }

// //   return (
// //     <>
// //       <header className="layout-header">
// //         <div className="layout-header-left">
// //           <h2> Carpet & Rugs Store</h2>
// //         </div>
// //         <div className="layout-header-right">
// //           {user?.role === 'buyer' && <Cart />}
// //           <ThemeToggle />
// //           <ProfileIcon />
// //         </div>
// //       </header>

// //       <main className="layout-main">
// //         <Outlet />
// //       </main>
// //     </>
// //   );
// // }
// import Cart from "./Cart";
// import ThemeToggle from "./ThemeToggle";
// import ProfileIcon from "./ProfileIcon";
// import { Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import "./Layout.css";

// export default function Layout() {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();

//   // ⏳ Wait until user is loaded
//   if (loading) return <div>Loading...</div>;

//   // ❌ If no user, redirect to login
//   if (!user) {
//     navigate("/login");
//     return null;
//   }

//   const handleLogoClick = () => {
//     navigate("/");
//   };

//   return (
//     <>
//       <header className="layout-header">
//         <div className="layout-header-left">
//           <h2 onClick={handleLogoClick}>🏪 Carpet & Rugs Store</h2>
//         </div>
        
//         <div className="layout-header-right">
//           <div className="header-actions">
//             {user?.role === 'buyer' && (
//               <div className="cart-wrapper action-item">
//                 <Cart />
//               </div>
//             )}
            
//             <div className="theme-toggle-wrapper action-item">
//               <ThemeToggle />
//             </div>
            
//             <div className="profile-icon-wrapper action-item">
//               <ProfileIcon />
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="layout-main">
//         <Outlet />
//       </main>
//     </>
//   );
// }
import Cart from "./Cart";
import ThemeToggle from "./ThemeToggle";
import ProfileIcon from "./ProfileIcon";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

export default function Layout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // ⏳ Wait until user is loaded
  if (loading) return <div>Loading...</div>;

  // ❌ If no user, redirect to login
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleOrdersClick = () => {
    navigate("/orders");
  };

  return (
    <>
      <header className="layout-header">
        <div className="layout-header-left">
          <h2 onClick={handleLogoClick}>🏪 Carpet & Rugs Store</h2>
        </div>
        
        <div className="layout-header-right">
          <div className="header-actions">
            {user?.role === 'buyer' && (
              <>
                <div className="action-item" onClick={handleOrdersClick} title="Your Orders">
                  📦
                </div>
                <div className="cart-wrapper action-item">
                  <Cart />
                </div>
              </>
            )}
            
            <div className="theme-toggle-wrapper action-item">
              <ThemeToggle />
            </div>
            
            <div className="profile-icon-wrapper action-item">
              <ProfileIcon />
            </div>
          </div>
        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>
    </>
  );
}