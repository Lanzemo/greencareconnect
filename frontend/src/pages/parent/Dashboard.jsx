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

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome */}
        <section className="dashboard-welcome">
          <div className="dashboard-welcome-content">
            <span className="dashboard-eyebrow">
              PARENT DASHBOARD
            </span>

            <h1>
              Welcome back,{" "}
              {user?.name?.split(" ")[0] || "Parent"} 👋
            </h1>

            <p>
              Manage your childcare requests, track bookings, and
              find the right caregiver for your family.
            </p>
          </div>

          <Link
            to="/parent/caregivers"
            className="dashboard-primary-button"
          >
            Find a Caregiver
          </Link>
        </section>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

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
                  <span>Total Bookings</span>
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

            {/* Quick Actions */}
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <div>
                  <span className="dashboard-section-label">
                    GET STARTED
                  </span>

                  <h2>What would you like to do?</h2>

                  <p>
                    Quickly access the most important parts of
                    your CareConnect account.
                  </p>
                </div>
              </div>

              <div className="quick-action-grid">
                <Link
                  to="/parent/caregivers"
                  className="quick-action-card"
                >
                  <span className="quick-action-icon">🔎</span>

                  <div>
                    <h3>Find a Caregiver</h3>

                    <p>
                      Browse caregiver profiles, compare their
                      experience, and request a booking.
                    </p>
                  </div>

                  <span className="quick-action-arrow">
                    →
                  </span>
                </Link>

                <Link
                  to="/parent/bookings"
                  className="quick-action-card"
                >
                  <span className="quick-action-icon">📋</span>

                  <div>
                    <h3>View My Bookings</h3>

                    <p>
                      Track your requests, booking status, and
                      caregiver responses.
                    </p>
                  </div>

                  <span className="quick-action-arrow">
                    →
                  </span>
                </Link>
              </div>
            </section>

            {/* Recent Bookings */}
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <div>
                  <span className="dashboard-section-label">
                    ACTIVITY
                  </span>

                  <h2>Recent Bookings</h2>

                  <p>
                    Keep track of your latest caregiver requests.
                  </p>
                </div>

                {bookings.length > 0 && (
                  <Link
                    to="/parent/bookings"
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

                  <h3>Your bookings will appear here</h3>

                  <p>
                    You haven't requested a caregiver yet. Start
                    by browsing available caregivers.
                  </p>

                  <Link
                    to="/parent/caregivers"
                    className="dashboard-primary-button"
                  >
                    Find a Caregiver
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
                            Caregiver:{" "}
                            <strong>
                              {booking.caregiver?.name ||
                                "Not assigned"}
                            </strong>
                          </p>
                        </div>

                        <span
                          className={`status-badge ${booking.status.toLowerCase()}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="recent-booking-details">
                        <span>
                          📅{" "}
                          {new Date(
                            booking.date
                          ).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>

                        <span>
                          🕐 {booking.startTime} –{" "}
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