import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          CareConnect
        </Link>

        {/* Navigation */}
        <div className="navbar-links">

          <Link to="/" className="navbar-link">
            Home
          </Link>

          <Link to="/about" className="navbar-link">About</Link>

          {!isAuthenticated && (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>

              <Link to="/register" className="navbar-button">
                Get Started
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === "PARENT" && (
            <>
              <Link to="/parent/caregivers" className="navbar-link">
                Find Caregivers
              </Link>

              <Link to="/parent/bookings" className="navbar-link">
                My Bookings
              </Link>

              <Link to="/parent/dashboard" className="navbar-link">
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="navbar-logout"
              >
                Logout
              </button>
            </>
          )}

          {isAuthenticated && user?.role === "CAREGIVER" && (
            <>
              <Link to="/caregiver/bookings" className="navbar-link">
                My Bookings
              </Link>

              <Link to="/caregiver/profile" className="navbar-link">
                Profile
              </Link>

              <Link to="/caregiver/dashboard" className="navbar-link">
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="navbar-logout"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}