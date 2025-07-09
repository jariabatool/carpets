import Cart from "./Cart";
import ThemeToggle from "./ThemeToggle";
import { Outlet } from "react-router-dom";
import "./Layout.css"; // optional: for layout-specific styles

export default function Layout() {
  return (
    <>
      <header className="layout-header">
        <div className="layout-header-right">
          <Cart />
          <ThemeToggle />
        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>
    </>
  );
}
