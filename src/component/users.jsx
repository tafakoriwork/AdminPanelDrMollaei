import { type } from "@testing-library/user-event/dist/type";
import axios from "axios";
import moment from "moment-jalaali";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { api_token, search } from "../redux/optionsSlice";
import SideBar from "./sidebar";
import OverviewCard from "./tools/overviewcard";

function Users() {
  const [users, setUsers] = useState([]);
  const token = useSelector(api_token);
  //get all users
  function getUsers() {
    axios
      .get("https://drmollaii.ir/v1/public/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((users) => {
        if (users.length) setUsers(users);
      });
  }

  //change admin role
  function changeAdmin(id) {
    axios({
      method: "post",
      url: "https://drmollaii.ir/v1/public/admin/users/changeadmin",
      data: {
        id: id,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.data)
      .then((result) => {
        if (result.msg === "system_success") {
          toast.success("تغییر وضعیت اعمال شد");
          getUsers();
        }
      });
  }

  //change admin lock
  function reset(id) {
    axios({
      method: "post",
      url: "https://drmollaii.ir/v1/public/admin/users/reset",
      data: {
        id: id,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.data)
      .then((result) => {
        if (result.msg === "system_success") {
          toast.success("تغییر وضعیت اعمال شد");
          getUsers();
        }
      });
  }

  useEffect(() => {
    getUsers();
  }, []);

  const [showuser, setShowUser] = useState(false);
  const [userinfo, setSetUserInfo] = useState(null);

  useEffect(() => {
    if (showuser) {
      getUserInfo();
    }
  }, [showuser]);

  function getUserInfo() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/users/info/${showuser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setSetUserInfo(data);
      });
  }

  function type(orderable_type) {
    switch (orderable_type) {
      case "App\\Models\\Test":
        return "آزمون";
        break;
      case "App\\Models\\PDF":
        return "کتاب";
        break;
      case "App\\Models\\Video":
        return "صوت و تصویر";
        break;
      case "App\\Models\\Lesson":
        return "درس";
        break;
      default:
        return "شناسایی نشد";
        break;
    }
  }

  const [srchcontent, setSearchContent] = useState(null);
  const _search = useRef(null);
  const srch = useSelector(search);
  return (
    <>
      <SideBar
        Main={
          <>
            <div className="header__search position-relative m-4">
              <input
                type="text"
                className="form-control"
                placeholder="جستجو..."
                dir="rtl"
                value={srchcontent}
                ref={_search}
              />
              {!srchcontent ? (
                <i
                  onClick={() => {
                    setSearchContent(null);
                    setTimeout(() => {
                      setSearchContent(_search.current.value);
                    }, 300);
                  }}
                  className="bi bi-search position-absolute text-dark c-pointer"
                  style={{ top: "10px", fontSize: "16px", left: "10px" }}
                ></i>
              ) : (
                <i
                  onClick={() => setSearchContent(null)}
                  className="bi bi-x position-absolute text-dark c-pointer"
                  style={{ top: "10px", fontSize: "16px", left: "10px" }}
                ></i>
              )}
            </div>
            {userinfo && (
              <div
                style={{
                  position: "fixed",
                  left: 0,
                  top: 0,
                  zIndex: 1000,
                  backgroundColor: "#3339",
                  width: "100vw",
                  height: "100vh",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  padding: "50px",
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowUser(false);
                    setSetUserInfo(null);
                  }
                }}
              >
                <div className="card text-center">
                  <div className="card-body w-100">
                    <div
                      className="row alert alert-info justify-content-center"
                      dir="rtl"
                    >
                      <div className="col-sm-4 d-flex flex-column text-center">
                        <label style={{ color: "#aaa" }}>نام</label>
                        {userinfo.fname} {userinfo.lname}
                      </div>
                      <div className="col-sm-4 d-flex flex-column text-center">
                        <label style={{ color: "#aaa" }}>شماره همراه</label>
                        {userinfo.phonenumber}
                      </div>

                      <div
                        className="col-sm-4 d-flex flex-column text-center"
                        dir="ltr"
                      >
                        <label style={{ color: "#aaa" }}>تاریخ عضویت</label>
                        {moment(userinfo.created_at).format(
                          "jYYYY/jMM/jDD HH:mm"
                        )}
                      </div>
                    </div>
                    <table className="table table-stripped" dir="rtl">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>عنوان خریداری شده</th>
                          <th>نوع</th>
                          <th>شماره پیگیری بانک</th>
                          <th>تاریخ پرداخت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userinfo.orders.map((el, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{el.orderable?.title ?? el.orderable?.name}</td>
                            <td>{type(el.orderable_type)}</td>
                            <td>{el.ref_id}</td>
                            <td dir="ltr">
                              {moment(el.created_at).format(
                                "jYYYY/jMM/jDD HH:mm"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <hr />
                    <h5 className="text-dark">نتیجه آزمون ها</h5>
                    <hr />
                    <table className="table table-stripped" dir="rtl">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>عنوان آزمون</th>
                          <th>نمره کل</th>
                          <th>رتبه کاربر</th>
                          <th>تاریخ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userinfo.tests.map((el, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{el.testname.name}</td>
                            <td>{el.rate}%</td>
                            <td>{el.position}</td>
                            <td dir="ltr">
                              {moment(el.created_at).format(
                                "jYYYY/jMM/jDD HH:mm"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            <div className="main-overview">
              <OverviewCard
                icon={<i className="bi bi-person" />}
                card={<span>کاربران</span>}
                count={users.filter((user) => user.is_admin).length}
              />
              <OverviewCard
                icon={<i className="bi bi-key" />}
                card={<span>ادمین‌ها</span>}
                count={users.filter((user) => !user.is_admin).length}
              />
            </div>

            <div className="main-cards">
              <div className="card">
                <table className="table table-stripped" dir="rtl">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>نام</th>
                      <th>موبایل</th>
                      <th>نقش</th>
                      <th>رفع مسدودی</th>
                      <th>پرداختی ها</th>
                      <th>فلش کارتها</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((el, i) =>
                      srchcontent ? (
                        (el.phonenumber?.includes(srchcontent) ||
                          el.fname?.includes(srchcontent) ||
                          el.lname?.includes(srchcontent)) && (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                              {el.fname} {el.lname}
                            </td>
                            <td>{el.phonenumber}</td>
                            <td
                              onClick={() => changeAdmin(el.id)}
                              className={"c-pointer text-center"}
                            >
                              {el.is_admin ? (
                                <span>
                                  <i className="bi bi-person-fill text-primary" />
                                  ادمین
                                </span>
                              ) : (
                                <span>
                                  <i className="bi bi-person-fill text-info" />
                                  معمولی
                                </span>
                              )}
                            </td>
                            <td
                              onClick={() => reset(el.id)}
                              className={"c-pointer text-center"}
                            >
                              {!el.is_admin ? (
                                el.limit == -1 ? (
                                  <span>
                                    <i className="bi bi-lock-fill text-primary" />
                                    رفع مسدودی
                                  </span>
                                ) : (
                                  <span>
                                    <i className="bi bi-lock-fill text-info" />
                                    مسدود نیست
                                  </span>
                                )
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setShowUser(el.id)}
                              >
                                اطلاعات بیشتر
                              </button>
                            </td>
                            <td>
                            <a
                              className="btn btn-sm btn-outline-primary"
                              href={'https://drmollaii.ir/v1/public/user/freecsv/'+el.id}
                            >
                              خروجی فلش کارتها
                            </a>
                          </td>
                          </tr>
                        )
                      ) : (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            {el.fname} {el.lname}
                          </td>
                          <td>{el.phonenumber}</td>
                          <td
                            onClick={() => changeAdmin(el.id)}
                            className={"c-pointer text-center"}
                          >
                            {el.is_admin ? (
                              <span>
                                <i className="bi bi-person-fill text-primary" />
                                ادمین
                              </span>
                            ) : (
                              <span>
                                <i className="bi bi-person-fill text-info" />
                                معمولی
                              </span>
                            )}
                          </td>
                          <td
                            onClick={() => reset(el.id)}
                            className={"c-pointer text-center"}
                          >
                            {!el.is_admin ? (
                              el.limit == -1 ? (
                                <span>
                                  <i className="bi bi-lock-fill text-primary" />
                                  رفع مسدودی
                                </span>
                              ) : (
                                <span>
                                  <i className="bi bi-lock-fill text-info" />
                                  مسدود نیست
                                </span>
                              )
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setShowUser(el.id)}
                            >
                              اطلاعات بیشتر
                            </button>
                          </td>

                          <td>
                            <a
                              className="btn btn-sm btn-outline-primary"
                              href={'https://drmollaii.ir/v1/public/user/freecsv/'+el.id}
                            >
                              خروجی فلش کارتها
                            </a>
                          </td>
                        </tr>
                      )
                    )}
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

export default Users;
