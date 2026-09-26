import React from "react";

//INTERNAL IMPORT
import {
  HeroCard1,
  HeroCard2,
  HeroCard3,
  HeroCard4,
  HeroCard5,
  HeroCard6,
  HeroCard7,
  Header1,
} from "../../SVG/index";
import Header from "./Header";
import Card from "./Card";
import Revenue from "./Revenue";
import Statistic from "./Statistic";
import FinancialChart from "./FinancialChart";
import Patient from "./Patient";

const Home = ({
  registerDoctors,
  registeredPatient,
  setPatientDetails,
  setOpenComponent,
  setDoctorDetails,
  notifications,
  allAppointments,
  accountBalance,
  currency,
}) => {
  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        {/* Metric Cards Row */}
        <Card
          title={"Total Patient"}
          patient={`${registeredPatient?.length || 0}`}
          number={"4"}
          iconOne={<HeroCard1 />}
          iconTwo={<HeroCard2 />}
          classStyle={"bg-danger"}
        />
        <Card
          title={"Doctor"}
          patient={`${registerDoctors?.length || 0}`}
          number={".4"}
          iconOne={<HeroCard3 />}
          iconTwo={<HeroCard4 />}
          classStyle={"bg-success "}
        />
        <Card
          title={"Appointment"}
          patient={`${allAppointments?.length || 0}`}
          number={".2"}
          iconOne={<HeroCard5 />}
          iconTwo={<HeroCard6 />}
          classStyle={"bg-info"}
        />
        <Card
          title={"Notifications"}
          patient={`${notifications?.length || 0}`}
          number={".5"}
          iconOne={<HeroCard7 />}
          iconTwo={<Header1 />}
          classStyle={"bg-secondary"}
        />

        {/* Row 2: Balance | Total Revenue | Network Fee */}
        <Revenue accountBalance={accountBalance} currency={currency} />
        <Statistic
          registerDoctors={registerDoctors}
          registeredPatient={registeredPatient}
          allAppointments={allAppointments}
          currency={currency}
        />

        {/* Row 3: Financial Line Chart (Revenue & Network Fee) | Recent Patient */}
        <FinancialChart
          registerDoctors={registerDoctors}
          registeredPatient={registeredPatient}
          allAppointments={allAppointments}
          currency={currency}
        />
        <Patient
          registeredPatient={registeredPatient}
          setPatientDetails={setPatientDetails}
          setOpenComponent={setOpenComponent}
        />
      </div>
    </div>
  );
};

export default Home;
