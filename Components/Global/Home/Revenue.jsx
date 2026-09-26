import React from "react";

const Revenue = ({ accountBalance, currency }) => {
  return (
    <div className="col-xl-4 col-xxl-4 col-lg-4 col-md-12">
      <div className="card border-0 shadow-sm" style={{ borderRadius: "1.25rem" }}>
        <div className="card-header border-0 pb-0 pt-3 px-4 d-flex justify-content-between align-items-center">
          <div>
            <p className="fs-12 text-muted mb-1 text-uppercase font-w500" style={{ letterSpacing: "0.5px" }}>
              Admin Wallet
            </p>
            <h3 className="fs-20 mb-0 text-black font-w600">Balance</h3>
          </div>
          <span
            className="badge"
            style={{
              backgroundColor: "rgba(112, 114, 117, 0.1)",
              color: "#495057",
              fontWeight: "600",
              fontSize: "11px",
              padding: "5px 10px",
              borderRadius: "8px",
            }}
          >
            Connected Wallet
          </span>
        </div>
        <div className="card-body pt-2 pb-3 px-4">
          <div className="d-flex align-items-baseline">
            <span className="text-info fs-28 font-w700 me-2">
              {accountBalance?.slice(0, 8)}
            </span>
            <span className="text-secondary fs-16 font-w500">{currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
