import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import moment from "moment-jalaali";
import SideBar from "./sidebar";
import { useSelector } from "react-redux";
import { api_token } from "../redux/optionsSlice";

function Notification() {
  const [_notificationCats, set_notificationCats] = useState([]);
  const [edit_id, setEditId] = useState(null);
  const [deleting, setDelete] = useState(false);
  const [Title, setTitle] = useState(null);
  const token = useSelector(api_token)
  useEffect(() => {
    getNotification();
  }, [!_notificationCats]);

  function getNotification() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/notification`,{
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
      .then((respone) => respone.data)
      .then((data) => {
        if (data) set_notificationCats(data.result);
      });
  }

  function _create() {
    axios
      .post(`https://drmollaii.ir/v1/public/admin/notification`, {
        text: Title,
      },{
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ایجاد شد");
          getNotification();
        }
      });
  }

  //delete lessontype with id
  function _delete(id) {
    axios
      .delete(`https://drmollaii.ir/v1/public/admin/notification/${id}`,{
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت حذف شد");
          getNotification();
        }
      });
  }

  //delete lessontype with id
  function _edit() {
    axios
      .put(`https://drmollaii.ir/v1/public/admin/notification/${edit_id.id}`, {
        text: edit_id.text,
      },{
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
      .then((respone) => respone.data)
      .then((data) => {
        console.log(data);
        if (data.msg === "system_success") {
          toast.success("با موفقیت ویرایش شد");
          getNotification();
          setEditId(null);
        }
      });
  }

  return (
    <>
      <SideBar
        Main={
          <>
            <div className="main-header">
              <div className="row text-end">
                <div className="col-md-6 d-flex flex-column align-items-center">
                  <h6 className="col-6">ایجاد نوتیفیکیشن</h6>
                  <div className="row flex-column col-6 mx-0">
                    <textarea
                      dir="rtl"
                      type="text"
                      className="form-control text-end col"
                      placeholder="متن"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <button
                      onClick={_create}
                      className="btn btn-sm btn-primary m-1 col-sm-4 mx-auto"
                    >
                      ذخیره
                    </button>
                  </div>
                </div>

                {edit_id && (
                  <div className="col-md-6 d-flex flex-column align-items-center">
                    <h6 className="col-6">ویرایش نوتیفیکیشن</h6>
                    <div className="row flex-column col-6 mx-0">
                      <input
                        dir="rtl"
                        type="text"
                        className="form-control text-end col"
                        placeholder="متن"
                        value={edit_id.text}
                        onChange={(e) =>
                          setEditId((prevState) => ({
                            ...prevState,
                            text: e.target.value,
                          }))
                        }
                      />
                      <button
                        onClick={_edit}
                        className="btn btn-sm btn-primary m-1 col-sm-4 mx-auto"
                      >
                        ذخیره
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="main-cards">
              <div className="card">
                <table className="table table-stripped" dir="rtl">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>متن</th>
                      <th>حذف</th>
                      <th>ویرایش</th>
                      <th>تاریخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_notificationCats.map((el, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                            {el.text}
                        </td>
                        <td>
                          {deleting === el.id ? (
                            <>
                              <button
                                className="btn-sm btn btn-outline-info mx-1"
                                style={{ width: "70px" }}
                                onClick={() => setDelete(false)}
                              >
                                انصراف
                              </button>

                              <button
                                className="btn-sm btn btn-outline-danger mx-1"
                                style={{ width: "70px" }}
                                onClick={() => _delete(el.id)}
                              >
                                تایید
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn-sm btn btn-danger"
                              onClick={() => setDelete(el.id)}
                            >
                              حذف
                            </button>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-sm btn btn-success"
                            onClick={() => setEditId(el)}
                          >
                            ویرایش
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

export default Notification;
