import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "PARENT",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again."
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
          <span className="auth-eyebrow">JOIN CARECONNECT</span>

          <h1>
            A simpler way to connect around
            <span> childcare.</span>
          </h1>

          <p>
            Create your CareConnect account and become part of a platform
            connecting families with caregivers.
          </p>

          <div className="auth-benefits">
            <div>
              <strong>✓</strong>
              Parents can discover caregivers
            </div>

            <div>
              <strong>✓</strong>
              Caregivers can showcase their skills
            </div>

            <div>
              <strong>✓</strong>
              Everyone can manage bookings in one place
            </div>
          </div>
        </div>

        {/* REGISTER CARD */}
        <div className="auth-card">
          <div className="auth-card-header">
            <span>CREATE ACCOUNT</span>

            <h2>Get started</h2>

            <p>
              Tell us a little about yourself to create your account.
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="register-email">Email address</label>

              <input
                id="register-email"
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
              <label htmlFor="register-password">Password</label>

              <input
                id="register-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                minLength={6}
                autoComplete="new-password"
                required
              />

              <small className="auth-input-help">
                Use at least 6 characters.
              </small>
            </div>

            <div className="auth-form-group">
              <label>I want to join as</label>

              <div className="role-selection">
                <button
                  type="button"
                  className={`role-option ${
                    formData.role === "PARENT" ? "selected" : ""
                  }`}
                  onClick={() => handleRoleChange("PARENT")}
                >
                  <span className="role-icon">👨‍👩‍👧</span>

                  <span>
                    <strong>Parent</strong>
                    <small>Find and book caregivers</small>
                  </span>
                </button>

                <button
                  type="button"
                  className={`role-option ${
                    formData.role === "CAREGIVER" ? "selected" : ""
                  }`}
                  onClick={() => handleRoleChange("CAREGIVER")}
                >
                  <span className="role-icon">🧑‍🍼</span>

                  <span>
                    <strong>Caregiver</strong>
                    <small>Offer childcare services</small>
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="auth-register-link">
            Sign in instead
          </Link>

          <Link to="/" className="auth-home-link">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Register;