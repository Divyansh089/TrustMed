import React, { useState, useEffect } from "react";

const NavHeader = () => {
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      const wrapper = document.getElementById("main-wrapper");
      if (wrapper) {
        setIsClosed(wrapper.classList.contains("menu-toggle"));
      }
    };
    updateStatus();

    const wrapper = document.getElementById("main-wrapper");
    if (wrapper) {
      const observer = new MutationObserver(updateStatus);
      observer.observe(wrapper, { attributes: true, attributeFilter: ["class"] });
      return () => observer.disconnect();
    }
  }, []);

  const toggleSidebar = () => {
    const wrapper = document.getElementById("main-wrapper");
    if (wrapper) {
      wrapper.classList.toggle("menu-toggle");
      setIsClosed(wrapper.classList.contains("menu-toggle"));
    }
    const hamburger = document.querySelector(".hamburger");
    if (hamburger) {
      hamburger.classList.toggle("is-active");
    }
  };

  return (
    <div className="nav-header">
      <a href="/" className="brand-logo d-flex align-items-center">
        <img
          src="/svg/trustmed-icon.svg"
          alt="TrustMed"
          className="logo-abbr"
          style={{ height: "36px", width: "auto", objectFit: "contain" }}
        />
        {!isClosed && (
          <img
            src="/svg/trustmed-text.svg"
            alt="TrustMed"
            className="brand-title"
            style={{
              height: "26px",
              width: "auto",
              objectFit: "contain",
              marginLeft: "10px",
            }}
          />
        )}
      </a>
      <div className="nav-control" onClick={toggleSidebar}>
        <div className="hamburger">
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </div>
      </div>
    </div>
  );
};

export default NavHeader;
