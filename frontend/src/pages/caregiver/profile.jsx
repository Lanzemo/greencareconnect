import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/useAuth";

export default function Profile() {
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    experience: "",
    skills: "",
    hourlyRate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        const profile = response.data.data;

        setForm({
          name: profile.name || "",
          phone: profile.phone || "",
          location: profile.location || "",
          bio: profile.bio || "",
          experience: profile.experience || "",
          skills: profile.skills?.join(", ") || "",
          hourlyRate: profile.hourlyRate || "",
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load your profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const skillsArray = form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      await api.patch("/users/profile", {
        name: form.name,
        phone: form.phone,
        location: form.location,
        bio: form.bio,
        experience: form.experience,
        skills: skillsArray,
        hourlyRate: form.hourlyRate
          ? Number(form.hourlyRate)
          : undefined,
      });

      await refreshUser();

      setSuccess("Your profile has been updated successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="profile-container">
        <div className="profile-header">
          <div>
            <span className="profile-eyebrow">CARECONNECT PROFILE</span>
            <h1>Your Caregiver Profile</h1>
            <p>
              Tell parents about yourself, your experience, and the care you
              provide.
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {success && <div className="success-message">{success}</div>}

        <form className="profile-card" onSubmit={handleSubmit}>
          <div className="profile-section">
            <div className="profile-section-heading">
              <h2>Basic Information</h2>
              <p>Keep your contact and location details up to date.</p>
            </div>

            <div className="profile-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 08012345678"
                />
              </div>

              <div className="form-group full-width">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Rumuokoro, Port Harcourt"
                />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-heading">
              <h2>Professional Information</h2>
              <p>Help parents understand your experience and skills.</p>
            </div>

            <div className="form-group">
              <label>About You</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell parents a little about yourself and the kind of childcare you provide..."
                rows="5"
                maxLength="1000"
              />
            </div>

            <div className="profile-grid">
              <div className="form-group">
                <label>Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 4 years"
                />
              </div>

              <div className="form-group">
                <label>Default Hourly Rate</label>

                <div className="rate-input">
                  <span>₦</span>

                  <input
                    type="number"
                    name="hourlyRate"
                    value={form.hourlyRate}
                    onChange={handleChange}
                    placeholder="e.g. 3000"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Skills</label>

                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="e.g. Infant care, First aid, Homework support"
                />

                <small className="input-help">
                  Separate each skill with a comma.
                </small>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving Profile..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}