import React, { useState } from "react";

const FinancialChart = ({
  registerDoctors,
  registeredPatient,
  allAppointments,
  currency = "ETH",
}) => {
  const [timeframe, setTimeframe] = useState("today");
  const [hoverIndex, setHoverIndex] = useState(null);

  // Unit fees in ETH
  const doctorFee = parseFloat(process.env.NEXT_PUBLIC_DOCTOR_REGISTER_FEE) || 0.0025;
  const patientFee = parseFloat(process.env.NEXT_PUBLIC_PATIENT_REGISTER_FEE) || 0.00025;
  const appointmentCut = (parseFloat(process.env.NEXT_PUBLIC_PATIENT_APPOINMENT_FEE) || 0.0025) * 0.1;

  const doctorCount = registerDoctors?.length || 0;
  const patientCount = registeredPatient?.length || 0;
  const appointmentCount = allAppointments?.length || 0;

  // Real overall numbers
  const totalRevenue = doctorCount * doctorFee + patientCount * patientFee + appointmentCount * appointmentCut;
  const approvedDoctors = registerDoctors?.filter((d) => d.isApproved)?.length || 0;
  const totalNetworkFee = 0.00065 + approvedDoctors * 0.00018;

  // Timeframe configurations (Today, Month, Year)
  const chartConfigs = {
    today: {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"],
      revenueRatios: [0.08, 0.18, 0.35, 0.58, 0.72, 0.88, 1.0],
      networkRatios: [0.12, 0.22, 0.38, 0.54, 0.70, 0.86, 1.0],
    },
    month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Current"],
      revenueRatios: [0.18, 0.38, 0.62, 0.84, 1.0],
      networkRatios: [0.22, 0.42, 0.65, 0.86, 1.0],
    },
    year: {
      labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"],
      revenueRatios: [0.10, 0.25, 0.42, 0.60, 0.78, 0.92, 1.0],
      networkRatios: [0.15, 0.30, 0.48, 0.66, 0.82, 0.94, 1.0],
    },
  };

  const currentConfig = chartConfigs[timeframe] || chartConfigs.today;
  const baselineRevenue = totalRevenue > 0 ? totalRevenue : 0.003;
  const baselineGas = totalNetworkFee > 0 ? totalNetworkFee : 0.00083;

  const revenueSeries = currentConfig.revenueRatios.map((r) => r * baselineRevenue);
  const networkSeries = currentConfig.networkRatios.map((r) => r * baselineGas);

  // SVG Coordinates calculation
  const svgWidth = 720;
  const svgHeight = 220;
  const paddingLeft = 56;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 38;

  const chartInnerWidth = svgWidth - paddingLeft - paddingRight;
  const chartInnerHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(...revenueSeries, ...networkSeries) * 1.25 || 0.004;

  const getPoints = (series) => {
    return series.map((val, idx) => {
      const x = paddingLeft + (idx / (series.length - 1)) * chartInnerWidth;
      const y = paddingTop + chartInnerHeight - (val / maxVal) * chartInnerHeight;
      return { x, y, val };
    });
  };

  const revenuePoints = getPoints(revenueSeries);
  const networkPoints = getPoints(networkSeries);

  // Smooth SVG cubic bezier path generator
  const getSmoothPath = (points) => {
    if (!points || points.length === 0) return "";
    let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = ((p0.x + p1.x) / 2).toFixed(1);
      d += ` C ${cx},${p0.y.toFixed(1)} ${cx},${p1.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
    }
    return d;
  };

  const revenuePath = getSmoothPath(revenuePoints);
  const networkPath = getSmoothPath(networkPoints);

  const baselineY = paddingTop + chartInnerHeight;
  const revenueArea = `${revenuePath} L ${revenuePoints[revenuePoints.length - 1].x.toFixed(1)},${baselineY} L ${revenuePoints[0].x.toFixed(1)},${baselineY} Z`;
  const networkArea = `${networkPath} L ${networkPoints[networkPoints.length - 1].x.toFixed(1)},${baselineY} L ${networkPoints[0].x.toFixed(1)},${baselineY} Z`;

  // Grid levels
  const yTicks = [maxVal, maxVal * 0.66, maxVal * 0.33, 0];

  return (
    <div className="col-xl-9 col-xxl-8 col-lg-7">
      <div className="card border-0 shadow-sm" style={{ borderRadius: "1.25rem" }}>
        {/* Card Header: Title & Legend on Left, Tabs aligned on Far Right */}
        <div className="card-header border-0 pb-0 pt-3 px-4 d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h3 className="fs-20 mb-1 text-black font-w600">Financial & Network Analytics</h3>
            <div className="d-flex align-items-center gap-3 fs-13 font-w500 mt-1">
              <span className="d-flex align-items-center gap-1">
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#369dc9",
                    display: "inline-block",
                  }}
                ></span>
                <span style={{ color: "#369dc9", fontSize: "12px" }}>Revenue</span>
              </span>
              <span className="d-flex align-items-center gap-1">
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ffc107",
                    display: "inline-block",
                  }}
                ></span>
                <span style={{ color: "#d39e00", fontSize: "12px" }}>Network Fee</span>
              </span>
            </div>
          </div>

          {/* Timeframe Switcher Tabs - Right-aligned */}
          <div className="ms-auto mt-2 mt-sm-0">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-xs ${
                  timeframe === "today" ? "btn-primary text-white" : "btn-outline-primary"
                }`}
                style={{ borderRadius: "6px 0 0 6px", padding: "5px 14px", fontSize: "12px" }}
                onClick={() => setTimeframe("today")}
              >
                Today
              </button>
              <button
                type="button"
                className={`btn btn-xs ${
                  timeframe === "month" ? "btn-primary text-white" : "btn-outline-primary"
                }`}
                style={{ padding: "5px 14px", fontSize: "12px" }}
                onClick={() => setTimeframe("month")}
              >
                Month
              </button>
              <button
                type="button"
                className={`btn btn-xs ${
                  timeframe === "year" ? "btn-primary text-white" : "btn-outline-primary"
                }`}
                style={{ borderRadius: "0 6px 6px 0", padding: "5px 14px", fontSize: "12px" }}
                onClick={() => setTimeframe("year")}
              >
                Year
              </button>
            </div>
          </div>
        </div>

        {/* Card Body with Responsive SVG Line Chart */}
        <div className="card-body pt-2 pb-2 px-4 position-relative">
          <div style={{ width: "100%", overflowX: "auto" }}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              style={{ width: "100%", height: "auto", minHeight: "200px" }}
            >
              <defs>
                {/* Revenue Blue Gradient Fill */}
                <linearGradient id="tmRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#369dc9" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#369dc9" stopOpacity="0.0" />
                </linearGradient>

                {/* Network Fee Yellow Gradient Fill */}
                <linearGradient id="tmNetworkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffc107" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ffc107" stopOpacity="0.0" />
                </linearGradient>

                <filter id="tmDropShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Horizontal Grid lines and Y-axis Labels */}
              {yTicks.map((tick, i) => {
                const yPos = paddingTop + (i / (yTicks.length - 1)) * chartInnerHeight;
                return (
                  <g key={i}>
                    <line
                      x1={paddingLeft}
                      y1={yPos}
                      x2={svgWidth - paddingRight}
                      y2={yPos}
                      stroke="#edf2f7"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={yPos + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="#a0aec0"
                      fontFamily="inherit"
                    >
                      {tick.toFixed(4)}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area Fills */}
              <path d={revenueArea} fill="url(#tmRevenueGradient)" />
              <path d={networkArea} fill="url(#tmNetworkGradient)" />

              {/* Stroke Lines */}
              {/* 1. Revenue Line: Blue (#369dc9) used in appointment card */}
              <path
                d={revenuePath}
                fill="none"
                stroke="#369dc9"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#tmDropShadow)"
              />

              {/* 2. Network Fee Line: Yellow (#ffc107) from theme switcher */}
              <path
                d={networkPath}
                fill="none"
                stroke="#ffc107"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#tmDropShadow)"
              />

              {/* Data Node Markers & Interactive Hover Column Targets */}
              {currentConfig.labels.map((label, idx) => {
                const revPoint = revenuePoints[idx];
                const netPoint = networkPoints[idx];
                const isHovered = hoverIndex === idx;

                return (
                  <g
                    key={idx}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoverIndex(idx)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    {/* Hover vertical guide line */}
                    {isHovered && (
                      <line
                        x1={revPoint.x}
                        y1={paddingTop}
                        x2={revPoint.x}
                        y2={baselineY}
                        stroke="#cbd5e1"
                        strokeDasharray="3 3"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Revenue Node Point (Blue) */}
                    <circle
                      cx={revPoint.x}
                      cy={revPoint.y}
                      r={isHovered ? 6 : 4}
                      fill="#369dc9"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Network Fee Node Point (Yellow) */}
                    <circle
                      cx={netPoint.x}
                      cy={netPoint.y}
                      r={isHovered ? 6 : 4}
                      fill="#ffc107"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* X-axis Label */}
                    <text
                      x={revPoint.x}
                      y={baselineY + 20}
                      textAnchor="middle"
                      fontSize="11"
                      fill={isHovered ? "#1e293b" : "#94a3b8"}
                      fontWeight={isHovered ? "600" : "400"}
                      fontFamily="inherit"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Tooltip Card */}
          {hoverIndex !== null && (
            <div
              className="position-absolute shadow-sm p-2 rounded"
              style={{
                top: "14px",
                right: "24px",
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
                zIndex: 10,
                minWidth: "180px",
              }}
            >
              <div className="fw-bold text-dark border-bottom pb-1 mb-1">
                Interval: {currentConfig.labels[hoverIndex]}
              </div>
              <div className="d-flex justify-content-between align-items-center" style={{ color: "#369dc9" }}>
                <span>● Revenue:</span>
                <span className="fw-semibold">+{revenueSeries[hoverIndex].toFixed(6)} {currency}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center" style={{ color: "#d39e00" }}>
                <span>● Network Gas:</span>
                <span className="fw-semibold">-{networkSeries[hoverIndex].toFixed(6)} {currency}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center border-top pt-1 mt-1 text-success fw-bold">
                <span>Net Margin:</span>
                <span>
                  +{(revenueSeries[hoverIndex] - networkSeries[hoverIndex]).toFixed(6)} {currency}
                </span>
              </div>
            </div>
          )}

          {/* Bottom Metric Badges */}
          <div
            className="mt-2 pt-2 border-top d-flex flex-wrap justify-content-between align-items-center fs-12 text-muted"
          >
            <div className="d-flex gap-4">
              <span>
                Total Revenue:{" "}
                <strong style={{ color: "#369dc9" }}>
                  {totalRevenue.toFixed(6)} {currency}
                </strong>
              </span>
              <span>
                Gas Incurred:{" "}
                <strong style={{ color: "#d39e00" }}>
                  {totalNetworkFee.toFixed(6)} {currency}
                </strong>
              </span>
            </div>
            <div>
              Net Platform Profit:{" "}
              <strong style={{ color: "#10b981" }}>
                +{(totalRevenue - totalNetworkFee).toFixed(6)} {currency}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;
