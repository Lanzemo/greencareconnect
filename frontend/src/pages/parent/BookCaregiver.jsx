import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function BookCaregiver() {
  const { caregiverId } = useParams();
  const navigate = useNavigate();

  const [caregiver, setCaregiver] = useState(null);

  const [form, setForm] = useState({
    childName: "",
    date: "",
    startTime: "",
    endTime: "",
    serviceLocation: "",
    parentNote: "",
  });

  const [loadingCaregiver, setLoadingCaregiver] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [caregiverError, setCaregiverError] = useState("");

  useEffect(() => {
    const fetchCaregiver = async () => {
      try {
        const response = await api.get("/users/caregivers");

        const selectedCaregiver = response.data.data.find(
          (item) => item._id === caregiverId
        );

        if (!selectedCaregiver) {
          setCaregiverError("Caregiver not found.");
        } else {
          setCaregiver(selectedCaregiver);
        }
      } catch (error) {
        setCaregiverError(
          error.response?.data?.message ||
            "Unable to load caregiver information."
        );
      } finally {
        setLoadingCaregiver(false);
      }
    };

    fetchCaregiver();
  }, [caregiverId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const calculateDuration = () => {
    if (!form.startTime || !form.endTime) {
      return null;
    }

    const [startHour, startMinute] = form.startTime
      .split(":")
      .map(Number);

    const [endHour, endMinute] = form.endTime
      .split(":")
      .map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    const difference = endMinutes - startMinutes;

    if (difference <= 0) {
      return null;
    }

    return difference / 60;
  };

  const duration = calculateDuration();

  const estimatedCost =
    duration && caregiver?.hourlyRate
      ? duration * Number(caregiver.hourlyRate)
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.startTime >= form.endTime) {
      setError("End time must be later than start time.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/bookings", {
        caregiverId,
        childName: form.childName,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        serviceLocation: form.serviceLocation,
        parentNote: form.parentNote,
      });

      navigate("/parent/bookings");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create booking request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingCaregiver) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <p>Loading caregiver information...</p>
        </div>
      </div>
    );
  }

  if (caregiverError || !caregiver) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="dashboard-empty-icon">👩‍🍼</div>

          <h3>Caregiver unavailable</h3>

          <p>
            {caregiverError || "Unable to find this caregiver."}
          </p>

          <button
            className="back-button"
            onClick={() => navigate("/parent/caregivers")}
          >
            ← Back to Caregivers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="booking-page-container">
        {/* Header */}
        <div className="booking-page-header">
          <span className="profile-eyebrow">CARECONNECT</span>

          <h1>Request a Caregiver</h1>

          <p>
            Tell us when and where you need childcare. Your request
            will be sent to the caregiver for review.
          </p>
        </div>

        {/* Selected Caregiver */}
        <section className="selected-caregiver-card">
          <div className="selected-caregiver-top">
            <div className="selected-caregiver-avatar">
              {caregiver.name?.charAt(0).toUpperCase() || "C"}
            </div>

            <div className="selected-caregiver-heading">
              <span className="booking-selected-label">
                YOUR SELECTED CAREGIVER
              </span>

              <h2>{caregiver.name}</h2>

              <p>Childcare Provider</p>
            </div>
          </div>

          <div className="selected-caregiver-details">
            {caregiver.location && (
              <div>
                <span>📍</span>
                <strong>Location</strong>
                <p>{caregiver.location}</p>
              </div>
            )}

            {caregiver.experience && (
              <div>
                <span>💼</span>
                <strong>Experience</strong>
                <p>{caregiver.experience}</p>
              </div>
            )}

            {caregiver.hourlyRate !== undefined &&
              caregiver.hourlyRate !== null && (
                <div>
                  <span>₦</span>
                  <strong>Hourly Rate</strong>
                  <p>
                    ₦
                    {Number(
                      caregiver.hourlyRate
                    ).toLocaleString("en-NG")}{" "}
                    / hour
                  </p>
                </div>
              )}
          </div>

          {caregiver.bio && (
            <div className="selected-caregiver-bio">
              <span className="detail-label">ABOUT</span>

              <p>{caregiver.bio}</p>
            </div>
          )}

          {caregiver.skills?.length > 0 && (
            <div className="selected-caregiver-skills">
              <span className="detail-label">SKILLS</span>

              <div className="skill-list">
                {caregiver.skills.map((skill, index) => (
                  <span className="skill-tag" key={index}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {error && <div className="error-message">{error}</div>}

        <div className="booking-layout">
          {/* Booking Form */}
          <form
            className="form-card booking-form-card"
            onSubmit={handleSubmit}
          >
            <div className="booking-section-heading">
              <span className="dashboard-section-label">
                BOOKING INFORMATION
              </span>

              <h2>Tell us what you need</h2>

              <p>
                Provide the details below so the caregiver can
                review your request.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="childName">Child's Name</label>

              <input
                id="childName"
                type="text"
                name="childName"
                value={form.childName}
                onChange={handleChange}
                placeholder="Enter child's name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Care Date</label>

              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>

                <input
                  id="startTime"
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>

                <input
                  id="endTime"
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="serviceLocation">
                Care Location
              </label>

              <input
                id="serviceLocation"
                type="text"
                name="serviceLocation"
                value={form.serviceLocation}
                onChange={handleChange}
                placeholder="e.g. Rumuokoro, Port Harcourt"
                required
              />

              <small className="form-help-text">
                Where should the caregiver provide the childcare?
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="parentNote">
                Message to Caregiver
                <span className="optional-label">Optional</span>
              </label>

              <textarea
                id="parentNote"
                name="parentNote"
                value={form.parentNote}
                onChange={handleChange}
                placeholder="Share anything important about the child or care required..."
                rows="5"
              />
            </div>

            <div className="booking-note">
              <strong>Before you submit</strong>

              <p>
                Your request will be sent to the caregiver. They can
                review the details and respond with confirmation and
                the final agreed amount.
              </p>
            </div>

            <button
              type="submit"
              className="booking-submit-button"
              disabled={loading}
            >
              {loading
                ? "Sending Request..."
                : "Send Booking Request →"}
            </button>
          </form>

          {/* Booking Summary */}
          <aside className="booking-summary">
            <div className="booking-summary-card">
              <span className="dashboard-section-label">
                BOOKING SUMMARY
              </span>

              <h2>Your Estimate</h2>

              <div className="estimate-rate">
                <span>Caregiver rate</span>

                <strong>
                  ₦
                  {Number(
                    caregiver.hourlyRate || 0
                  ).toLocaleString("en-NG")}
                  <small>/hr</small>
                </strong>
              </div>

              <div className="estimate-divider" />

              <div className="estimate-row">
                <span>Duration</span>

                <strong>
                  {duration
                    ? `${duration} ${
                        duration === 1 ? "hour" : "hours"
                      }`
                    : "—"}
                </strong>
              </div>

              <div className="estimate-row estimate-total">
                <span>Estimated total</span>

                <strong>
                  {estimatedCost
                    ? `₦${estimatedCost.toLocaleString(
                        "en-NG"
                      )}`
                    : "—"}
                </strong>
              </div>

              <p className="estimate-disclaimer">
                This is an estimate based on the caregiver's
                current hourly rate. The final amount is agreed
                after the caregiver reviews your request.
              </p>
            </div>

            <div className="booking-next-card">
              <h3>What happens next?</h3>

              <div className="booking-step">
                <span>1</span>

                <div>
                  <strong>Send your request</strong>
                  <p>
                    Your booking details are sent to the caregiver.
                  </p>
                </div>
              </div>

              <div className="booking-step">
                <span>2</span>

                <div>
                  <strong>Caregiver reviews</strong>
                  <p>
                    The caregiver checks your requested date and
                    time.
                  </p>
                </div>
              </div>

              <div className="booking-step">
                <span>3</span>

                <div>
                  <strong>Booking is confirmed</strong>
                  <p>
                    You receive the caregiver's response and agreed
                    amount.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}