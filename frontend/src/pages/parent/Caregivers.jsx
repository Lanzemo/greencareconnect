import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Caregivers() {
  const navigate = useNavigate();

  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        setError("");

        const response = await api.get("/users/caregivers");

        setCaregivers(response.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load caregivers. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCaregivers();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <p>Finding available caregivers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="caregivers-container">
        <div className="caregivers-header">
          <div>
            <span className="profile-eyebrow">CARECONNECT</span>

            <h1>Find a Caregiver</h1>

            <p>
              Browse caregiver profiles and find someone who fits your
              family's childcare needs.
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {caregivers.length === 0 ? (
          <div className="empty-state">
            <h3>No caregivers available</h3>

            <p>
              There are currently no registered caregivers available.
              Please check again later.
            </p>
          </div>
        ) : (
          <div className="caregiver-grid">
            {caregivers.map((caregiver) => (
              <div className="caregiver-card" key={caregiver._id}>
                <div className="caregiver-card-top">
                  <div className="caregiver-avatar">
                    {caregiver.name?.charAt(0).toUpperCase() || "C"}
                  </div>

                  <div className="caregiver-title">
                    <h2>{caregiver.name}</h2>

                    <span className="caregiver-role">
                      Childcare Provider
                    </span>
                  </div>
                </div>

                <div className="caregiver-info">
                  {caregiver.location && (
                    <div className="caregiver-info-item">
                      <span className="info-icon">📍</span>
                      <span>{caregiver.location}</span>
                    </div>
                  )}

                  {caregiver.experience && (
                    <div className="caregiver-info-item">
                      <span className="info-icon">💼</span>
                      <span>{caregiver.experience} experience</span>
                    </div>
                  )}

                  {caregiver.hourlyRate !== undefined &&
                    caregiver.hourlyRate !== null && (
                      <div className="caregiver-info-item">
                        <span className="info-icon">₦</span>
                        <span>
                          ₦
                          {Number(
                            caregiver.hourlyRate
                          ).toLocaleString()}{" "}
                          / hour
                        </span>
                      </div>
                    )}
                </div>

                <div className="caregiver-bio">
                  <span className="detail-label">ABOUT</span>

                  <p>
                    {caregiver.bio ||
                      "This caregiver has not added a profile description yet."}
                  </p>
                </div>

                {caregiver.skills?.length > 0 && (
                  <div className="caregiver-skills">
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

                <div className="caregiver-contact">
                  <span>{caregiver.email}</span>
                </div>

                <button
                  className="caregiver-book-button"
                  onClick={() =>
                    navigate(`/parent/book/${caregiver._id}`)
                  }
                >
                  Request Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}