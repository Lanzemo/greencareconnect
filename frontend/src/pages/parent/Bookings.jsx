import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setError("");

      const response = await api.get("/bookings");

      setBookings(response.data.data || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load your bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadBookings = async () => {
      await fetchBookings();
    };

    loadBookings();
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) {
      return null;
    }

    return `₦${Number(amount).toLocaleString("en-NG")}`;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="bookings-container">
        {/* Header */}
        <div className="bookings-header">
          <div>
            <span className="profile-eyebrow">CARECONNECT</span>

            <h1>My Bookings</h1>

            <p>
              Keep track of your caregiver requests, responses,
              and confirmed care.
            </p>
          </div>

          {bookings.length > 0 && (
            <div className="bookings-summary">
              <div>
                <strong>{bookings.length}</strong>
                <span>Total</span>
              </div>

              <div>
                <strong>{pendingCount}</strong>
                <span>Pending</span>
              </div>

              <div>
                <strong>{confirmedCount}</strong>
                <span>Confirmed</span>
              </div>

              <div>
                <strong>{cancelledCount}</strong>
                <span>Cancelled</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="empty-state bookings-empty">
            <div className="dashboard-empty-icon">
              📅
            </div>

            <h3>No bookings yet</h3>

            <p>
              You haven't made any caregiver requests yet. Once
              you submit a request, you'll be able to track it here.
            </p>
          </div>
        ) : (
          <div className="booking-list">
            {bookings.map((booking) => {
              const agreedAmount = formatAmount(
                booking.agreedAmount
              );

              const estimatedAmount = formatAmount(
                booking.estimatedAmount
              );

              return (
                <article
                  className="booking-card caregiver-booking-card"
                  key={booking._id}
                >
                  {/* Card Header */}
                  <div className="booking-card-header">
                    <div className="booking-card-title">
                      <span className="booking-card-label">
                        CHILDCARE REQUEST
                      </span>

                      <h2>{booking.childName}</h2>

                      <p className="booking-parent">
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

                  {/* Main Details */}
                  <div className="booking-details">
                    <div>
                      <span className="detail-label">
                        Date
                      </span>

                      <span>
                        {formatDate(booking.date)}
                      </span>
                    </div>

                    <div>
                      <span className="detail-label">
                        Time
                      </span>

                      <span>
                        {booking.startTime} –{" "}
                        {booking.endTime}
                      </span>
                    </div>

                    <div>
                      <span className="detail-label">
                        Duration
                      </span>

                      <span>
                        {booking.durationHours
                          ? `${booking.durationHours} ${
                              booking.durationHours === 1
                                ? "hour"
                                : "hours"
                            }`
                          : "Not available"}
                      </span>
                    </div>

                    <div>
                      <span className="detail-label">
                        Location
                      </span>

                      <span>
                        {booking.serviceLocation ||
                          "Not provided"}
                      </span>
                    </div>

                    <div>
                      <span className="detail-label">
                        Caregiver Email
                      </span>

                      <span>
                        {booking.caregiver?.email ||
                          "Not available"}
                      </span>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="booking-financials">
                    <div>
                      <span className="detail-label">
                        Hourly Rate
                      </span>

                      <strong>
                        {formatAmount(
                          booking.hourlyRate
                        ) || "Not set"}

                        {booking.hourlyRate !== undefined &&
                          booking.hourlyRate !== null && (
                            <small> / hour</small>
                          )}
                      </strong>
                    </div>

                    <div>
                      <span className="detail-label">
                        Estimated Amount
                      </span>

                      <strong>
                        {estimatedAmount ||
                          "Not available"}
                      </strong>
                    </div>

                    <div
                      className={
                        booking.agreedAmount !== undefined &&
                        booking.agreedAmount !== null
                          ? "agreed-amount"
                          : ""
                      }
                    >
                      <span className="detail-label">
                        Final Agreed Amount
                      </span>

                      <strong>
                        {agreedAmount ||
                          "Awaiting caregiver response"}
                      </strong>
                    </div>
                  </div>

                  {/* Parent Message */}
                  {booking.parentNote && (
                    <div className="booking-message">
                      <span className="detail-label">
                        Your Message
                      </span>

                      <p>{booking.parentNote}</p>
                    </div>
                  )}

                  {/* Caregiver Response */}
                  {booking.caregiverResponse && (
                    <div className="booking-message caregiver-response-display">
                      <span className="detail-label">
                        Caregiver Response
                      </span>

                      <p>
                        {booking.caregiverResponse}
                      </p>
                    </div>
                  )}

                  {/* Status Explanation */}
                  {booking.status === "PENDING" && (
                    <div className="booking-status-note pending-note">
                      <strong>
                        Waiting for caregiver
                      </strong>

                      <span>
                        Your request has been sent and is
                        waiting for the caregiver to respond.
                      </span>
                    </div>
                  )}

                  {booking.status === "CONFIRMED" && (
                    <div className="booking-status-note confirmed-note">
                      <strong>
                        Booking confirmed
                      </strong>

                      <span>
                        The caregiver has accepted your request.
                        Your agreed amount is shown above.
                      </span>
                    </div>
                  )}

                  {booking.status === "CANCELLED" && (
                    <div className="booking-status-note cancelled-note">
                      <strong>
                        Booking cancelled
                      </strong>

                      <span>
                        This booking request is no longer active.
                      </span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}