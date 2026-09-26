import React, { useState, useContext, createContext, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import toast from "react-hot-toast";
//INTERNAL IMPORT
import {
  HANDLE_NETWORK_SWITCH,
  SHORTEN_ADDRESS,
  HEALTH_CARE_CONTARCT,
  PINATA_AIP_KEY,
  PINATA_SECRECT_KEY,
  UPLOAD_METADATA,
  PARSED_ERROR_MSG,
  GET_ALL_APPROVE_DOCTORS,
} from "./constants";

const DOCTOR_REGISTER_FEE = process.env.NEXT_PUBLIC_DOCTOR_REGISTER_FEE;
const PATIENT_APOINMENT_FEE = process.env.NEXT_PUBLIC_PATIENT_APPOINMENT_FEE;
const PATIENT_REGISTER_FEE = process.env.NEXT_PUBLIC_PATIENT_REGISTER_FEE;
const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  //STATE VERIABLE
  const [address, setAddress] = useState();
  const [accountBalance, setAccountBalance] = useState(null);
  const [loader, setLoader] = useState(false);
  const [reCall, setReCall] = useState(0);
  const [currency, setCurrency] = useState(CURRENCY);
  const [openComponent, setOpenComponent] = useState("Home");
  const [registerDoctors, setRegisterDoctors] = useState();
  const [registeredPatient, setRegisteredPatient] = useState();

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  //CHECK WALLET CONNECT
  const CHECKI_IF_CONNECTED_LOAD = async () => {
    try {
      if (!window.ethereum) return null;
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts && accounts.length) {
        setAddress(accounts[0]);
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const getBalance = await provider.getBalance(accounts[0]);
          const bal = ethers.utils.formatEther(getBalance);
          setAccountBalance(bal);
        } catch (balErr) {
          console.log("Balance fetch err:", balErr);
        }
        return accounts[0];
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  //CONNECT WALLET
  const CONNECT_WALLET = async () => {
    try {
      if (!window.ethereum) {
        notifyError("MetaMask is not installed.");
        return null;
      }
      await HANDLE_NETWORK_SWITCH();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts && accounts.length > 0) {
        const firstAccount = accounts[0];
        setAddress(firstAccount);
        return firstAccount;
      }
      return null;
    } catch (error) {
      console.log("Connect wallet error:", error);
      return null;
    }
  };

  useEffect(() => {
    CHECKI_IF_CONNECTED_LOAD();

    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccounts = (accounts) => {
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          setAddress("");
          setAccountBalance(null);
        }
      };

      const handleChain = () => {
        setReCall((prev) => prev + 1);
      };

      window.ethereum.on("accountsChanged", handleAccounts);
      window.ethereum.on("chainChanged", handleChain);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccounts);
        window.ethereum.removeListener("chainChanged", handleChain);
      };
    }
  }, []);

  //-------MEDICINE------------

  //ADD MEDICINE
  const ADD_MEDICINE = async (medicine) => {
    try {
      const {
        verifyingDoctor,
        name,
        brand,
        manufacturer,
        manufacturDate,
        expiryDate,
        code,
        companyEmail,
        discount,
        manufactureAddress,
        price,
        quentity,
        currentLocation,
        mobile,
        email,
        image,
        description,
      } = medicine;
      if (
        !verifyingDoctor ||
        !name ||
        !brand ||
        !manufacturer ||
        !manufacturDate ||
        !expiryDate ||
        !code ||
        !companyEmail ||
        !discount ||
        !manufactureAddress ||
        !price ||
        !quentity ||
        !currentLocation ||
        !mobile ||
        !email ||
        !image ||
        !description
      )
        return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const data = JSON.stringify({
        verifyingDoctor: verifyingDoctor,
        name: name,
        brand: brand,
        manufacturer: manufacturer,
        manufacturDate: manufacturDate,
        expiryDate: expiryDate,
        code: code,
        companyEmail: companyEmail,
        discount: discount,
        manufactureAddress: manufactureAddress,
        price: price,
        quentity: quentity,
        currentLocation: currentLocation,
        mobile: mobile,
        email: email,
        image: image,
        description: description,
      });

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const _IPFS_URL = await UPLOAD_METADATA(data);

        // Handle decimal ETH price (e.g. 0.00023 ETH) by converting to Wei (Solidity uint256 integer)
        const cleanPriceStr = String(price || "0").replace(/[^0-9.]/g, "").trim();
        let finalPriceInWei;
        try {
          finalPriceInWei = ethers.utils.parseUnits(cleanPriceStr || "0", 18);
        } catch (e) {
          const rounded = parseFloat(cleanPriceStr || "0").toFixed(18).replace(/\.?0+$/, "");
          finalPriceInWei = ethers.utils.parseUnits(rounded || "0", 18);
        }

        const finalQuantity = parseInt(String(quentity).replace(/[^0-9]/g, ""), 10) || 1;
        const finalDiscount = parseInt(String(discount).replace(/[^0-9]/g, ""), 10) || 0;

        const transaction = await contract.ADD_MEDICINE(
          _IPFS_URL,
          finalPriceInWei,
          finalQuantity,
          finalDiscount,
          currentLocation,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Medicine Registration complete");
          setReCall((prev) => prev + 1);
          return true;
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
      return false;
    }
  };

  // UPDATE_MEDICINE_LOCATION
  const UPDATE_MEDICINE_LOCATION = async (updateMedicine) => {
    const { medicineID, update } = updateMedicine;
    try {
      if (!medicineID || !update) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Updating medicine location... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_MEDICINE_LOCATION(
          Number(medicineID),
          update,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Location updated successfully");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  // UPDATE_MEDICINE_PRICE
  const UPDATE_MEDICINE_PRICE = async (updateMedicine) => {
    const { medicineID, update } = updateMedicine;
    try {
      if (!medicineID || !update) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Updating new price... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const cleanPriceStr = String(update || "0").replace(/[^0-9.]/g, "").trim();
        let finalPriceInWei;
        try {
          finalPriceInWei = ethers.utils.parseUnits(cleanPriceStr || "0", 18);
        } catch (e) {
          const rounded = parseFloat(cleanPriceStr || "0").toFixed(18).replace(/\.?0+$/, "");
          finalPriceInWei = ethers.utils.parseUnits(rounded || "0", 18);
        }

        const transaction = await contract.UPDATE_MEDICINE_PRICE(
          Number(medicineID),
          finalPriceInWei,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Price updated successfully");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  // UPDATE_MEDICINE_QUANTITY
  const UPDATE_MEDICINE_QUANTITY = async (updateMedicine) => {
    const { medicineID, update } = updateMedicine;
    try {
      if (!medicineID || !update) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Updating new quantity... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const cleanQuantity = parseInt(String(update).replace(/[^0-9]/g, ""), 10) || 0;
        const transaction = await contract.UPDATE_MEDICINE_QUANTITY(
          Number(medicineID),
          cleanQuantity,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("quantity updated successfully");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  // UPDATE_MEDICINE_DISCOUNT
  const UPDATE_MEDICINE_DISCOUNT = async (updateMedicine) => {
    const { medicineID, update } = updateMedicine;
    try {
      if (!medicineID || !update) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Updating new discount... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const cleanDiscount = parseInt(String(update).replace(/[^0-9]/g, ""), 10) || 0;
        const transaction = await contract.UPDATE_MEDICINE_DISCOUNT(
          Number(medicineID),
          cleanDiscount,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("discount updated successfully");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  // UPDATE_MEDICINE_ACTIVE
  const UPDATE_MEDICINE_ACTIVE = async (_medicineId) => {
    try {
      if (!_medicineId) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Updating new status... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_MEDICINE_ACTIVE(
          Number(_medicineId),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Status updated successfully");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //-------END MEDICINE-----------

  ///REGISTER DOCTOR
  const ADD_DOCTOR = async (doctor) => {
    try {
      const {
        title,
        firstName,
        lastName,
        gender,
        degrer,
        yourAddress,
        designation,
        lastWork,
        mobile,
        emailID,
        collageName,
        collageID,
        joiningYear,
        endYear,
        specialization,
        registrationID,
        collageAddress,
        walletAddress,
        image,
        biography,
      } = doctor;
      if (
        !title ||
        !firstName ||
        !lastName ||
        !gender ||
        !degrer ||
        !yourAddress ||
        !designation ||
        !lastWork ||
        !mobile ||
        !emailID ||
        !collageName ||
        !collageID ||
        !joiningYear ||
        !endYear ||
        !specialization ||
        !registrationID ||
        !collageAddress ||
        !walletAddress ||
        !image ||
        !biography
      )
        return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const data = JSON.stringify({
        title: title,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        degrer: degrer,
        yourAddress: yourAddress,
        designation: designation,
        lastWork: lastWork,
        mobile: mobile,
        emailID: emailID,
        collageName: collageName,
        collageID: collageID,
        joiningYear: joiningYear,
        endYear: endYear,
        specialization: specialization,
        registrationID: registrationID,
        collageAddress: collageAddress,
        walletAddress: walletAddress,
        image: image,
        biography: biography,
      });

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const _fee = await contract.registrationDoctorFee();

        const _IPFS_URL = await UPLOAD_METADATA(data);

        const accountName = `${title} ${firstName} ${lastName}`;

        const _type = "Doctor";

        const transaction = await contract.ADD_DOCTOR(
          _IPFS_URL,
          walletAddress,
          accountName,
          _type,
          {
            value: _fee.toString(),
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registration complete! Awaiting admin approval.");
          setReCall((prev) => prev + 1);
          return true;
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
      return false;
    }
  };

  // DOCTOR APPROVE
  const APPROVE_DOCTOR_STATUS = async (_doctorId) => {
    try {
      if (!_doctorId) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations Approve is processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.APPROVE_DOCTOR_STATUS(
          Number(_doctorId),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations Approve conplete");
          setReCall(reCall + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //PRESCRIBE PATIENT MEDICINE
  const PRESCRIBE_MEDICINE = async (prescribeDoctor) => {
    try {
      const { medicineID, patientID } = prescribeDoctor;
      if (!medicineID || !patientID) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.PRESCRIBE_MEDICINE(
          Number(medicineID),
          Number(patientID),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //UPDATE_PATIENT_MEDICAL_HISTORY
  const UPDATE_PATIENT_MEDICAL_HISTORY = async (conditionUpdate) => {
    try {
      const { message, patientID } = conditionUpdate;
      if (!patientID || !message) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_PATIENT_MEDICAL_HISTORY(
          Number(patientID),
          message,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //COMPLETE APPOINMENT
  const COMPLETE_APPOINTMENT = async (_appointmentId) => {
    try {
      if (!_appointmentId) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.COMPLETE_APPOINTMENT(
          Number(_appointmentId),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //------APTIENT-------

  ///ADD PATIENT
  const ADD_PATIENTS = async (patient, doctor) => {
    try {
      const doctorAddress = doctor?.accountAddress;
      const doctorName = `${doctor?.title} ${doctor?.firstName} ${doctor?.lastName}`;

      const {
        title,
        firstName,
        lastName,
        gender,
        medicialHistory,
        yourAddress,
        mobile,
        emailID,
        birth,
        walletAddress,
        image,
        message,
        city,
      } = patient;
      if (
        !title ||
        !firstName ||
        !lastName ||
        !gender ||
        !medicialHistory ||
        !yourAddress ||
        !mobile ||
        !emailID ||
        !birth ||
        !walletAddress ||
        !image ||
        !message ||
        !city ||
        !doctorName ||
        !doctorAddress
      )
        return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const data = JSON.stringify({
        title: title,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        medicialHistory: medicialHistory,
        yourAddress: yourAddress,
        mobile: mobile,
        emailID: emailID,
        birth: birth,
        doctorName: doctorName,
        doctorAddress: doctorAddress,
        walletAddress: walletAddress,
        image: image,
        message: message,
        city: city,
      });

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const _fee = await contract.registrationPatientFee();

        const _IPFS_URL = await UPLOAD_METADATA(data);

        const accountName = `${title} ${firstName} ${lastName}`;

        const _type = "Patient";

        const transaction = await contract.ADD_PATIENTS(
          _IPFS_URL,
          [medicialHistory],
          walletAddress,
          [0],
          accountName,
          doctorAddress,
          doctorName,
          _type,
          {
            value: _fee.toString(),
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registration complete!");
          setReCall((prev) => prev + 1);
          return true;
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
      return false;
    }
  };

  ///BOOK APPOINMENT
  const BOOK_APPOINTMENT = async (booking, bookingDoctor) => {
    try {
      const { from, to, appointmentDate, condition, message } = booking;
      console.log(from, to, appointmentDate, condition, message);
      const { accountAddress, title, firstName, lastName, doctorID } =
        bookingDoctor;

      if (
        !from ||
        !to ||
        !appointmentDate ||
        !condition ||
        !message ||
        !accountAddress
      )
        return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const _fee = await contract.appointmentFee();
        const _patientID = await contract.GET_PATIENT_ID(address);

        const transaction = await contract.BOOK_APPOINTMENT(
          _patientID.toNumber(),
          Number(doctorID),
          from,
          to,
          appointmentDate,
          condition,
          message,
          accountAddress,
          `${title} ${firstName} ${lastName}`,
          {
            value: _fee.toString(),
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //BUY MEDICINE
  const BUY_MEDICINE = async (_medicineId, _price, _quantity) => {
    try {
      if (!_medicineId || !_quantity) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registration processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const _patientID = await contract.GET_PATIENT_ID(address);

        const cleanPriceStr = String(_price || "0").replace(/[^0-9.]/g, "").trim();
        let unitPriceWei;
        try {
          unitPriceWei = ethers.utils.parseUnits(cleanPriceStr || "0", 18);
        } catch (e) {
          const rounded = parseFloat(cleanPriceStr || "0").toFixed(18).replace(/\.?0+$/, "");
          unitPriceWei = ethers.utils.parseUnits(rounded || "0", 18);
        }

        const qty = parseInt(String(_quantity).replace(/[^0-9]/g, ""), 10) || 1;
        const parsedAmount = unitPriceWei.mul(ethers.BigNumber.from(qty));

        const paymentHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: address,
              to: ADMIN_ADDRESS,
              gas: "0x5208",
              value: parsedAmount.toHexString(),
            },
          ],
        });

        const transaction = await contract.BUY_MEDICINE(
          _patientID.toNumber(),
          Number(_medicineId),
          Number(_quantity),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registration complete");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      notifyError("Something went wrong");
      const msg = PARSED_ERROR_MSG(error);
      console.log(msg);
      console.log(error);
    }
  };
  ///CHAT
  const SEND_MESSAGE = async (activeChat, messageChat) => {
    try {
      const { name, userAddress } = activeChat;
      const { message } = messageChat;

      if (!message || !userAddress) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract._SEND_MESSAGE(
          userAddress,
          address,
          message,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          setReCall(reCall + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      notifyError("Something went wrong");
      console.log(error);
    }
  };

  //-----ADMIN--------

  //UPADTE REGSITRATION FEE
  const UPDATE_REGISTRATION_DOCTOR_FEE = async (_newFee) => {
    try {
      if (!_newFee) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_REGISTRATION_FEE(
          ethers.utils.parseEther(_newFee),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //UPADTE APPOINMENT FEE
  const UPDATE_APPOINTMENT_FEE = async (_newFee) => {
    try {
      if (!_newFee) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_APPOINTMENT_FEE(
          ethers.utils.parseEther(_newFee),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //UPADTE PATIENT_REGISTRATION FEE
  const UPDATE_REGISTRATION_PATIENT_FEE = async (_newFee) => {
    try {
      if (!_newFee) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_REGISTRATION_PATIENT_FEE(
          ethers.utils.parseEther(_newFee),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //UPDATE_ADMIN_ADDRESS
  const UPDATE_ADMIN_ADDRESS = async (_newAddress) => {
    try {
      if (!_newAddress) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_ADMIN_ADDRESS(_newAddress, {
          gasLimit: ethers.utils.hexlify(8000000),
        });

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          setReCall((prev) => prev + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        UPDATE_ADMIN_ADDRESS,
        UPDATE_REGISTRATION_PATIENT_FEE,
        UPDATE_APPOINTMENT_FEE,
        UPDATE_REGISTRATION_DOCTOR_FEE,
        CHECKI_IF_CONNECTED_LOAD,
        CONNECT_WALLET,
        //ADD MEDICINE
        ADD_MEDICINE,
        UPDATE_MEDICINE_ACTIVE,
        UPDATE_MEDICINE_DISCOUNT,
        UPDATE_MEDICINE_LOCATION,
        UPDATE_MEDICINE_PRICE,
        UPDATE_MEDICINE_QUANTITY,
        //ADD DOCOTR
        ADD_DOCTOR,
        APPROVE_DOCTOR_STATUS,
        ADD_PATIENTS,
        PRESCRIBE_MEDICINE,

        UPDATE_PATIENT_MEDICAL_HISTORY,
        BOOK_APPOINTMENT,
        COMPLETE_APPOINTMENT,
        SEND_MESSAGE,
        BUY_MEDICINE,
        //VERIBALES
        notifySuccess,
        notifyError,
        setLoader,
        setAddress,
        setAccountBalance,
        setOpenComponent,
        openComponent,
        currency,
        address,
        loader,
        accountBalance,
        reCall,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
