import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);

      if (user.role === "PARENT") {
        navigate("/parent/dashboard");
      } else {
        navigate("/caregiver/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to log in. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-layout">

        {/* LEFT SIDE */}
        <div className="auth-intro">
          <span className="auth-eyebrow">WELCOME TO CARECONNECT</span>

          <h1>
            Your childcare journey starts
            <span> here.</span>
          </h1>

          <p>
            Sign in to manage your childcare bookings, connect with caregivers,
            and keep everything organized in one place.
          </p>

          <div className="auth-benefits">
            <div>
              <strong>✓</strong>
              Find caregivers that fit your needs
            </div>

            <div>
              <strong>✓</strong>
              Manage your childcare bookings
            </div>

            <div>
              <strong>✓</strong>
              Stay connected with caregivers
            </div>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="auth-card">
          <div className="auth-card-header">
            <span>ACCOUNT LOGIN</span>

            <h2>Welcome back</h2>

            <p>
              Enter your details to access your CareConnect account.
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-divider">
            <span>New to CareConnect?</span>
          </div>

          <Link to="/register" className="auth-register-link">
            Create an account
          </Link>

          <Link to="/" className="auth-home-link">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Login;