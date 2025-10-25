import Cart from "./Cart";
import ThemeToggle from "./ThemeToggle";
import ProfileIcon from "./ProfileIcon";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import NavMenu from './NavMenu'; // Import the new NavMenu component
import "./Layout.css";

export default function Layout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // ⏳ Wait until user is loaded
  if (loading) return <div className="loading-container">Loading...</div>;

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
          <h2 onClick={handleLogoClick} className="logo">
            🏪 Carpet & Rugs Store
          </h2>
        </div>
        
        <div className="layout-header-right">
          <div className="header-actions">
            {user?.role === 'buyer' && (
              <>
                <div className="action-item" onClick={handleOrdersClick} title="Your Orders">
                  <span className="action-icon">📦</span>
                  <span className="action-text">Orders</span>
                </div>
                <div className="cart-wrapper action-item">
                  <Cart />
                </div>
              </>
            )}
            
            {user?.role === 'seller' && (
              <div className="action-item" onClick={() => navigate('/manage-products')} title="Manage Products">
                <span className="action-icon">📦</span>
                <span className="action-text">My Products</span>
              </div>
            )}
            
            {user?.role === 'admin' && (
              <div className="action-item" onClick={() => navigate('/admin/dashboard')} title="Admin Dashboard">
                <span className="action-icon">📊</span>
                <span className="action-text">Dashboard</span>
              </div>
            )}
            
            <div className="theme-toggle-wrapper action-item">
              <ThemeToggle />
            </div>
            
            <div className="profile-icon-wrapper action-item">
              <ProfileIcon />
            </div>

            {/* Add the navigation menu */}
            <div className="nav-menu-wrapper">
              <NavMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}