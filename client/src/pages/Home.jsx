import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <div className="main-container">
        
        {/* 1. HERO SECTION */}
        <section className="hero">
          <div className="hero-content animate-fade-up">
            <span className="badge animate-delay-1">✨ Join 5,000+ students building together</span>
            <h1 className="animate-delay-2">
              Find Your <span>Dream Team</span> for Any Project
            </h1>
            <p className="hero-subtext animate-delay-3">
              Connect with compatible teammates for hackathons, college projects, 
              and startup ideas using our smart skill-matching algorithm.
            </p>
            <div className="hero-btns animate-delay-4">
              <Link to="/signup" className="btn-pill-primary">Get Started Free →</Link>
              <Link to="/login" className="btn-pill-secondary">Explore Projects</Link>
            </div>
          </div>
          
          <div className="hero-visual animate-fade-in animate-delay-5">
            {/* Floater 1: Arjun */}
            <div className="profile-card float-card-1 floating-anim-1">
              <div className="avatar-circle bg-indigo">AM</div>
              <div className="card-info">
                <h4>Arjun Mehta</h4>
                <p>React • Node.js • AWS</p>
              </div>
              <div className="match-score">95% Match</div>
            </div>
            
            {/* Floater 2: Priyal */}
            <div className="profile-card float-card-2 floating-anim-2">
              <div className="avatar-circle bg-fuchsia">PS</div>
              <div className="card-info">
                <h4>Priyal Sharma</h4>
                <p>Python • ML • Design</p>
              </div>
              <div className="match-score">88% Match</div>
            </div>
          </div>
        </section>

        {/* 2. STATS SECTION */}
        <section className="stats-container animate-on-scroll">
          <div className="stat-item"><h3>5k+</h3><p>Active Students</p></div>
          <div className="stat-item"><h3>500+</h3><p>Projects Built</p></div>
          <div className="stat-item"><h3>120+</h3><p>Universities</p></div>
        </section>

        {/* 3. FEATURES SECTION */}
        <section className="section features">
          <div className="section-header">
            <span className="badge-sm">Features</span>
            <h2>Everything you need to build</h2>
            <p>Powerful tools to help you find, manage, and succeed with your new team.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Smart Matching</h3>
              <p>Our AI analyzes your skills and interests to find the perfect teammates.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Real-time Chat</h3>
              <p>Instantly connect with potential teammates and discuss ideas.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Project Showcase</h3>
              <p>Display your portfolio and attract top talent to your ideas.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Verified Profiles</h3>
              <p>Connect with confidence using university-verified student profiles.</p>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section className="section how-it-works">
          <div className="section-header">
            <h2>How it Works</h2>
          </div>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Profile</h3>
              <p>Sign up and list your skills, interests, and project ideas.</p>
            </div>
            <div className="step-line"></div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Get Matched</h3>
              <p>Browse recommended teammates or projects that fit you best.</p>
            </div>
            <div className="step-line"></div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Start Building</h3>
              <p>Connect, form a team, and launch your next big idea.</p>
            </div>
          </div>
        </section>

        {/* 5. HACKATHON HUB */}
        <section className="section hackathon-hub">
          <div className="section-header">
            <span className="badge-sm">Live Opportunities</span>
            <h2>Hackathon Hub</h2>
            <p>Browse top-tier hackathons happening right now. <br/>Join a team and start building.</p>
          </div>

          <div className="hackathon-grid">
            <div className="hackathon-card">
              <div className="card-badge">Live Now</div>
              <div className="h-icon bg-blue">🌐</div>
              <h3>Global AI Challenge</h3>
              <p className="h-date">Oct 15 - Oct 17 • Online</p>
              <div className="h-tags"><span>Artificial Intelligence</span><span>Python</span></div>
              <div className="h-footer">
                <div className="h-participants"><span className="p-circle">👤</span><span className="p-circle">👤</span><span className="p-text">+450 joined</span></div>
                <Link to="/login" className="btn-outline-sm">View Details 🔒</Link>
              </div>
            </div>
            <div className="hackathon-card">
              <div className="card-badge upcoming">Starts in 2 days</div>
              <div className="h-icon bg-purple">⚡</div>
              <h3>Web3 Innovation Hack</h3>
              <p className="h-date">Nov 05 - Nov 07 • Hybrid</p>
              <div className="h-tags"><span>Blockchain</span><span>Solidity</span></div>
              <div className="h-footer">
                <div className="h-participants"><span className="p-circle">👤</span><span className="p-circle">👤</span><span className="p-text">+200 joined</span></div>
                <Link to="/login" className="btn-outline-sm">View Details 🔒</Link>
              </div>
            </div>
            <div className="hackathon-card">
              <div className="card-badge upcoming">Register Open</div>
              <div className="h-icon bg-green">🌱</div>
              <h3>EcoTech Summit 2024</h3>
              <p className="h-date">Dec 10 - Dec 12 • Bangalore</p>
              <div className="h-tags"><span>IoT</span><span>Sustainability</span></div>
              <div className="h-footer">
                <div className="h-participants"><span className="p-circle">👤</span><span className="p-circle">👤</span><span className="p-text">+120 joined</span></div>
                <Link to="/login" className="btn-outline-sm">View Details 🔒</Link>
              </div>
            </div>
          </div>
          <div className="hub-cta">
            <Link to="/signup" className="view-all-link">View all 50+ Hackathons →</Link>
          </div>
        </section>

        {/* 6. CTA SECTION */}
        <section className="cta-wrapper">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to find your <span>Dream Team?</span></h2>
              <p>Join thousands of students building the future. Stop searching alone and start building together today.</p>
              <div className="cta-buttons">
                <Link to="/signup" className="btn-pill-white">Start Building Now</Link>
                <Link to="/login" className="btn-pill-transparent">Login to Account</Link>
              </div>
            </div>
            <div className="circle-decor circle-1"></div>
            <div className="circle-decor circle-2"></div>
          </div>
        </section>

      </div> {/* End main-container */}

      {/* 7. FOOTER */}
      <footer className="footer">
        <div className="footer-content main-container">
          <div className="footer-brand">
            <h3>TeamUP</h3>
            <p>The best place to find your dream team.</p>
          </div>
          <div className="footer-links">
            <div><h4>Product</h4><a href="#">Features</a><a href="#">Pricing</a></div>
            <div><h4>Company</h4><a href="#">About</a><a href="#">Blog</a></div>
            <div><h4>Legal</h4><a href="#">Privacy</a><a href="#">Terms</a></div>
          </div>
        </div>
        <div className="footer-bottom"><p>© 2024 TeamUP Inc. All rights reserved.</p></div>
      </footer>
    </div>
  );
};

export default Home;