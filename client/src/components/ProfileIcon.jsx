// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import "./ProfileIcon.css";

// export default function ProfileIcon() {
//   const { user, logout } = useAuth();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   if (!user) return null;

//   return (
//     <div className="profile-icon-wrapper">
//       <span className="profile-icon" onClick={() => setShowDropdown(!showDropdown)}>
//         👤
//       </span>

//       {showDropdown && (
//         <div className="profile-dropdown">
//           <p><strong>{user.name}</strong></p>
//           <p>{user.email}</p>
//           <p>Role: {user.role}</p>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ProfileIcon.css";

export default function ProfileIcon() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  const handleResetPassword = () => {
    navigate("/forgot-password");
    setShowDropdown(false);
  };

  if (!user) return null;

  // Get user avatar based on role
  const getUserAvatar = () => {
    switch (user.role) {
      case 'admin':
        return '👑';
      case 'seller':
        return '🏪';
      case 'buyer':
        return '👤';
      default:
        return '👤';
    }
  };

  // Get role badge color
  const getRoleBadgeClass = () => {
    switch (user.role) {
      case 'admin':
        return 'role-badge admin';
      case 'seller':
        return 'role-badge seller';
      case 'buyer':
        return 'role-badge buyer';
      default:
        return 'role-badge';
    }
  };

  return (
    <div className="profile-icon-wrapper" ref={dropdownRef}>
      <div 
        className="profile-trigger"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="profile-avatar">
          {getUserAvatar()}
        </span>
        <div className="profile-info">
          <span className="profile-name">{user.name}</span>
          <span className={getRoleBadgeClass()}>
            {user.role}
          </span>
        </div>
        <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>
          ▼
        </span>
      </div>

      {showDropdown && (
        <div className="profile-dropdown">
          {/* User Info Section */}
          <div className="dropdown-header">
            <div className="user-avatar-large">
              {getUserAvatar()}
            </div>
            <div className="user-info">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <span className={getRoleBadgeClass()}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          {/* Navigation Links - Only Profile and Reset Password */}
          <div className="dropdown-links">
            <button 
              className="dropdown-link"
              onClick={handleProfileClick}
            >
              <span className="link-icon">👤</span>
              <span className="link-text">My Profile</span>
            </button>

            <button 
              className="dropdown-link"
              onClick={handleResetPassword}
            >
              <span className="link-icon">🔒</span>
              <span className="link-text">Reset Password</span>
            </button>
          </div>

          <div className="dropdown-divider"></div>

          {/* Logout Button */}
          <div className="dropdown-actions">
            <button 
              className="dropdown-link logout"
              onClick={handleLogout}
            >
              <span className="link-icon">🚪</span>
              <span className="link-text">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}