import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <div className="about-container">
          <span className="about-eyebrow">ABOUT CARECONNECT</span>

          <h1>
            Making childcare easier for
            <span> families and caregivers.</span>
          </h1>

          <p>
            CareConnect is a childcare booking platform designed to make it
            easier for parents to discover caregivers and manage childcare
            requests in one simple place.
          </p>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="about-section">
        <div className="about-container about-two-column">
          <div>
            <span className="about-label">THE PROBLEM</span>
            <h2>Finding suitable childcare shouldn't be complicated.</h2>
          </div>

          <div>
            <p>
              Parents often need reliable childcare that fits their schedule,
              location, and family's needs. At the same time, caregivers need
              a simple way to present their experience and connect with
              families looking for their services.
            </p>

            <p>
              CareConnect brings both sides together through a straightforward
              platform for discovering caregivers, requesting bookings, and
              managing childcare arrangements.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT HELPS */}
      <section className="about-section about-light">
        <div className="about-container">
          <div className="about-heading">
            <span className="about-label">WHAT WE DO</span>

            <h2>A simple platform for better childcare coordination.</h2>

            <p>
              CareConnect focuses on the essential things parents and
              caregivers need.
            </p>
          </div>

          <div className="about-feature-grid">
            <div className="about-feature-card">
              <div className="about-icon">👨‍👩‍👧</div>
              <h3>For Parents</h3>
              <p>
                Browse caregiver profiles, review their experience and skills,
                request bookings, and keep track of your childcare requests.
              </p>
            </div>

            <div className="about-feature-card">
              <div className="about-icon">🧑‍🍼</div>
              <h3>For Caregivers</h3>
              <p>
                Create a professional profile, showcase your experience,
                receive booking requests, and respond to parents.
              </p>
            </div>

            <div className="about-feature-card">
              <div className="about-icon">📅</div>
              <h3>Simple Booking</h3>
              <p>
                Keep booking information organized with dates, times,
                locations, rates, and booking status in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-heading">
            <span className="about-label">OUR APPROACH</span>
            <h2>Built around a simple childcare journey.</h2>
          </div>

          <div className="about-process">
            <div>
              <span>01</span>
              <h3>Discover</h3>
              <p>
                Parents explore caregiver profiles and find people whose
                services match their needs.
              </p>
            </div>

            <div>
              <span>02</span>
              <h3>Request</h3>
              <p>
                Parents provide the details of the care they need and submit a
                booking request.
              </p>
            </div>

            <div>
              <span>03</span>
              <h3>Connect</h3>
              <p>
                Caregivers review requests and respond with confirmation or
                cancellation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-container">
          <h2>Ready to get started?</h2>

          <p>
            Join CareConnect and make your childcare journey simpler.
          </p>

          <div className="about-cta-actions">
            <Link to="/register" className="about-primary-button">
              Create an Account
            </Link>

            <Link to="/login" className="about-secondary-button">
              Sign In
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}