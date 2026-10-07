import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [responseText, setResponseText] = useState({});
  const [hourlyRates, setHourlyRates] = useState({});
  const [agreedAmounts, setAgreedAmounts] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  const fetchBookings = async () => {
    try {
      setError("");

      const response = await api.get("/bookings");

      setBookings(response.data.data || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load booking requests."
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

  const handleResponseChange = (bookingId, value) => {
    setResponseText((prev) => ({
      ...prev,
      [bookingId]: value,
    }));
  };

  const handleHourlyRateChange = (bookingId, value) => {
    setHourlyRates((prev) => ({
      ...prev,
      [bookingId]: value,
    }));
  };

  const handleAgreedAmountChange = (bookingId, value) => {
    setAgreedAmounts((prev) => ({
      ...prev,
      [bookingId]: value,
    }));
  };

  const updateBooking = async (bookingId, status) => {
    try {
      setActionLoading(bookingId);
      setError("");

      const hourlyRate = hourlyRates[bookingId];
      const agreedAmount = agreedAmounts[bookingId];

      if (status === "CONFIRMED") {
        if (!hourlyRate || Number(hourlyRate) <= 0) {
          setError(
            "Please enter a valid hourly rate before confirming."
          );
          return;
        }

        if (!agreedAmount || Number(agreedAmount) <= 0) {
          setError(
            "Please enter the agreed amount before confirming."
          );
          return;
        }
      }

      await api.patch(
        "/bookings/" + bookingId + "/status",
        {
          status,
          caregiverResponse:
            responseText[bookingId] || "",
          hourlyRate: hourlyRate
            ? Number(hourlyRate)
            : undefined,
          agreedAmount: agreedAmount
            ? Number(agreedAmount)
            : undefined,
        }
      );

      await fetchBookings();

      setResponseText((prev) => ({
        ...prev,
        [bookingId]: "",
      }));

      setHourlyRates((prev) => ({
        ...prev,
        [bookingId]: "",
      }));

      setAgreedAmounts((prev) => ({
        ...prev,
        [bookingId]: "",
      }));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update booking."
      );
    } finally {
      setActionLoading(null);
    }
  };

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
      return "Not set";
    }

    return (
      "₦" + Number(amount).toLocaleString("en-NG")
    );
  };

  const getStatusClass = (status) => {
    return "status-badge " + status.toLowerCase();
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <p>Loading booking requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="bookings-container">

        {/* Page Header */}
        <div className="bookings-header">
          <div>
            <span className="dashboard-section-label">
              CAREGIVER BOOKINGS
            </span>

            <h1>Booking Requests</h1>

            <p>
              Review requests from parents, respond to them,
              and manage your bookings.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="dashboard-stats">
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
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="empty-state caregiver-bookings-empty">
            <div className="dashboard-empty-icon">
              📅
            </div>

            <h3>No booking requests yet</h3>

            <p>
              New requests from parents will appear here when
              they book your childcare services.
            </p>
          </div>
        ) : (
          <div className="booking-list">

            {bookings.map((booking) => (
              <div
                className="booking-card caregiver-booking-card"
                key={booking._id}
              >

                {/* Booking Header */}
                <div className="booking-card-header">
                  <div className="booking-card-title">
                    <span className="booking-card-label">
                      CHILDCARE REQUEST
                    </span>

                    <h2>{booking.childName}</h2>

                    <p className="booking-parent">
                      Requested by{" "}
                      <strong>
                        {booking.parent?.name || "Parent"}
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

                {/* Booking Details */}
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
                      {booking.startTime} -{" "}
                      {booking.endTime}
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
                      Parent Email
                    </span>

                    <span>
                      {booking.parent?.email ||
                        "Not available"}
                    </span>
                  </div>

                  <div>
                    <span className="detail-label">
                      Hourly Rate
                    </span>

                    <span className="booking-rate">
                      {booking.hourlyRate
                        ? formatAmount(
                            booking.hourlyRate
                          ) + " / hour"
                        : "Not set"}
                    </span>
                  </div>

                  <div>
                    <span className="detail-label">
                      Agreed Amount
                    </span>

                    <span className="booking-rate">
                      {booking.agreedAmount
                        ? formatAmount(
                            booking.agreedAmount
                          )
                        : "Not agreed yet"}
                    </span>
                  </div>

                </div>

                {/* Parent Message */}
                {booking.parentNote && (
                  <div className="booking-message">
                    <span className="detail-label">
                      Message from Parent
                    </span>

                    <p>{booking.parentNote}</p>
                  </div>
                )}

                {/* Previous Response */}
                {booking.caregiverResponse && (
                  <div className="booking-message caregiver-response-display">
                    <span className="detail-label">
                      Your Previous Response
                    </span>

                    <p>
                      {booking.caregiverResponse}
                    </p>
                  </div>
                )}

                {/* Pending Actions */}
                {booking.status === "PENDING" && (
                  <div className="caregiver-action-area">

                    <div className="action-area-heading">
                      <h3>Respond to Request</h3>

                      <p>
                        Review the request and provide your
                        rate and agreed amount before confirming.
                      </p>
                    </div>

                    <div className="form-group">
                      <label>Your Response</label>

                      <textarea
                        value={
                          responseText[booking._id] || ""
                        }
                        onChange={(e) =>
                          handleResponseChange(
                            booking._id,
                            e.target.value
                          )
                        }
                        placeholder="Write a message to the parent..."
                        rows="4"
                      />
                    </div>

                    <div className="booking-price-grid">

                      <div className="form-group">
                        <label>Hourly Rate</label>

                        <div className="rate-input">
                          <span>₦</span>

                          <input
                            type="number"
                            min="1"
                            value={
                              hourlyRates[
                                booking._id
                              ] || ""
                            }
                            onChange={(e) =>
                              handleHourlyRateChange(
                                booking._id,
                                e.target.value
                              )
                            }
                            placeholder="e.g. 3000"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Agreed Amount</label>

                        <div className="rate-input">
                          <span>₦</span>

                          <input
                            type="number"
                            min="1"
                            value={
                              agreedAmounts[
                                booking._id
                              ] || ""
                            }
                            onChange={(e) =>
                              handleAgreedAmountChange(
                                booking._id,
                                e.target.value
                              )
                            }
                            placeholder="e.g. 25000"
                          />
                        </div>
                      </div>

                    </div>

                    <div className="booking-actions">

                      <button
                        className="confirm-button"
                        onClick={() =>
                          updateBooking(
                            booking._id,
                            "CONFIRMED"
                          )
                        }
                        disabled={
                          actionLoading ===
                          booking._id
                        }
                      >
                        {actionLoading === booking._id
                          ? "Processing..."
                          : "Confirm Booking"}
                      </button>

                      <button
                        className="cancel-button"
                        onClick={() =>
                          updateBooking(
                            booking._id,
                            "CANCELLED"
                          )
                        }
                        disabled={
                          actionLoading ===
                          booking._id
                        }
                      >
                        Cancel Request
                      </button>

                    </div>
                  </div>
                )}

                {/* Status Information */}
                {booking.status === "CONFIRMED" && (
                  <div className="booking-status-note confirmed">
                    <strong>Booking confirmed</strong>

                    <span>
                      This booking has been accepted and the
                      agreed amount is recorded.
                    </span>
                  </div>
                )}

                {booking.status === "CANCELLED" && (
                  <div className="booking-status-note cancelled">
                    <strong>Request cancelled</strong>

                    <span>
                      This booking request is no longer active.
                    </span>
                  </div>
                )}

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}