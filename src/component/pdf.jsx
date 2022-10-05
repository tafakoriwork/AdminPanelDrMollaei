import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { api_token } from "../redux/optionsSlice";
import Modal from "./Modal";

import SideBar from "./sidebar";

function PDF() {
  const [pdfs, setpdfs] = useState([]);
  const [deleting, setDelete] = useState(false);
  const [Title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [Price, setPrice] = useState(null);
  const [edit_id, setEditId] = useState(null);
  const location = useLocation();
  const [parent_id, setParentId] = useState(null);
  const [_pdf, setpdf] = useState(null);
  const [_pdf_edit, setpdfEdit] = useState(null);
  const [payments, setPayments] = useState([]);
  const pdf_ref = useRef(null);
  const [payment, setPayment] = useState(1);
  const token = useSelector(api_token);
  const [_image_edit, setImageEdit] = useState(null);
  const [_image, setImage] = useState(null);
  const image_ref = useRef(null);
  const image_ref_edit = useRef(null);
  function getpdfs() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/pdf/category/${parent_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success" && data.result)
          setpdfs(data.result.pdfs);
      });
  }

  useEffect(() => {
    setParentId(new URLSearchParams(location.search).get("parent_id"));
  }, [location.search]);

  useEffect(() => {
    getpdfs();
    getPayments();
  }, [parent_id]);

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
    form.append("title", Title);
    form.append("price", Price);
    form.append("desc", desc);
    form.append("parent_id", parent_id);
    form.append("payment_id", payment);
    _image && form.append("picture", _image);
    form.append("mediafile", _pdf);
    axios
      .post(`https://drmollaii.ir/v1/public/admin/pdf/upload`, form, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ایجاد شد");
          getpdfs();
        }
      });
  }

  //delete lessontype with id
  function _delete(id) {
    axios
      .delete(`https://drmollaii.ir/v1/public/admin/pdf/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data) {
          toast.success("با موفقیت حذف شد");
          getpdfs();
        }
      });
  }

  //delete lessontype with id
  function _edit() {
    const form = new FormData();
    _image_edit && form.append("picture", _image_edit);
    _pdf_edit && form.append("mediafile", _pdf_edit);
    form.append("edit", JSON.stringify(edit_id));

    axios
      .post(
        `https://drmollaii.ir/v1/public/admin/pdf/edit/${edit_id.id}`,form,
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
          getpdfs();
          setEditId(null);
          setImageEdit(null);
          setpdfEdit(null);
        }
      });
  }

  function _setpdf(e) {
    const pdf = e.target.files[0];
    setpdf(pdf);
  }

  function _setpdfEdit(e) {
    const pdf = e.target.files[0];
    setpdfEdit(pdf);
  }

  function _setImageEdit(e) {
    const image = e.target.files[0];
    setImageEdit(image);
  }

  function _setImage(e) {
    const image = e.target.files[0];
    setImage(image);
  }

  const [modaler, setModaler] = useState(false);
  const [buyers, setBuyers] = useState([]);
  
  function getBuyers(id) {
    axios.get(`https://drmollaii.ir/v1/public/admin/pdf/buyers/${id}`,{
     
        headers: {
          Authorization: `Bearer ${token}`,
        },
  
    })
    .then(res => res.data)
    .then(buyers => {
      setBuyers(buyers);
      setModaler(true);
    })
  }

  return (
    <>
      <SideBar
        Main={
          <>
          {modaler && <Modal buyers={buyers} close={async() => setModaler(false)}/>}
            <div className="main-header">
              <div className="row text-end">
                <div className="col-md-6 d-flex flex-column align-items-center">
                  <h6 className="col-6">ایجاد پی دی اف</h6>
                  <div className="row flex-column col-6 mx-0">
                    <input
                      dir="ltr"
                      type="text"
                      className="form-control text-end col"
                      placeholder="عنوان"
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                      dir="ltr"
                      type="text"
                      className="form-control text-end col"
                      placeholder="شرح"
                      onChange={(e) => setDesc(e.target.value)}
                    />

                    <input
                      dir="ltr"
                      type="text"
                      className="form-control text-end col my-1"
                      placeholder="قیمت ( تومان )"
                      onChange={(e) => setPrice(e.target.value)}
                    />

                    <div className="col-sm-12 p-0 my-1">
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

                    <div className="row mx-0">
                      <div className="col-6 py-0 px-1 my-1">
                        <input
                          dir="auto"
                          type="file"
                          accept="image/*"
                          className="d-none"
                          ref={image_ref}
                          onChange={_setImage}
                        />
                        <button
                          className="btn btn-sm btn-outline-primary w-100"
                          onClick={() => image_ref.current.click()}
                        >
                          تصویر
                          <i className="bi bi-filetype-jpg mx-2"></i>
                        </button>
                      </div>

                      <div className="col-6 py-0 px-1 my-1">
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
                          انتخاب کتاب
                          <i className="bi bi-filetype-pdf mx-2"></i>
                        </button>
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
                {edit_id && (
                  <div className="col-md-6 d-flex flex-column align-items-center">
                    <h6 className="col-6">ویرایش پی دی اف</h6>
                    <div className="row flex-column col-6 mx-0">
                      <input
                        dir="ltr"
                        type="text"
                        className="form-control text-end col"
                        placeholder="عنوان"
                        value={edit_id.title}
                        onChange={(e) => setEditId((prevState) => ({
                          ...prevState,
                          title: e.target.value,
                        }))}
                      />

                      <textarea
                        dir="ltr"
                        type="text"
                        className="form-control text-end col"
                        placeholder="شرح"
                        value={edit_id.desc}
                        onChange={(e) => setEditId((prevState) => ({
                          ...prevState,
                          desc: e.target.value,
                        }))}
                      />

                      <input
                        dir="ltr"
                        type="text"
                        className="form-control text-end col my-1"
                        placeholder="قیمت ( تومان )"
                        value={edit_id.price}
                        onChange={(e) => setEditId((prevState) => ({
                          ...prevState,
                          price: e.target.value,
                        }))}
                      />
                      <div className="col-sm-12 p-0 my-1">
                        <select
                           onChange={(e) => setEditId((prevState) => ({
                            ...prevState,
                            payment_id: e.target.value,
                          }))}
                          value={edit_id.payment_id}
                          className="form-select"
                        >
                          {payments.map((payment, i) => (
                            <option key={i} value={payment.id}>
                              {payment.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="row mx-0">
                        <div className="col-6 py-0 px-1 my-1">
                          <input
                            dir="auto"
                            type="file"
                            accept="image/*"
                            className="d-none"
                            ref={image_ref_edit}
                            onChange={_setImageEdit}
                          />
                          <button
                            className="btn btn-sm btn-outline-primary w-100"
                            onClick={() => image_ref_edit.current.click()}
                          >
                            تصویر
                            <i className="bi bi-filetype-jpg mx-2"></i>
                          </button>
                        </div>

                        <div className="col-6 py-0 px-1 my-1">
                          <input
                            dir="auto"
                            type="file"
                            accept="application/pdf"
                            className="d-none"
                            ref={pdf_ref}
                            onChange={_setpdfEdit}
                          />
                          <button
                            className="btn btn-sm btn-outline-primary w-100"
                            onClick={() => pdf_ref.current.click()}
                          >
                            انتخاب کتاب
                            <i className="bi bi-filetype-pdf mx-2"></i>
                          </button>
                        </div>
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
                      <th>قیمت</th>
                      <th>شرح</th>
                      <th>درگاه</th>
                      <th>تصویر</th>
                      {/* <th>فایل</th> */}
                      <th>حذف</th>
                      <th>ویرایش</th>
                      <th>خریداران</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pdfs.map((el, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{el.title}</td>
                        <td>{el.price} تومان</td>
                        <td>{el.desc}</td>
                        <td>درگاه{el.payment_id}</td>
                        <td>
                          {el.picture && (
                            <img
                              width={"50px"}
                              src={
                                "https://drmollaii.ir/v1/public/" + el.picture.url
                              }
                            />
                          )}
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
                        <td>
                          <button onClick={() => getBuyers(el.id)} className="btn btn-sm btn-outline-primary">
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

export default PDF;
