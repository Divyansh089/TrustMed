import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "../../ReactICON/index";

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

  const toggleSidebar = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const wrapper = document.getElementById("main-wrapper");
    if (wrapper) {
      wrapper.classList.toggle("menu-toggle");
      const isNowClosed = wrapper.classList.contains("menu-toggle");
      setIsClosed(isNowClosed);

      const body = document.body;
      if (
        body.getAttribute("data-sidebar-style") === "full" &&
        body.getAttribute("data-layout") === "vertical"
      ) {
        body.setAttribute(
          "data-sidebar-position",
          isNowClosed ? "static" : "fixed"
        );
      }
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
      <div
        className="nav-control"
        onClick={toggleSidebar}
        role="button"
        tabIndex={0}
        aria-label={isClosed ? "Open Sidebar" : "Close Sidebar"}
        title={isClosed ? "Open Sidebar" : "Close Sidebar"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleSidebar(e);
          }
        }}
      >
        <div className={`sidebar-arrow-btn ${isClosed ? "is-closed" : "is-open"}`}>
          {isClosed ? <FaArrowRight /> : <FaArrowLeft />}
        </div>
      </div>
    </div>
  );
};

export default NavHeader;
