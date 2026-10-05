import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setError("");

        const response = await api.get("/bookings");

        setBookings(response.data.data || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load your dashboard information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "CONFIRMED"
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "CANCELLED"
  ).length;

  const recentBookings = bookings.slice(0, 3);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatRate = (rate) => {
    if (rate === undefined || rate === null) {
      return "Not set";
    }

    return "₦" + Number(rate).toLocaleString("en-NG") + " / hour";
  };

  const getStatusClass = (status) => {
    return "status-badge " + status.toLowerCase();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* Welcome */}
        <section className="dashboard-welcome">
          <div className="dashboard-welcome-content">
            <span className="dashboard-eyebrow">
              CAREGIVER DASHBOARD
            </span>

            <h1>
              Welcome back,{" "}
              {user?.name?.split(" ")[0] || "Caregiver"} 👋
            </h1>

            <p>
              Manage your childcare requests, bookings, and
              caregiver profile all in one place.
            </p>
          </div>

          <Link
            to="/caregiver/bookings"
            className="dashboard-primary-button"
          >
            View Booking Requests
          </Link>
        </section>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="loading-state">
            <p>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <section className="dashboard-stats">
              <div className="dashboard-stat-card">
                <div className="stat-icon">📋</div>

                <div>
                  <span>Total Requests</span>
                  <strong>{bookings.length}</strong>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-icon">⏳</div>

                <div>
                  <span>Pending</span>
                  <strong>{pendingCount}</strong>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-icon">✓</div>

                <div>
                  <span>Confirmed</span>
                  <strong>{confirmedCount}</strong>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="stat-icon">×</div>

                <div>
                  <span>Cancelled</span>
                  <strong>{cancelledCount}</strong>
                </div>
              </div>
            </section>

            {/* Profile Summary */}
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <div>
                  <span className="dashboard-section-label">
                    YOUR PROFILE
                  </span>

                  <h2>Caregiver Profile</h2>

                  <p>
                    Keep your information up to date so parents
                    can learn more about you.
                  </p>
                </div>

                <Link
                  to="/caregiver/profile"
                  className="dashboard-view-all"
                >
                  Edit Profile →
                </Link>
              </div>

              <div className="caregiver-profile-summary">
                <div className="profile-summary-item">
                  <span>Name</span>

                  <strong>
                    {user?.name || "Not available"}
                  </strong>
                </div>

                <div className="profile-summary-item">
                  <span>Email</span>

                  <strong>
                    {user?.email || "Not available"}
                  </strong>
                </div>

                <div className="profile-summary-item">
                  <span>Hourly Rate</span>

                  <strong>
                    {formatRate(user?.hourlyRate)}
                  </strong>
                </div>

                <div className="profile-summary-item">
                  <span>Location</span>

                  <strong>
                    {user?.location || "Not set"}
                  </strong>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <div>
                  <span className="dashboard-section-label">
                    GET STARTED
                  </span>

                  <h2>Quick Actions</h2>

                  <p>
                    Manage your bookings and caregiver profile.
                  </p>
                </div>
              </div>

              <div className="quick-action-grid">
                <Link
                  to="/caregiver/bookings"
                  className="quick-action-card"
                >
                  <span className="quick-action-icon">
                    📋
                  </span>

                  <div>
                    <h3>Booking Requests</h3>

                    <p>
                      Review parent requests and respond to
                      pending bookings.
                    </p>
                  </div>

                  <span className="quick-action-arrow">
                    →
                  </span>
                </Link>

                <Link
                  to="/caregiver/profile"
                  className="quick-action-card"
                >
                  <span className="quick-action-icon">
                    👤
                  </span>

                  <div>
                    <h3>Update Profile</h3>

                    <p>
                      Update your experience, skills, location,
                      bio, and hourly rate.
                    </p>
                  </div>

                  <span className="quick-action-arrow">
                    →
                  </span>
                </Link>
              </div>
            </section>

            {/* Recent Requests */}
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <div>
                  <span className="dashboard-section-label">
                    ACTIVITY
                  </span>

                  <h2>Recent Requests</h2>

                  <p>
                    Keep track of your latest caregiver booking
                    requests.
                  </p>
                </div>

                {bookings.length > 0 && (
                  <Link
                    to="/caregiver/bookings"
                    className="dashboard-view-all"
                  >
                    View all →
                  </Link>
                )}
              </div>

              {recentBookings.length === 0 ? (
                <div className="dashboard-empty">
                  <div className="dashboard-empty-icon">
                    📅
                  </div>

                  <h3>No booking requests yet</h3>

                  <p>
                    When parents request your services, their
                    bookings will appear here.
                  </p>

                  <Link
                    to="/caregiver/profile"
                    className="dashboard-primary-button"
                  >
                    Complete Your Profile
                  </Link>
                </div>
              ) : (
                <div className="recent-bookings-list">
                  {recentBookings.map((booking) => (
                    <div
                      className="recent-booking-card"
                      key={booking._id}
                    >
                      <div className="recent-booking-main">
                        <div className="recent-booking-title">
                          <h3>{booking.childName}</h3>

                          <p>
                            Parent:{" "}
                            <strong>
                              {booking.parent?.name ||
                                "Not available"}
                            </strong>
                          </p>
                        </div>

                        <span
                          className={getStatusClass(
                            booking.status
                          )}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="recent-booking-details">
                        <span>
                          📅 {formatDate(booking.date)}
                        </span>

                        <span>
                          🕐 {booking.startTime} -{" "}
                          {booking.endTime}
                        </span>

                        <span>
                          📍{" "}
                          {booking.serviceLocation ||
                            "Location not provided"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}