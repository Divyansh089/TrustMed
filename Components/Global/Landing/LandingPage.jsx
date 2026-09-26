import React, { useState, useEffect } from "react";
import { FaStethoscope, FaShoppingBag, FaUserAlt, FaHospital } from "react-icons/fa";
import { FaArrowRightLong, FaUsers, FaUserDoctor } from "react-icons/fa6";
import { BsRobot } from "react-icons/bs";
import { MdEmail, MdAdminPanelSettings } from "react-icons/md";
import { GiMedicines } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { SlCalender } from "react-icons/sl";

// ─── Inline SVG icons (no extra dependency) ─────────────────────────────────
const IconLock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconLink = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const IconEye = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconWallet = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
  </svg>
);
const IconUser = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconNetwork = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <circle cx="19" cy="19" r="3" />
    <circle cx="5" cy="19" r="3" />
    <line x1="12" y1="8" x2="12" y2="14" />
    <line x1="12" y1="14" x2="19" y2="16" />
    <line x1="12" y1="14" x2="5" y2="16" />
  </svg>
);
const IconActivity = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconHamburger = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// ─── LandingPage ─────────────────────────────────────────────────────────────
const LandingPage = ({ address, connectMetaMask, setAddPatient, setAddDocotr, SHORTEN_ADDRESS }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll helper — scopes scroll to the landing page div itself
  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const container = document.querySelector(".tm-landing");
    const el = document.getElementById(id);
    if (el && container) container.scrollTo({ top: el.offsetTop - 68, behavior: "smooth" });
  };

  // ── CTA handlers — wire into existing pipeline ────────────────────────────
  const handlePatientCTA = () => address ? setAddPatient(true) : connectMetaMask();
  const handleDoctorCTA  = () => address ? setAddDocotr(true)  : connectMetaMask();

  // ── Data ──────────────────────────────────────────────────────────────────
  const navLinks = [
    { id: "home",         label: "Home" },
    { id: "how-it-works", label: "How It Works" },
    { id: "features",     label: "Features" },
    { id: "for-patients", label: "For Patients" },
    { id: "for-doctors",  label: "For Doctors" },
    { id: "blockchain",   label: "Why Blockchain" },
  ];

  const whyCards = [
    { icon: <IconShield />, color: "#36c95f", title: "Secure Medical Records",  desc: "Patient data is managed through a decentralised architecture, ensuring maximum privacy and integrity." },
    { icon: <IconUser />,   color: "#3b82f6", title: "Patient Ownership",       desc: "Patients retain full ownership and transparency over their healthcare information at all times." },
    { icon: <IconLink />,   color: "#a336c9", title: "Doctor Connectivity",     desc: "Seamless interaction between patients and verified healthcare professionals on one platform." },
    { icon: <IconEye />,    color: "#f59e0b", title: "Transparent Healthcare",  desc: "Blockchain provides verifiable, auditable interactions across the entire care lifecycle." },
  ];

  const steps = [
    { num: "01", icon: <IconWallet />,  title: "Connect Wallet",         desc: "Link your MetaMask wallet to authenticate securely on the blockchain." },
    { num: "02", icon: <IconUser />,    title: "Create Your Profile",    desc: "Register as a Patient or Doctor and build your decentralised healthcare identity." },
    { num: "03", icon: <IconNetwork />, title: "Connect & Collaborate",  desc: "Find doctors, book appointments, and communicate within one secure ecosystem." },
    { num: "04", icon: <IconShield />,  title: "Manage Health Securely", desc: "Access prescriptions, medical history, medicines and AI assistance — all on-chain." },
  ];

  const patientFeatures = [
    { icon: <FaUserDoctor size={18} />,  label: "Find Verified Doctors" },
    { icon: <SlCalender size={18} />,    label: "Book Appointments" },
    { icon: <GiMedicines size={18} />,   label: "Manage Prescriptions" },
    { icon: <FaShoppingBag size={18} />, label: "Medicine Shop" },
    { icon: <MdEmail size={18} />,       label: "Chat with Doctors" },
    { icon: <BsRobot size={18} />,       label: "AI Health Assistant" },
    { icon: <IconActivity />,            label: "Medical History" },
    { icon: <FaHospital size={18} />,    label: "Healthcare Records" },
  ];

  const doctorFeatures = [
    { icon: <FaUserDoctor size={18} />,         label: "Professional Profile" },
    { icon: <FaUsers size={18} />,              label: "Patient Management" },
    { icon: <SlCalender size={18} />,           label: "Appointment Workflow" },
    { icon: <GiMedicines size={18} />,          label: "Prescribe Medicines" },
    { icon: <IconActivity />,                   label: "Medical Records" },
    { icon: <MdEmail size={18} />,              label: "Patient Communication" },
    { icon: <MdAdminPanelSettings size={18} />, label: "Secure Verification" },
    { icon: <IconShield />,                     label: "Blockchain Identity" },
  ];

  const blockchainPoints = [
    { icon: <IconNetwork />, title: "Decentralised Architecture", desc: "No single point of failure. Data lives on-chain, resistant to tampering." },
    { icon: <IconLock />,    title: "Secure Data Management",     desc: "End-to-end encrypted metadata stored on IPFS, referenced via smart contracts." },
    { icon: <IconEye />,     title: "Transparent Records",        desc: "Every interaction is recorded immutably and can be audited at any time." },
    { icon: <IconUser />,    title: "User-Controlled Access",     desc: "You decide who sees your health data — always yours, never a company's." },
    { icon: <IconShield />,  title: "Verifiable Transactions",    desc: "Smart contracts enforce rules automatically without a central authority." },
    { icon: <IconActivity />,title: "Always Available",           desc: "Blockchain-powered infrastructure means no downtime — 24/7 access." },
  ];

  return (
    <div className="tm-landing">

      {/* ══════════════ NAVBAR ══════════════════════════════════════════ */}
      <nav className={`tm-nav${scrolled ? " tm-nav--scrolled" : ""}`}>
        <div className="tm-nav__inner">
          {/* Logo from public/svg directory */}
          <button className="tm-nav__logo-btn" onClick={() => scrollTo("home")}>
            <img src="/svg/trustmed-logo.svg" alt="TrustMed" className="tm-nav__logo-img" />
          </button>

          {/* Desktop nav links */}
          <ul className="tm-nav__links">
            {navLinks.map(n => (
              <li key={n.id}>
                <button className="tm-nav__link" onClick={() => scrollTo(n.id)}>{n.label}</button>
              </li>
            ))}
          </ul>

          {/* Single "Connect Wallet" button — no "Get Started" */}
          <div className="tm-nav__actions">
            <button className="tm-btn tm-btn--ghost" onClick={connectMetaMask}>
              <IconWallet />
              <span>{address ? SHORTEN_ADDRESS(address) : "Connect Wallet"}</span>
            </button>
          </div>

          {/* Hamburger (mobile) */}
          <button className="tm-nav__hamburger" onClick={() => setMobileMenuOpen(o => !o)} aria-label="Toggle menu">
            {mobileMenuOpen ? <IoMdClose size={24} /> : <IconHamburger />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="tm-nav__mobile">
            {navLinks.map(n => (
              <button key={n.id} className="tm-nav__mobile-link" onClick={() => scrollTo(n.id)}>{n.label}</button>
            ))}
            <div className="tm-nav__mobile-actions">
              <button className="tm-btn tm-btn--ghost tm-btn--full" onClick={connectMetaMask}>
                <IconWallet />&nbsp;{address ? SHORTEN_ADDRESS(address) : "Connect Wallet"}
              </button>
              <button className="tm-btn tm-btn--primary tm-btn--full" onClick={handlePatientCTA}>Register as Patient</button>
              <button className="tm-btn tm-btn--secondary tm-btn--full" onClick={handleDoctorCTA}>Register as Doctor</button>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════ HERO ════════════════════════════════════════════ */}
      <section id="home" className="tm-hero">
        <div className="tm-hero__blob tm-hero__blob--1" />
        <div className="tm-hero__blob tm-hero__blob--2" />

        <div className="tm-container tm-hero__inner">
          {/* LEFT: text */}
          <div className="tm-hero__text">
            <h1 className="tm-hero__title">
              Your Health Records.<br />
              Secured by <span className="tm-text-green">Blockchain.</span>
              <br />
              Owned by <span className="tm-text-green">You.</span>
            </h1>

            <p className="tm-hero__desc">
              TrustMed connects patients and healthcare professionals through a
              secure, transparent and decentralised healthcare ecosystem — where
              your data belongs to <em>you</em>.
            </p>

            {/* Hero CTAs — both wired to existing registration pipeline */}
            <div className="tm-hero__ctas">
              <button className="tm-btn tm-btn--primary tm-btn--lg" onClick={handlePatientCTA}>
                <FaUserAlt size={14} />
                <span>Register as Patient</span>
              </button>
              <button className="tm-btn tm-btn--secondary tm-btn--lg" onClick={handleDoctorCTA}>
                <FaStethoscope size={14} />
                <span>Register as Doctor</span>
              </button>
            </div>
          </div>

          {/* RIGHT: floating cards */}
          <div className="tm-hero__visual">
            <div className="tm-hero__img-ring">
              <img
                src="/doctor/2.jpg"
                alt="Healthcare professional"
                className="tm-hero__img"
                onError={e => { e.target.src = "/doctor/1.jpg"; }}
              />
              <div className="tm-hero__img-badge">
                <IconShield />
                <span>Blockchain Secured</span>
              </div>
            </div>

            {/* Stat cards — same gradient-bx pattern as the dashboard */}
            <div className="tm-hero__float tm-hero__float--tl">
              <div className="tm-hero__float-label">Patient Registration</div>
              <div className="tm-hero__float-val-row">
                <span className="tm-hero__float-val">100k+</span>
                <span className="tm-hero__float-icon"><FaUserAlt /></span>
              </div>
            </div>
            <div className="tm-hero__float tm-hero__float--br">
              <div className="tm-hero__float-label">Doctor Registration</div>
              <div className="tm-hero__float-val-row">
                <span className="tm-hero__float-val">100+</span>
                <span className="tm-hero__float-icon"><FaStethoscope /></span>
              </div>
            </div>
            <div className="tm-hero__float tm-hero__float--tr">
              <div className="tm-hero__float-label">Appointments</div>
              <div className="tm-hero__float-val-row">
                <span className="tm-hero__float-val">500+</span>
                <span className="tm-hero__float-icon"><SlCalender /></span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Mouse Scroll Indicator */}
        <button
          className="tm-mouse-scroll"
          onClick={() => scrollTo("features")}
          aria-label="Scroll down to features"
        >
          <div className="tm-mouse">
            <span className="tm-mouse-wheel" />
          </div>
          <span className="tm-mouse-arrow" />
        </button>
      </section>

      {/* ══════════════ WHY TRUSTMED ════════════════════════════════════ */}
      <section id="features" className="tm-section">
        <div className="tm-container">
          <div className="tm-section-hd">
            <span className="tm-badge">Why TrustMed</span>
            <h2 className="tm-section-title">Healthcare Built for <span className="tm-text-green">You</span></h2>
            <p className="tm-section-sub">A platform designed around patient welfare, doctor efficiency, and blockchain transparency.</p>
          </div>
          <div className="tm-grid tm-grid--4">
            {whyCards.map((c, i) => (
              <div key={i} className="tm-feat-card" style={{ "--fc": c.color }}>
                <div className="tm-feat-card__icon" style={{ color: c.color, background: `${c.color}18` }}>{c.icon}</div>
                <h3 className="tm-feat-card__title">{c.title}</h3>
                <p className="tm-feat-card__desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ════════════════════════════════════ */}
      <section id="how-it-works" className="tm-section tm-how-section">
        <div className="tm-container">
          <div className="tm-section-hd">
            <span className="tm-badge">Simple Process</span>
            <h2 className="tm-section-title">How It <span className="tm-text-green">Works</span></h2>
            <p className="tm-section-sub">Get started in four simple steps and join the decentralised healthcare revolution.</p>
          </div>
          <div className="tm-steps">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="tm-step">
                  <div className="tm-step__num">{s.num}</div>
                  <div className="tm-step__icon">{s.icon}</div>
                  <h3 className="tm-step__title">{s.title}</h3>
                  <p className="tm-step__desc">{s.desc}</p>
                </div>
                {i < steps.length - 1 && <div className="tm-step__connector" aria-hidden="true" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PATIENT SECTION ═════════════════════════════════ */}
      <section id="for-patients" className="tm-section tm-dual-section">
        <div className="tm-container">
          <div className="tm-dual">
            {/* Images column */}
            <div className="tm-dual__images">
              <div className="tm-dual__img-wrap">
                <img src="/patients/1.jpg" alt="Patient on TrustMed" className="tm-dual__img-main" onError={e => { e.target.src = "/patients/2.jpg"; }} />
                <img src="/patients/3.jpg" alt="Patient profile" className="tm-dual__img-sm" onError={e => { e.target.style.display = "none"; }} />
                <div className="tm-dual__pill tm-dual__pill--green"><FaUserAlt size={13} />&nbsp; Patient Platform</div>
              </div>
            </div>
            {/* Content column */}
            <div className="tm-dual__content">
              <span className="tm-badge tm-badge--green">For Patients</span>
              <h2 className="tm-section-title tm-section-title--left">
                Your Health,<br /><span className="tm-text-green">Your Control.</span>
              </h2>
              <p className="tm-dual__desc">
                As a TrustMed patient, you get access to a full healthcare management suite — powered by blockchain and built around you.
              </p>
              <div className="tm-feat-tags">
                {patientFeatures.map((f, i) => (
                  <div key={i} className="tm-feat-tag" style={{ "--ft": "#36c95f" }}>
                    <span className="tm-feat-tag__icon">{f.icon}</span>
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
              {/* Wired to existing AddPatient registration */}
              <button className="tm-btn tm-btn--primary tm-btn--lg" onClick={handlePatientCTA}>
                Register as Patient &nbsp;<FaArrowRightLong />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ DOCTOR SECTION ══════════════════════════════════ */}
      <section id="for-doctors" className="tm-section tm-dual-section tm-dual-section--alt">
        <div className="tm-container">
          <div className="tm-dual tm-dual--reverse">
            <div className="tm-dual__content">
              <span className="tm-badge tm-badge--blue">For Doctors</span>
              <h2 className="tm-section-title tm-section-title--left">
                Modern Tools for<br /><span className="tm-text-green">Modern Medicine.</span>
              </h2>
              <p className="tm-dual__desc">
                Join TrustMed as a verified healthcare professional and manage your patient interactions through a secure, transparent digital workflow.
              </p>
              <div className="tm-feat-tags">
                {doctorFeatures.map((f, i) => (
                  <div key={i} className="tm-feat-tag" style={{ "--ft": "#3b82f6" }}>
                    <span className="tm-feat-tag__icon">{f.icon}</span>
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
              {/* Wired to existing AddDoctor registration */}
              <button className="tm-btn tm-btn--secondary tm-btn--lg" onClick={handleDoctorCTA}>
                Register as Doctor &nbsp;<FaArrowRightLong />
              </button>
            </div>
            {/* Images column */}
            <div className="tm-dual__images">
              <div className="tm-dual__img-wrap tm-dual__img-wrap--right">
                <img src="/doctor/1.jpg" alt="Doctor on TrustMed" className="tm-dual__img-main" onError={e => { e.target.src = "/doctor/2.jpg"; }} />
                <img src="/doctor/4.jpg" alt="Doctor profile" className="tm-dual__img-sm tm-dual__img-sm--right" onError={e => { e.target.style.display = "none"; }} />
                <div className="tm-dual__pill tm-dual__pill--blue"><FaStethoscope size={13} />&nbsp; Doctor Platform</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ BLOCKCHAIN SECTION ══════════════════════════════ */}
      <section id="blockchain" className="tm-section tm-blockchain-section">
        <div className="tm-blockchain-section__bg" />
        <div className="tm-container" style={{ position: "relative", zIndex: 1 }}>
          <div className="tm-section-hd">
            <span className="tm-badge">Blockchain Technology</span>
            <h2 className="tm-section-title">Why <span className="tm-text-green">Blockchain</span> Matters</h2>
            <p className="tm-section-sub">Decentralised technology brings trust, transparency, and security to every healthcare interaction.</p>
          </div>
          <div className="tm-grid tm-grid--3">
            {blockchainPoints.map((p, i) => (
              <div key={i} className="tm-chain-card">
                <div className="tm-chain-card__icon">{p.icon}</div>
                <h3 className="tm-chain-card__title">{p.title}</h3>
                <p className="tm-chain-card__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════════════════════════════════ */}
      <footer className="tm-footer">
        <div className="tm-container">
          <div className="tm-footer__grid">
            {/* Brand logo from public/svg directory */}
            <div className="tm-footer__brand">
              <div className="tm-footer__logo-wrap">
                <img src="/svg/trustmed-logo-white.svg" alt="TrustMed" className="tm-footer__logo-img" />
              </div>
              <p className="tm-footer__tagline">
                A decentralised healthcare platform connecting patients and doctors through blockchain technology.
              </p>
            </div>

            {/* Platform links */}
            <div className="tm-footer__col">
              <h4 className="tm-footer__heading">Platform</h4>
              <ul className="tm-footer__list">
                <li><button onClick={() => scrollTo("for-patients")}>For Patients</button></li>
                <li><button onClick={() => scrollTo("for-doctors")}>For Doctors</button></li>
                <li><button onClick={() => scrollTo("how-it-works")}>How It Works</button></li>
                <li><button onClick={() => scrollTo("features")}>Features</button></li>
              </ul>
            </div>

            {/* Tech links */}
            <div className="tm-footer__col">
              <h4 className="tm-footer__heading">Technology</h4>
              <ul className="tm-footer__list">
                <li><button onClick={() => scrollTo("blockchain")}>Blockchain Security</button></li>
                <li><a href="https://ipfs.io" target="_blank" rel="noreferrer">IPFS Storage</a></li>
                <li><a href="https://metamask.io" target="_blank" rel="noreferrer">MetaMask Wallet</a></li>
              </ul>
            </div>

            {/* Registration CTAs */}
            <div className="tm-footer__col">
              <h4 className="tm-footer__heading">Get Started</h4>
              <div className="tm-footer__ctas">
                <button className="tm-btn tm-btn--primary tm-btn--sm" onClick={handlePatientCTA}>
                  Patient Registration
                </button>
                <button className="tm-btn tm-btn--ghost tm-btn--sm" onClick={handleDoctorCTA}>
                  Doctor Registration
                </button>
              </div>
              {address ? (
                <p className="tm-footer__wallet">
                  <span className="tm-wallet-dot" /> {SHORTEN_ADDRESS(address)}
                </p>
              ) : (
                <button className="tm-footer__connect-btn" onClick={connectMetaMask}>
                  <IconWallet />&nbsp; Connect MetaMask
                </button>
              )}
            </div>
          </div>

          <div className="tm-footer__bottom">
            <p>© 2024 TrustMed Hospital. All Rights Reserved.</p>
            <p className="tm-footer__credit">Built by <strong>@Divyansh089</strong></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
