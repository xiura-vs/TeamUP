import "./About.css";

export default function About() {
  return (
    <main className="about-page">
      <div className="about-container">
        <header className="about-hero">
          <span className="about-badge">About TeamUP</span>
          <h1>
            Building Better Student Teams, <span>Faster</span>
          </h1>
          <p>
            TeamUP helps students find the right collaborators for hackathons,
            college projects, and startup ideas through profile-driven matching
            and seamless communication.
          </p>
        </header>

        <section className="about-grid">
          <article className="about-card">
            <h2>Our Mission</h2>
            <p>
              Make team formation simple, trusted, and skill-focused so great
              ideas are not blocked by teammate discovery.
            </p>
          </article>

          <article className="about-card">
            <h2>What We Solve</h2>
            <p>
              Students often struggle to find teammates with the right stack,
              commitment, and goals. TeamUP solves this with smarter matching.
            </p>
          </article>

          <article className="about-card">
            <h2>How We Help</h2>
            <p>
              From profile discovery to chat and project collaboration, TeamUP
              gives one place to connect, evaluate fit, and start building.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
