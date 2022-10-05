import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import SideBar from "./sidebar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api_token } from "../redux/optionsSlice";

function Ticket() {
  const token = useSelector(api_token)
  const [_ticketCats, set_ticketCats] = useState([]);
  const history = useNavigate();
  useEffect(() => {
    getticket();
  }, [!_ticketCats]);

  function getticket() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/ticket`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data) set_ticketCats(data);
      });
  }

  return (
    <>
      <SideBar
        Main={
          <>
            <div className="main-cards">
              <div className="card">
                <table className="table table-stripped" dir="rtl">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>متن</th>
                      <th>پیام ها</th>
                      <th>تاریخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_ticketCats.map((el, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                            {el.title}
                        </td>
                      
                        <td>
                          <button
                            className="btn-sm btn btn-outline-primary"
                            onClick={() => history(`/ticketc?parent_id=${el.id}`)}
                          >
                            ورود به پیام ها
                          </button>
                        </td>
                        <td dir="ltr" className="text-end">
                            {moment(el.updated_at).format('jYYYY/jM/jD HH:mm:ss')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        }
      />
    </>
  );
}

export default Ticket;
