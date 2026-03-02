import "./LegalPage.css";

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <span className="legal-badge">Legal</span>
          <h1>Privacy Policy</h1>
          <p>Last updated: March 2, 2026</p>
        </header>

        <section className="legal-card">
          <article className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>
              TeamUP collects profile details you provide, such as name, email,
              skills, interests, and collaboration preferences.
            </p>
          </article>

          <article className="legal-section">
            <h2>2. How We Use Information</h2>
            <p>
              We use your data to power teammate matching, platform messaging,
              account security, and overall product improvements.
            </p>
          </article>

          <article className="legal-section">
            <h2>3. Data Sharing</h2>
            <p>
              We do not sell personal information. We only share data when it
              is required to run platform features or comply with legal
              obligations.
            </p>
          </article>

          <article className="legal-section">
            <h2>4. Data Security</h2>
            <p>
              We apply reasonable technical and operational safeguards to
              protect user information from unauthorized access and misuse.
            </p>
          </article>

          <article className="legal-section">
            <h2>5. Your Choices</h2>
            <p>
              You can update profile data from account settings and request
              account deletion through support channels.
            </p>
          </article>

          <article className="legal-section">
            <h2>6. Policy Updates</h2>
            <p>
              We may update this policy periodically. Continued use of TeamUP
              after updates means you accept the revised policy.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
