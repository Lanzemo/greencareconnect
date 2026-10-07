import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-eyebrow">TRUSTED CHILDCARE, MADE SIMPLE</span>

            <h1>
              Find the right care
              <span> for your child.</span>
            </h1>

            <p>
              CareConnect helps parents find caregivers they can connect with
              and makes childcare booking simple, transparent, and convenient.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="hero-primary-button">
                Get Started
              </Link>

              <Link to="/login" className="hero-secondary-button">
                Sign In
              </Link>
            </div>

            <div className="hero-trust">
              <div>
                <strong>✓</strong>
                Verified profiles
              </div>

              <div>
                <strong>✓</strong>
                Simple booking
              </div>

              <div>
                <strong>✓</strong>
                Flexible care
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <span>CareConnect</span>
              <span className="online-dot">● Available</span>
            </div>

            <div className="hero-profile">
              <div className="hero-avatar">👩🏽‍🍼</div>

              <div>
                <h3>Find a caregiver</h3>
                <p>Care that fits your family's needs.</p>
              </div>
            </div>

            <div className="hero-card-details">
              <div>
                <span>Experience</span>
                <strong>Experienced caregivers</strong>
              </div>

              <div>
                <span>Booking</span>
                <strong>Simple & flexible</strong>
              </div>

              <div>
                <span>Communication</span>
                <strong>Direct responses</strong>
              </div>
            </div>

            <Link to="/register" className="hero-card-button">
              Find Care
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-container">
          <div className="section-heading">
            <span>HOW IT WORKS</span>
            <h2>Childcare made easier in three steps.</h2>
            <p>
              From finding a caregiver to confirming a booking, CareConnect
              keeps the process straightforward.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Find a caregiver</h3>
              <p>
                Browse caregiver profiles, experience, skills, location, and
                hourly rates.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Request a booking</h3>
              <p>
                Choose the date, time, location, and provide the details your
                caregiver needs.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Get confirmation</h3>
              <p>
                Caregivers can review your request, respond, and confirm the
                agreed care arrangement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOR PARENTS */}
      <section className="audience-section">
        <div className="audience-container">
          <div className="audience-content">
            <span className="section-label">FOR PARENTS</span>

            <h2>Care that works around your family.</h2>

            <p>
              Whether you need occasional childcare or regular support,
              CareConnect gives you a simple way to discover caregivers and
              manage your bookings.
            </p>

            <ul className="benefit-list">
              <li>Browse caregiver profiles</li>
              <li>Compare experience and hourly rates</li>
              <li>Request care based on your schedule</li>
              <li>Track your bookings in one place</li>
            </ul>

            <Link to="/register" className="section-button">
              Find a Caregiver
            </Link>
          </div>

          <div className="audience-visual parent-visual">
            <div className="visual-card">
              <span>Parent dashboard</span>
              <strong>Your childcare, organized.</strong>

              <div className="mini-stat">
                <span>Upcoming bookings</span>
                <strong>3</strong>
              </div>

              <div className="mini-stat">
                <span>Confirmed care</span>
                <strong>2</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR CAREGIVERS */}
      <section className="audience-section caregiver-section">
        <div className="audience-container reverse">
          <div className="audience-content">
            <span className="section-label">FOR CAREGIVERS</span>

            <h2>Show your skills. Manage your care.</h2>

            <p>
              Create a professional profile that helps parents understand your
              experience, skills, availability, and rates.
            </p>

            <ul className="benefit-list">
              <li>Create and update your caregiver profile</li>
              <li>Showcase your experience and skills</li>
              <li>Receive booking requests from parents</li>
              <li>Confirm or decline requests with a response</li>
            </ul>

            <Link to="/register" className="section-button">
              Join as a Caregiver
            </Link>
          </div>

          <div className="audience-visual caregiver-visual">
            <div className="visual-card">
              <span>Caregiver profile</span>
              <strong>Let parents know what you offer.</strong>

              <div className="profile-preview">
                <div className="preview-avatar">👩🏽</div>

                <div>
                  <strong>Professional Caregiver</strong>
                  <span>Experienced • Reliable • Caring</span>
                </div>
              </div>

              <div className="profile-rate">
                <span>Hourly rate</span>
                <strong>Set your rate</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-container">
          <span>CARECONNECT</span>

          <h2>Ready to make childcare simpler?</h2>

          <p>
            Create your account and start connecting with caregivers today.
          </p>

          <Link to="/register" className="cta-button">
            Get Started
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-container">
          <div>
            <h3>CareConnect</h3>
            <p>
              Making childcare discovery and booking simpler for families and
              caregivers.
            </p>
          </div>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Get Started</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CareConnect. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}