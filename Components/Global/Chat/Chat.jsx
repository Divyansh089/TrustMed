import React, { useState, useEffect } from "react";

//INTERNAL IMPORT
import {
  FaUserDoctor,
  BsSendFill,
  IoMdClose,
  FaLink,
  BsRobot,
  FaUserAlt,
} from "../../ReactICON/index"; //INTERNAL IMPORT

//INTERNAL IMPORT
import {
  GET_MY_FRIEND_LIST,
  PARSED_ERROR_MSG,
  GET_READ_MESSAGE,
  SHORTEN_ADDRESS,
  CONVERT_TIMESTAMP_TO_READABLE,
  UPLOAD_IPFS_IMAGE,
} from "../../../Context/constants";
import { useStateContext } from "../../../Context/index";

const Chat = ({ SEND_MESSAGE }) => {
  const {
    CHECKI_IF_CONNECTED_LOAD,
    address,
    setAddress,
    setLoader,
    notifySuccess,
    notifyError,
  } = useStateContext();
  const [friendList, setFriendList] = useState();
  const [activeChat, setActiveChat] = useState();
  const [chatMessage, setChatMessage] = useState();
  const [uploadFile, setUploadFile] = useState(false);
  const [currentUser, setCurrentUser] = useState(address || "");
  const messagesEndRef = React.useRef(null);

  const [messageChat, setMessageChat] = useState({
    message: "",
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const connectedAddr = await CHECKI_IF_CONNECTED_LOAD();

        if (connectedAddr) {
          setCurrentUser(connectedAddr);
          GET_MY_FRIEND_LIST(connectedAddr).then((friend) => {
            setActiveChat(friend[0]);
            console.log(friend);
            setFriendList(friend);
          });
        }
      } catch (error) {
        const ErrorMsg = PARSED_ERROR_MSG(error);
        console.log(ErrorMsg);
      }
    };

    fetchData();
  }, [address]);

  useEffect(() => {
    const fetchData = async (activeChat) => {
      try {
        const connectedAddr = await CHECKI_IF_CONNECTED_LOAD();

        if (connectedAddr) {
          setCurrentUser(connectedAddr);
          GET_READ_MESSAGE(activeChat?.userAddress).then((message) => {
            console.log(message);
            setChatMessage(message);
          });
        }
      } catch (error) {
        const ErrorMsg = PARSED_ERROR_MSG(error);
        console.log(ErrorMsg);
      }
    };

    fetchData(activeChat);
  }, [activeChat]);

  return (
    <div className="container-fluid">
      <div className="page-titles">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="javascript:void(0)">Message</a>
          </li>
          <li className="breadcrumb-item active">
            <a href="javascript:void(0)">Doctors</a>
          </li>
        </ol>
      </div>
      {/* row */}
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-xl-3 col-xxl-4 email-left-body">
                  <div className="mb-3 mt-4 mt-sm-0">
                    <div className="pb-3 border-bottom mb-3">
                      <h3 className="fs-20 mb-0 text-black font-w600 d-flex align-items-center justify-content-between">
                        <span>Chat History</span>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: "rgba(32, 201, 151, 0.12)",
                            color: "var(--primary)",
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "4px 8px",
                            borderRadius: "6px",
                          }}
                        >
                          {friendList?.length || 0} Contacts
                        </span>
                      </h3>
                    </div>
                    {friendList?.map((friend, index) => {
                      const isSelected =
                        (activeChat?.userAddress &&
                          friend?.userAddress &&
                          activeChat.userAddress.toLowerCase() ===
                            friend.userAddress.toLowerCase()) ||
                        activeChat?.name === friend?.name;

                      return (
                        <div
                          onClick={() => setActiveChat(friend)}
                          key={index}
                          className="mail-list rounded mt-2"
                          style={{ cursor: "pointer" }}
                        >
                          <a
                            className={`list-group-item ${
                              isSelected ? "active" : ""
                            }`}
                            style={
                              isSelected
                                ? {
                                    backgroundColor: "var(--primary)",
                                    borderColor: "var(--primary)",
                                    color: "#ffffff",
                                    borderRadius: "8px",
                                    boxShadow:
                                      "0 4px 10px rgba(32, 201, 151, 0.25)",
                                    transition: "all 0.2s ease",
                                  }
                                : {
                                    backgroundColor: "#f8fafc",
                                    borderColor: "#e2e8f0",
                                    color: "#1e293b",
                                    borderRadius: "8px",
                                    transition: "all 0.2s ease",
                                  }
                            }
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor =
                                  "rgba(32, 201, 151, 0.1)";
                                e.currentTarget.style.borderColor =
                                  "var(--primary)";
                                e.currentTarget.style.color = "var(--primary)";
                                e.currentTarget.style.transform =
                                  "translateX(4px)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor =
                                  "#f8fafc";
                                e.currentTarget.style.borderColor = "#e2e8f0";
                                e.currentTarget.style.color = "#1e293b";
                                e.currentTarget.style.transform =
                                  "translateX(0px)";
                              }
                            }}
                          >
                            <i
                              className="fa font-18 align-middle me-2"
                              style={{
                                color: isSelected ? "#ffffff" : "var(--primary)",
                              }}
                            >
                              <FaUserDoctor />
                            </i>
                            <span className="font-w500">{friend?.name}</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="col-xl-9 col-xxl-8">
                  <div>
                    <div className="d-flex align-items-center">
                      <h4 className="card-title d-sm-none d-block">Message</h4>
                    </div>
                    <div className="compose-content">
                      <div>
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control bg-transparent"
                            placeholder={activeChat?.name}
                          />
                        </div>
                        <div
                          style={{
                            height: "20rem",
                            width: "100%",
                            marginBottom: "1rem",
                            border: "2px solid #EDF0F1",
                            borderRadius: "5px",
                            overflowY: "auto",
                          }}
                        >
                          <>
                            <div
                              className="card-body msg_card_body dz-scroll"
                              id="DZ_W_Contacts_Body3"
                            >
                              {chatMessage?.map((message, index) => {
                                const isSentByMe = Boolean(
                                  (activeChat?.userAddress &&
                                    message?.sender &&
                                    activeChat.userAddress.toLowerCase() !==
                                      message.sender.toLowerCase()) ||
                                  (currentUser &&
                                    message?.sender &&
                                    currentUser.toLowerCase() ===
                                      message.sender.toLowerCase()) ||
                                  (address &&
                                    message?.sender &&
                                    address.toLowerCase() ===
                                      message.sender.toLowerCase())
                                );

                                return isSentByMe ? (
                                  <div key={index} className="chat-msg-sent">
                                    <div className="chat-bubble-sent">
                                      <div className="chat-msg-meta">
                                        You • {message.timestamp}
                                      </div>
                                      <p className="chat-msg-text">
                                        {message.msg}
                                      </p>
                                    </div>
                                    <div className="ms-2 d-flex align-items-end mb-1">
                                      <div
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          borderRadius: "50%",
                                          backgroundColor: "#e8f5e9",
                                          color: "#04A547",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "13px",
                                          flexShrink: 0,
                                        }}
                                      >
                                        <FaUserAlt />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    key={index}
                                    className="chat-msg-received"
                                  >
                                    <div className="me-2 d-flex align-items-end mb-1">
                                      <div
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          borderRadius: "50%",
                                          backgroundColor: "#f1f5f9",
                                          color: "#64748b",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "13px",
                                          flexShrink: 0,
                                        }}
                                      >
                                        <FaUserAlt />
                                      </div>
                                    </div>
                                    <div className="chat-bubble-received">
                                      <div className="chat-msg-meta">
                                        {SHORTEN_ADDRESS(message.sender)} •{" "}
                                        {message.timestamp}
                                      </div>
                                      <p className="chat-msg-text">
                                        {message.msg}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                              <div ref={messagesEndRef} />
                            </div>
                          </>
                        </div>

                        <div className="mb-3">
                          <textarea
                            id="email-compose-editor"
                            className="textarea_editor form-control bg-transparent"
                            rows={2}
                            placeholder="Enter text ..."
                            defaultValue={""}
                            onChange={(e) =>
                              setMessageChat({
                                ...messageChat,
                                message: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-start mt-4 mb-3">
                      <button
                        className="btn btn-danger light btn-sl-sm me-2"
                        type="button"
                        onClick={() => setMessageChat({ ...messageChat, message: "" })}
                      >
                        <span className="me-2">
                          <i className="fa ">
                            <IoMdClose />
                          </i>
                        </span>
                        Reset
                      </button>
                      <button
                        className="btn btn-primary btn-sl-sm"
                        type="button"
                        onClick={() => SEND_MESSAGE(activeChat, messageChat)}
                      >
                        <span className="me-2">
                          <i className="fa ">
                            <BsSendFill />
                          </i>
                        </span>
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
