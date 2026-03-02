import React from "react";
import { Link } from "react-router-dom";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Hero from "../components/Hero";
import StatsCards from "../components/StatsCards";
import FAQ from "../components/FAQ";

const Home = () => {
  return (
    <div className="home-page">
      <div className="main-container">
        {/* 1. HERO SECTION */}
        <Hero />

        {/* 2. STATS SECTION */}
        <StatsCards />

        {/* 3. FEATURES SECTION */}
        <Features />

        {/* 4. HOW IT WORKS */}
        <HowItWorks />

        {/* 5. HACKATHON HUB */}
        <section className="section hackathon-hub">
          <div className="section-header">
            <span className="badge-sm">Live Opportunities</span>
            <h2>Hackathon Hub</h2>
            <p>
              Browse top-tier hackathons happening right now. <br />
              Join a team and start building.
            </p>
          </div>

          <div className="hackathon-grid">
            <div className="hackathon-card">
              <div className="card-badge">Live Now</div>
              <div className="h-icon bg-blue">🌐</div>
              <h3>Global AI Challenge</h3>
              <p className="h-date">Oct 15 - Oct 17 • Online</p>
              <div className="h-tags">
                <span>Artificial Intelligence</span>
                <span>Python</span>
              </div>
              <div className="h-footer">
                <div className="h-participants">
                  <span className="p-circle">👤</span>
                  <span className="p-circle">👤</span>
                  <span className="p-text">+450 joined</span>
                </div>
                <Link to="/login" className="btn-outline-sm">
                  View Details 🔒
                </Link>
              </div>
            </div>
            <div className="hackathon-card">
              <div className="card-badge upcoming">Starts in 2 days</div>
              <div className="h-icon bg-purple">⚡</div>
              <h3>Web3 Innovation Hack</h3>
              <p className="h-date">Nov 05 - Nov 07 • Hybrid</p>
              <div className="h-tags">
                <span>Blockchain</span>
                <span>Solidity</span>
              </div>
              <div className="h-footer">
                <div className="h-participants">
                  <span className="p-circle">👤</span>
                  <span className="p-circle">👤</span>
                  <span className="p-text">+200 joined</span>
                </div>
                <Link to="/login" className="btn-outline-sm">
                  View Details 🔒
                </Link>
              </div>
            </div>
            <div className="hackathon-card">
              <div className="card-badge upcoming">Register Open</div>
              <div className="h-icon bg-green">🌱</div>
              <h3>EcoTech Summit 2026</h3>
              <p className="h-date">Dec 10 - Dec 12 • Bangalore</p>
              <div className="h-tags">
                <span>IoT</span>
                <span>Sustainability</span>
              </div>
              <div className="h-footer">
                <div className="h-participants">
                  <span className="p-circle">👤</span>
                  <span className="p-circle">👤</span>
                  <span className="p-text">+120 joined</span>
                </div>
                <Link to="/login" className="btn-outline-sm">
                  View Details 🔒
                </Link>
              </div>
            </div>
          </div>
          <div className="hub-cta">
            <Link to="/signup" className="view-all-link">
              View all 50+ Hackathons →
            </Link>
          </div>
        </section>

        {/* 6. FAQ SECTION */}
        <FAQ />

        {/* 7. CTA SECTION */}
        <section className="cta-wrapper">
          <div className="cta-card">
            <div className="cta-content">
              <h2>
                Ready to find your <span>Dream Team?</span>
              </h2>
              <p>
                Join thousands of students building the future. Stop searching
                alone and start building together today.
              </p>
              <div className="cta-buttons">
                <Link to="/signup" className="btn-pill-white">
                  Start Building Now
                </Link>
                <Link to="/login" className="btn-pill-transparent">
                  Login to Account
                </Link>
              </div>
            </div>
            <div className="circle-decor circle-1"></div>
            <div className="circle-decor circle-2"></div>
          </div>
        </section>
      </div>{" "}
      {/* End main-container */}
      {/* 8. FOOTER */}
      <footer className="footer">
        <div className="footer-content main-container">
          <div className="footer-brand">
            <h3>TeamUP</h3>
            <p>The best place to find your dream team.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
            </div>
            <div>
              <h4>Company</h4>
              <Link to="/about">About</Link>
              <a href="#">Blog</a>
            </div>
            <div>
              <h4>Legal</h4>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 TeamUP Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
