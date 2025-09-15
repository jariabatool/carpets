import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './NavMenu.css';

const NavMenu = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!user) return null;

  // Admin Menu Items
  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/sellers', label: 'Sellers', icon: '👥' },
    { path: '/manage-products', label: 'All Products', icon: '📦' },
    { path: '/orders', label: 'All Orders', icon: '📋' },
    { path: '/admin/seller', label: 'Seller Details', icon: '👤' },
    { path: '/admin/buyer', label: 'Buyer Details', icon: '👤' }
  ];

  // Seller Menu Items
  const sellerMenuItems = [
    { path: '/manage-products', label: 'My Products', icon: '📦' },
    { path: '/add-product', label: 'Add Product', icon: '➕' },
    { path: '/seller-orders', label: 'My Orders', icon: '📋' },
    { path: '/seller/:sellerId/products', label: 'Store', icon: '🏪' }
  ];

  // Buyer Menu Items
  const buyerMenuItems = [
    { path: '/orders', label: 'My Orders', icon: '📋' },
    { path: '/checkout', label: 'Checkout', icon: '🛒' },
    { path: '/sellers', label: 'Sellers', icon: '👥' }
  ];

  // Common Menu Items for all roles
  const commonMenuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/category', label: 'Categories', icon: '📂' }
  ];

  // Get menu items based on user role
  const getMenuItems = () => {
    let roleItems = [];
    
    if (user.role === 'admin') {
      roleItems = adminMenuItems;
    } else if (user.role === 'seller') {
      roleItems = sellerMenuItems;
    } else if (user.role === 'buyer') {
      roleItems = buyerMenuItems;
    }

    return [...commonMenuItems, ...roleItems];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Overlay */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}

      {/* Navigation Menu */}
      <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <div className="user-info">
            <div className="user-avatar">
              {user.name?.charAt(0).toUpperCase() || user.role.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user.name || 'User'}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
          <button className="close-menu" onClick={closeMenu} aria-label="Close menu">
            ×
          </button>
        </div>

        <div className="menu-items">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="menu-item"
              onClick={closeMenu}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </a>
          ))}
        </div>

        <div className="menu-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default NavMenu;