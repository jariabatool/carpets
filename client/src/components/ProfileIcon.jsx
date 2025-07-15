import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ProfileIcon.css";

export default function ProfileIcon() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="profile-icon-wrapper">
      <span className="profile-icon" onClick={() => setShowDropdown(!showDropdown)}>
        👤
      </span>

      {showDropdown && (
        <div className="profile-dropdown">
          <p><strong>{user.name}</strong></p>
          <p>{user.email}</p>
          <p>Role: {user.role}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
