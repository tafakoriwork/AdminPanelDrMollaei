import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import moment from "moment-jalaali";
import SideBar from "./sidebar";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { api_token } from "../redux/optionsSlice";

function TicketChat() {
  const [__ticketChats, set__ticketChats] = useState([]);
  const location = useLocation();
  const [parent_id, setParentId] = useState(null);
  const [user, setUser] = useState(null);
  const [Text, setText] = useState("");
  const token = useSelector(api_token)
  useEffect(() => {
    setParentId(new URLSearchParams(location.search).get("parent_id"));
  }, [location.search]);

  useEffect(() => {
    getticket();
  }, [parent_id]);

  function getticket() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/ticket/${parent_id}`,{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then((response) => response.data)
      .then((data) => {
        if (data) {
          set__ticketChats(data.messages);
          setUser(data.user);
        }
      });
  }

  function _sendmessage() {
    axios
      .post(`https://drmollaii.ir/v1/public/admin/ticket/receivemessage`, {
        text: Text,
        parent_id,
      },{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then((response) => response.data)
      .then((data) => {
        if (data) {
          toast.success("پاسخ با موفقیت به کاربر ارسال شد");
          setText("");
          getticket();
        }
      });
  }

  return (
    <>
      <SideBar
        Main={
          <>
            <div className="main-cards">
              <div className="card h-75">
                <div className="col-sm-9 bg-light p-2 chatBox" style={{maxHeight: '600px', overflowY: 'auto', overflowX: 'hidden'}}>
                  <h4 className="text-secondary text-center">
                    <Link to={"/users"}>
                      {user?.fname} {user?.lastname ? user.lastname : ""}
                    </Link>
                  </h4>
                  {__ticketChats.map((el, i) => (
                    <div key={i} className={"row flex-column"}>
                      {el.is_response ? (
                        <div className="receive ms-auto">
                          <p dir="auto">{el.text}</p>
                          <span style={{ fontSize: "10px" }}>
                            {moment(el.updated_at).format(
                              "jYYYY/jM/jD HH:mm:ss"
                            )}
                          </span>
                        </div>
                      ) : (
                        <div className="send">
                          <p dir="auto">{el.text}</p>
                          <span style={{ fontSize: "10px" }}>
                            {moment(el.updated_at).format(
                              "jYYYY/jM/jD HH:mm:ss"
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="col-sm-9 position-relative">
                  <textarea
                    dir="auto"
                    placeholder="type..."
                    className="form-control"
                    rows={4}
                    value={Text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>
                  <button
                    onClick={_sendmessage}
                    className="btn btn-sm btn-outline-primary position-absolute"
                    style={{ left: "10px", bottom: "10px" }}
                  >
                    ارسال
                  </button>
                </div>
              </div>
            </div>
          </>
        }
      />
    </>
  );
}

export default TicketChat;
