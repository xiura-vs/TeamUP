import "./LegalPage.css";

export default function TermsAndConditions() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <span className="legal-badge">Legal</span>
          <h1>Terms and Conditions</h1>
          <p>Last updated: March 2, 2026</p>
        </header>

        <section className="legal-card">
          <article className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By using TeamUP, you agree to follow these terms and all
              applicable laws. If you do not agree, please stop using the
              platform.
            </p>
          </article>

          <article className="legal-section">
            <h2>2. Account Responsibility</h2>
            <p>
              You are responsible for your account, profile details, and any
              activity under your login. Keep your credentials secure and
              accurate.
            </p>
          </article>

          <article className="legal-section">
            <h2>3. Acceptable Use</h2>
            <p>
              You must not misuse TeamUP for harassment, spam, fraud, or
              harmful behavior. We may restrict or remove accounts that violate
              community safety expectations.
            </p>
          </article>

          <article className="legal-section">
            <h2>4. Content and Collaboration</h2>
            <p>
              You keep ownership of content you post, but you grant TeamUP
              permission to display it inside the platform for matching and
              collaboration features.
            </p>
          </article>

          <article className="legal-section">
            <h2>5. Service Availability</h2>
            <p>
              We aim for reliable uptime, but availability is not guaranteed.
              Features may change, pause, or be removed as the product evolves.
            </p>
          </article>

          <article className="legal-section">
            <h2>6. Contact</h2>
            <p>
              For support or legal questions, contact the TeamUP support team
              through your official project channels.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
