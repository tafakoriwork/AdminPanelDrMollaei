import axios from "axios";
import moment from "moment-jalaali";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import DatePicker from "react-multi-date-picker";
import SideBar from "./sidebar";
import farsi from "react-date-object/calendars/jalali";
import persian from "react-date-object/locales/persian_fa";
import { api_token } from "../redux/optionsSlice";
import Select from "react-select";
import { useCallback } from "react";
import { useMemo } from "react";

function Takhfif() {
  const [Takhfifha, setTakhfifha] = useState([]);
  const [deleting, setDelete] = useState(false);
  const [percent, setpercent] = useState(null);
  const [count, setcount] = useState(null);
  const [users, setusers] = useState([]);
  const [user, setuser] = useState(null);
  const [addedusers, adduser] = useState(null);
  const [GName, setGName] = useState(null);
  const [groups, setGroups] = useState([]);
  const [group_id, setGroupId] = useState(null);
  const [Type, setType] = useState(1);
  const [expire_date, setexpire_date] = useState(new Date());
  const token = useSelector(api_token);

  function randomCodeMaker(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.toUpperCase();
  }
  const randomCode = useMemo(() => randomCodeMaker(8), [Takhfifha]);

  useEffect(() => {
    getTakhfifs();
    getUsers();
    _getgroups();
  }, [!Takhfifha]);
  function getTakhfifs() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/takhfif`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data) setTakhfifha(data.result);
      });
  }

  function _create() {
    axios
      .post(
        `https://drmollaii.ir/v1/public/admin/takhfif`,
        {
          percent,
          code: randomCode,
          count,
          expire_date: expire_date.toDate(),
          user_id: user,
          group_id: group_id,
          type: Type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ایجاد شد");
          getTakhfifs();
        }
      });
  }

  function _makegroup() {
    const users = addedusers.map((user) => user.value);
    axios
      .post(
        `https://drmollaii.ir/v1/public/admin/takhfif/makegroup`,
        {
          title: GName,
          users,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ایجاد شد");
          _getgroups();
        }
      });
  }

  function _getgroups() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/takhfif/groups/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        setGroups(data);
      });
  }

  //delete lessontype with id
  function _delete(id) {
    axios
      .delete(`https://drmollaii.ir/v1/public/admin/takhfif/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت حذف شد");
          getTakhfifs();
        }
      });
  }

  function _deletegroup(id) {
    axios
      .delete(`https://drmollaii.ir/v1/public/admin/takhfif/groups/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        toast.success("با موفقیت حذف شد");
        _getgroups();
        getTakhfifs();
      });
  }

  function getUsers() {
    axios
      .get("https://drmollaii.ir/v1/public/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((users) => {
        if (users) setusers(users);
      });
  }

  const options = JSON.parse(
    JSON.stringify(users)
      .replaceAll("phonenumber", "label")
      .replaceAll("id", "value")
  );

  return (
    <>
      <SideBar
        Main={
          <>
            <div className="main-header">
              <div className="row text-end">
                <div className="col-md-6 d-flex flex-column align-items-center">
                  <h6 className="col-6">ایجاد تخفیف تک کاربره یا همه</h6>
                  <div className="row flex-column col-6 mx-0">
                    <input
                      dir="ltr"
                      style={{fontSize: '12px'}}
                      type="text"
                      className="form-control text-end col"
                      placeholder="کد"
                      value={randomCode}
                      disabled
                    />
                    <label htmlFor="expire">درصد</label>
                    <input
                      dir="ltr"
                      type="number"
                      min={0}
                      max={100}
                      className="form-control text-start col"
                      placeholder="درصد"
                      style={{fontSize: '12px'}}
                      onChange={(e) => setpercent(e.target.value)}
                    />
                    <label htmlFor="expire">تعداد استفاده</label>
                    <input
                    style={{fontSize: '12px'}}
                      dir="ltr"
                      type="number"
                      className="form-control text-start col"
                      placeholder="تعداد"
                      onChange={(e) => setcount(e.target.value)}
                    />
                    <div className="row mx-0">
                      <div className="col-12">
                        <label htmlFor="expire">تاریخ انقضا</label>
                      </div>
                      <div className="col">
                        <DatePicker
                          calendar={farsi}
                          locale={persian}
                          onChange={setexpire_date}
                        />
                      </div>
                    </div>
                   <div className="row mx-0">
                    
                    {Type == 1 ? (
                      <div className="col-sm-8">
                        <label>کاربر</label>
                        <select
                        style={{fontSize: '12px'}}
                          className="form-select"
                          onChange={(e) => setuser(e.target.value)}
                        >
                          <option>همه</option>
                          {users.map((el, i) => (
                            <option key={i} value={el.id}>
                              {el.fname} - {el.phonenumber}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="col-sm-8">
                        <label>گروه</label>
                        <select
                        style={{fontSize: '12px'}}
                          className="form-select"
                          onChange={(e) => setGroupId(e.target.value)}
                        >
                          <option>انتخاب گروه</option>
                          {groups.map((el, i) => (
                            <option key={i} value={el.id}>
                              {el.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="col-sm-4">
                    <label>نوع</label>
                   <select
                     className="form-select"
                     style={{fontSize: '12px'}}
                      value={Type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="1">کاربر محور</option>
                      <option value="2">گروه محور</option>
                    </select>
                    </div>
                   </div>

                    <button
                      onClick={_create}
                      className="btn btn-sm btn-primary m-1 col-sm-4 mx-auto"
                    >
                      ذخیره
                    </button>
                  </div>
                </div>
                <div className="col-md-6 d-flex flex-column align-items-center">
                  <h6 className="col-6">ایجاد گروه تخفیف</h6>
                  <div className="row flex-column col-6 mx-0">
                    <input
                      dir="ltr"
                      type="text"
                      className="form-control text-end col"
                      placeholder="عنوان گروه"
                      onChange={(e) => setGName(e.target.value)}
                    />
                    <label>کاربران</label>

                    <Select
                      options={options}
                      isMulti={true}
                      placeholder={"انتخاب یا جستجو"}
                      onChange={(e) => adduser(e)}
                    />

                    <button
                      onClick={_makegroup}
                      className="btn btn-sm btn-primary m-1 col-sm-4 mx-auto"
                    >
                      ذخیره
                    </button>
                    <hr />
                    <div className="row mx-0">
                      {groups.map((group, i) => (
                        <div className="col-sm-4 p-1 row mx-0" key={i}>
                          <div className="shadow bg-light p-1 col-9">
                            {group.title}
                          </div>
                          <div
                            onClick={() => _deletegroup(group.id)}
                            className="c-pointer bg-danger col-3 text-light justify-content-center align-items-center d-flex"
                          >
                            x
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="main-cards">
              <div className="card">
                <table className="table table-stripped" dir="rtl">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>کد</th>
                      <th>درصد</th>
                      <th>دفعات</th>
                      <th>تاریخ انقضا</th>
                      <th>کاربر | گروه</th>
                      <th>حذف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Takhfifha.map((el, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{el.code}</td>
                        <td>{el.percent} درصد</td>
                        <td>{el.count}</td>
                        <td>
                          {moment(el.expire_date).format("jYYYY/jMM/jDD")}
                        </td>
                        <td>{el.group_id ? el.group?.title : (el.user_id ? el.user?.phonenumber : "همه")}</td>
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

export default Takhfif;
