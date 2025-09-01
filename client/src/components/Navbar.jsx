// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // ✅ always fresh

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-gray-200 dark:bg-gray-900 shadow">
      <Link to="/" className="font-bold">📄 Assignment Portal</Link>
      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        )}
        <Link to="/documents">Documents</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/documents/create">Create Doc</Link>
        <Link to="/search">Search</Link>
        <Link to="/activity">Activity</Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
