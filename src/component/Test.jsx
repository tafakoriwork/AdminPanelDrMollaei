import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { api_token, setMap } from "../redux/optionsSlice";
import Modal from "./Modal";

import SideBar from "./sidebar";

function Test() {
  const location = useLocation();
  const [parent_id, setParentId] = useState(null);
  useEffect(() => {
    setParentId(new URLSearchParams(location.search).get("parent_id"));
  }, [location.search]);
  const [__Test, set__Test] = useState([]);
  const [edit_id, setEditId] = useState(null);
  const [deleting, setDelete] = useState(false);
  const [Title, setTitle] = useState(null);
  const [Time, setTime] = useState(null);
  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState(1);
  const [price, setPrice] = useState(null);
  const [_pdf, setpdf] = useState(null);
  const [_pdf_edit, setpdfEdit] = useState(null);
  const pdf_ref = useRef(null);
  const pdf_ref_edit = useRef(null);
  const dispatch = useDispatch();
  const token = useSelector(api_token);
  useEffect(() => {
    if (parent_id) getTest();
    getPayments();
  }, [parent_id]);

  function getTest() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/test`, {
        params: {
          parent_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data) set__Test(data);
      });
  }

  function getPayments() {
    axios
      .get("https://drmollaii.ir/v1/public/admin/payments", {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((payments) => {
        setPayments(payments);
      });
  }

  function _create() {
    const form = new FormData();
    form.append("name", Title);
    form.append("time", Time);
    form.append("parent_id", parent_id);
    form.append("price", price);
    form.append("payment_id", payment);
    _pdf && form.append("mediafile", _pdf);
    axios
      .post(`https://drmollaii.ir/v1/public/admin/test`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ایجاد شد");
          getTest();
        }
      });
  }

  //delete lessontype with id
  function _delete(id) {
    axios
      .delete(`https://drmollaii.ir/v1/public/admin/test/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت حذف شد");
          getTest();
        }
      });
  }

  //delete lessontype with id
  function _edit() {
    const form = new FormData();
    form.append("name", edit_id.name);
    form.append("time", edit_id.time);
    form.append("price", edit_id.price);
    form.append("payment_id", edit_id.payment_id);
    _pdf_edit && form.append("mediafile", _pdf_edit);
    axios
      .post(
        `https://drmollaii.ir/v1/public/admin/test/${edit_id.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ویرایش شد");
          getTest();
          setEditId(null);
        }
      });
  }

  function getBuyers(id) {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/test/buyers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((buyers) => {
        setBuyers(buyers);
        setModaler(true);
      });
  }

  const [modaler, setModaler] = useState(false);
  const [buyers, setBuyers] = useState([]);

  function _setpdf(e) {
    const pdf = e.target.files[0];
    setpdf(pdf);
  }

  function _setpdfEdit(e) {
    const pdf = e.target.files[0];
    setpdfEdit(pdf);
  }
  return (
    <>
      <SideBar
        Main={
          <>
            {modaler && (
              <Modal buyers={buyers} close={async () => setModaler(false)} />
            )}
            <div className="main-header">
              <div className="row text-end">
                <div className="col-md-6 d-flex flex-column align-items-center">
                  <h6 className="col-6">ایجاد آزمون</h6>
                  <div className="row flex-column col-6 mx-0">
                    <input
                      dir="ltr"
                      type="text"
                      className="form-control text-end col"
                      placeholder="عنوان"
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <label htmlFor="price" style={{ fontSize: 12 }}>
                      قیمت (تومان):
                    </label>
                    <input
                      dir="ltr"
                      type="text"
                      id="price"
                      className="form-control col text-end"
                      placeholder="قیمت"
                      onChange={(e) => setPrice(e.target.value)}
                    />

                    <label htmlFor="time" style={{ fontSize: 12 }}>
                      :زمان آزمون ( دقیقه )
                    </label>
                    <input
                      dir="rtl"
                      id="time"
                      type="number"
                      min={0}
                      className="form-control text-end col"
                      onChange={(e) => setTime(e.target.value)}
                    />
                    <div className="col-sm-12 p-0">
                      <select
                        onChange={(e) => setPayment(e.target.value)}
                        className="form-select"
                      >
                        {payments.map((payment, i) => (
                          <option key={i} value={payment.id}>
                            {payment.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 py-0 px-1 my-1">
                      <input
                        dir="auto"
                        type="file"
                        accept="application/pdf"
                        className="d-none"
                        ref={pdf_ref}
                        onChange={_setpdf}
                      />
                      <button
                        className="btn btn-sm btn-outline-primary w-100"
                        onClick={() => pdf_ref.current.click()}
                      >
                        پاسخنامه تشریحی
                        <i className="bi bi-filetype-pdf mx-2"></i>
                      </button>
                    </div>
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
                    <h6 className="col-6">ویرایش آزمون</h6>
                    <div className="row flex-column col-6 mx-0">
                      <input
                        dir="ltr"
                        type="text"
                        className="form-control text-end col"
                        placeholder="عنوان"
                        value={edit_id.name}
                        onChange={(e) =>
                          setEditId((prevState) => ({
                            ...prevState,
                            name: e.target.value,
                          }))
                        }
                      />

                      <label htmlFor="price" style={{ fontSize: 12 }}>
                        قیمت (تومان):
                      </label>
                      <input
                        dir="ltr"
                        type="text"
                        id="price"
                        className="form-control col text-end"
                        placeholder="قیمت"
                        value={edit_id.price}
                        onChange={(e) =>
                          setEditId((prevState) => ({
                            ...prevState,
                            price: e.target.value,
                          }))
                        }
                      />

                      <label htmlFor="time" style={{ fontSize: 12 }}>
                        :زمان آزمون ( دقیقه )
                      </label>
                      <input
                        dir="rtl"
                        id="time"
                        type="number"
                        min={0}
                        value={edit_id.time}
                        className="form-control text-end col"
                        onChange={(e) =>
                          setEditId((prevState) => ({
                            ...prevState,
                            time: e.target.value,
                          }))
                        }
                      />
                      <div className="col-sm-12 p-0">
                        <select
                          onChange={(e) =>
                            setEditId((prevState) => ({
                              ...prevState,
                              payment_id: e.target.value,
                            }))
                          }
                          className="form-select"
                        >
                          {payments.map((payment, i) => (
                            <option key={i} value={payment.id}>
                              {payment.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12 py-0 px-1 my-1">
                        <input
                          dir="auto"
                          type="file"
                          accept="application/pdf"
                          className="d-none"
                          ref={pdf_ref_edit}
                          onChange={_setpdfEdit}
                        />
                        <button
                          className="btn btn-sm btn-outline-primary w-100"
                          onClick={() => pdf_ref_edit.current.click()}
                        >
                          پاسخنامه تشریحی
                          <i className="bi bi-filetype-pdf mx-2"></i>
                        </button>
                      </div>
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
                      <th>عنوان</th>
                      <th>زمان ( دقیقه )</th>
                      <th>قیمت</th>
                      <th>حذف</th>
                      <th>ویرایش</th>
                      <th>خریداران</th>
                    </tr>
                  </thead>
                  <tbody>
                    {__Test.map((el, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <Link
                            to={`/testqa?parent_id=${el.id}`}
                            onClick={() => {
                              dispatch(
                                setMap({
                                  title: el.name,
                                  index: 3,
                                })
                              );
                            }}
                          >
                            {el.name}
                          </Link>
                        </td>
                        <td>{el.time}</td>
                        <td>{el.price} تومان</td>
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
                        <td>
                          <button
                            onClick={() => getBuyers(el.id)}
                            className="btn btn-sm btn-outline-primary"
                          >
                            مشاهده خریداران
                          </button>
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

export default Test;
