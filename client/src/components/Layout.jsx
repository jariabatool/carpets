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

  return (
    <>
      <header className="layout-header">
        <div className="layout-header-left">
          <h2> Carpet & Rugs Store</h2>
        </div>
        <div className="layout-header-right">
          {user?.role === 'buyer' && <Cart />}
          <ThemeToggle />
          <ProfileIcon />
        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>
    </>
  );
}
