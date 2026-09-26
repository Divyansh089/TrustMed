import React from "react";

const Statistic = ({
  registerDoctors,
  registeredPatient,
  allAppointments,
  currency = "ETH",
}) => {
  // Pure TrustMed Revenue Calculations (Excluding external wallet deposits)
  const doctorFee = parseFloat(process.env.NEXT_PUBLIC_DOCTOR_REGISTER_FEE) || 0.0025;
  const patientFee = parseFloat(process.env.NEXT_PUBLIC_PATIENT_REGISTER_FEE) || 0.00025;
  const appointmentFee = parseFloat(process.env.NEXT_PUBLIC_PATIENT_APPOINMENT_FEE) || 0.0025;
  const adminAppointmentCut = appointmentFee * 0.1; // 10% platform share

  const doctorCount = registerDoctors?.length || 0;
  const patientCount = registeredPatient?.length || 0;
  const appointmentCount = allAppointments?.length || 0;

  const doctorRevenue = doctorCount * doctorFee;
  const patientRevenue = patientCount * patientFee;
  const appointmentRevenue = appointmentCount * adminAppointmentCut;

  const totalTrustMedRevenue = doctorRevenue + patientRevenue + appointmentRevenue;

  // Network (Gas) Fee calculation: admin gas spent solely on TrustMed operations
  const approvedDoctors = registerDoctors?.filter((d) => d.isApproved)?.length || 0;
  const adminApprovalGas = approvedDoctors * 0.00018; // approx 45k gas per approval
  const adminBaseSetupGas = 0.00065; // base setup and medicine administration gas
  const totalNetworkFee = adminBaseSetupGas + adminApprovalGas;

  return (
    <>
      {/* Box 1: Total Revenue (TrustMed DApp Only) */}
      <div className="col-xl-4 col-xxl-4 col-lg-4 col-md-6">
        <div className="card border-0 shadow-sm" style={{ borderRadius: "1.25rem" }}>
          <div className="card-header border-0 pb-0 pt-3 px-4 d-flex justify-content-between align-items-center">
            <div>
              <p className="fs-12 text-muted mb-1 text-uppercase font-w500" style={{ letterSpacing: "0.5px" }}>
                Pure DApp Revenue
              </p>
              <h3 className="fs-20 mb-0 text-black font-w600">Total Revenue</h3>
            </div>
            <span
              className="badge"
              style={{
                backgroundColor: "rgba(54, 157, 201, 0.12)",
                color: "#369dc9",
                fontWeight: "600",
                fontSize: "11px",
                padding: "5px 10px",
                borderRadius: "8px",
              }}
            >
              TrustMed Only
            </span>
          </div>

          <div className="card-body pt-2 pb-3 px-4">
            <div className="d-flex align-items-baseline">
              <span
                className="fs-28 font-w700 me-2"
                style={{ color: "#369dc9" }}
              >
                {totalTrustMedRevenue.toFixed(6)}
              </span>
              <span className="text-secondary fs-16 font-w500">{currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Box 2: Network Fee (Gas deducted strictly for TrustMed) */}
      <div className="col-xl-4 col-xxl-4 col-lg-4 col-md-6">
        <div className="card border-0 shadow-sm" style={{ borderRadius: "1.25rem" }}>
          <div className="card-header border-0 pb-0 pt-3 px-4 d-flex justify-content-between align-items-center">
            <div>
              <p className="fs-12 text-muted mb-1 text-uppercase font-w500" style={{ letterSpacing: "0.5px" }}>
                Admin Gas Spent
              </p>
              <h3 className="fs-20 mb-0 text-black font-w600">Network Fee</h3>
            </div>
            <span
              className="badge"
              style={{
                backgroundColor: "rgba(255, 193, 7, 0.16)",
                color: "#d39e00",
                fontWeight: "600",
                fontSize: "11px",
                padding: "5px 10px",
                borderRadius: "8px",
              }}
            >
              DApp Gas
            </span>
          </div>

          <div className="card-body pt-2 pb-3 px-4">
            <div className="d-flex align-items-baseline">
              <span
                className="fs-28 font-w700 me-2"
                style={{ color: "#ffc107" }}
              >
                {totalNetworkFee.toFixed(6)}
              </span>
              <span className="text-secondary fs-16 font-w500">{currency}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistic;
