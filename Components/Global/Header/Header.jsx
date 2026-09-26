import React, { useState, useEffect } from "react";

//INTERNAL IMPORT
import GiftData from "../Data/Gift.json";

import { Header1, Header2, Header3 } from "../../SVG/index";
import { IoIosSunny, IoMoon } from "../../ReactICON/index";
import Notification from "./Notification/Notification";
import Gift from "./Gift/Gift";
import Avator from "./Avator/Avator";

import { useStateContext } from "../../../Context/index";

const Header = ({
  user,
  setAddress,
  setOpenComponent,
  setPatientDetails,
  setDoctorDetails,
  userType,
  checkRegistration,
  notifications,
  notificationCount,
  setNotificationCount,
  openComponent,
}) => {
  const { CONNECT_WALLET, address } = useStateContext();
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  const getPageTitle = (comp) => {
    switch (comp) {
      case "Home":
        return "Dashboard";
      case "Chat":
        return "Chat";
      case "Appointment":
        return "Appointment";
      case "All Appoinments":
        return "All Appointments";
      case "Ask AI":
        return "TrustMed AI";
      case "Shop":
      case "Medicine":
        return "Medicine Shop";
      case "Add Medicine":
        return "Add Medicine";
      case "Patient":
        return "Patients";
      case "Doctor":
        return "Doctors";
      case "DoctorProfile":
      case "Profile":
        return "Profile";
      case "DoctorDetails":
        return "Doctor Details";
      case "PatientProfile":
        return "Patient Profile";
      case "MedicialHistory":
        return "Medical History";
      case "YourAppointments":
        return "Your Appointments";
      case "Prescription":
        return "Prescription";
      case "Notifications":
        return "Notifications";
      case "Order":
        return "Orders";
      case "User":
        return "User Settings";
      case "UpdateAdmin":
        return "Admin Settings";
      case "StaffProfile":
        return "Staff Profile";
      default:
        return comp || "Dashboard";
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setIsMetaMaskInstalled(true);

      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    console.log("Accounts changed:", accounts?.[0]);
    if (accounts && accounts.length > 0) {
      setAddress(accounts[0]);
    } else {
      setAddress("");
    }
  };

  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              <div className="dashboard_bar">{getPageTitle(openComponent)}</div>
            </div>
            <ul className="navbar-nav header-right">
              <li className="nav-item dropdown notification_dropdown">
                <a
                  className="nav-link ai-icon"
                  href="javascript:;"
                  role="button"
                  data-bs-toggle="dropdown"
                  onClick={() => (
                    setNotificationCount(0),
                    localStorage.setItem(
                      "ALL_NOTIFICATION",
                      JSON.stringify(notifications?.length)
                    )
                  )}
                >
                  <Header1 />
                  <span className="badge light text-white bg-primary">
                    {notificationCount > 0 && notificationCount}
                  </span>
                </a>
                <Notification
                  notifications={notifications}
                  setOpenComponent={setOpenComponent}
                />
              </li>

              <li className="nav-item dropdown notification_dropdown">
                <a
                  className="nav-link ai-icon"
                  href="javascript:;"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <Header3 />
                  <span className="badge light text-white bg-dark">
                    {GiftData?.length}
                  </span>
                </a>

                <Gift />
              </li>
              <li className="nav-item dropdown notification_dropdown">
                <a
                  className="nav-link bell dz-theme-mode"
                  href="javascript:void(0);"
                >
                  <i id="icon-light">
                    <IoIosSunny />
                  </i>
                  <i id="icon-dark">
                    <IoMoon />
                  </i>
                </a>
              </li>
              <li className="nav-item dropdown header-profile">
                <Avator
                  user={user}
                  setOpenComponent={setOpenComponent}
                  setPatientDetails={setPatientDetails}
                  setDoctorDetails={setDoctorDetails}
                  userType={userType}
                  address={address}
                  CONNECT_WALLET={CONNECT_WALLET}
                  checkRegistration={checkRegistration}
                />
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
