import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { api_token, setMap } from "../redux/optionsSlice";
import SideBar from "./sidebar";
import Modal from "./Modal";

function Major(props) {
  const [lesson, setlesson] = useState([]);
  const [edit_id, setEditId] = useState(null);
  const newTitle = useRef(null);
  const newPrice = useRef(null);
  const newDesc = useRef(null);

  const [_audio, setAudio] = useState(null);
  const [_image, setImage] = useState(null);
  const [_audio_edit, setAudioEdit] = useState(null);
  const [_image_edit, setImageEdit] = useState(null);
  const image_ref = useRef(null);
  const image_ref_edit = useRef(null);
  const [deleting, setDelete] = useState(false);
  //const audio_ref = useRef(null);
  //const audio_ref_edit = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const token = useSelector(api_token);
  const [parent_id, setParentId] = useState(null);
  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState(1);
  useEffect(() => {
    setParentId(new URLSearchParams(location.search).get("parent_id"));
  }, [location.search]);

  useEffect(() => {
    getlesson();
    getPayments();
  }, [parent_id]);

  //get all lesson
  function getlesson() {
    parent_id &&
      axios
        .get(`https://drmollaii.ir/v1/public/admin/lesson/${parent_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((respone) => respone.data)
        .then((data) => {
          if (data.msg === "system_success") setlesson(data.result);
        });
  }

  //delete lessontype with id
  function _create() {
    const form = new FormData();
    _image && form.append("picture", _image);
    _audio && form.append("audio", _audio);
    form.append("title", newTitle.current.value);
    form.append("desc", newDesc.current.value);
    form.append("price", newPrice.current.value);
    form.append("parent_id", parent_id);
    form.append("payment_id", payment);
    axios
      .post(`https://drmollaii.ir/v1/public/admin/lesson`, form, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ایجاد شد");
          setAudio(null);
          setImage(null);
          image_ref.current.value = "";
          getlesson();
          newTitle.current.value = "";
        }
      });
  }

  //delete lessontype with id
  function _delete(id) {
    axios
      .delete(`https://drmollaii.ir/v1/public/admin/lesson/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت حذف شد");
          getlesson();
        }
      });
  }

  //delete lessontype with id
  function _edit() {
    const form = new FormData();
    _image_edit && form.append("picture", _image_edit);
    _audio_edit && form.append("audio", _audio_edit);
    form.append("title", edit_id.title);
    form.append("desc", edit_id.desc);
    form.append("price", edit_id.price);
    form.append("payment_id", edit_id.payment_id);
    axios
      .post(`https://drmollaii.ir/v1/public/admin/lesson/${edit_id.id}`, form, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ویرایش شد");
          setAudioEdit(null);
          setImageEdit(null);
          image_ref_edit.current.value = "";
          //audio_ref_edit.current.value = "";
          getlesson();
          setEditId(null);
        }
      });
  }

  function getPayments() {
    axios.get('https://drmollaii.ir/v1/public/admin/payments',{
      headers: {
        "content-type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
    })
    .then(response => response.data)
    .then(payments => {
      setPayments(payments);
    })
  }

  function _setAudio(e) {
    const audio = e.target.files[0];
    setAudio(audio);
  }

  function _setImage(e) {
    const image = e.target.files[0];
    console.log(image);
    setImage(image);
  }

  function _setAudioEdit(e) {
    const audio = e.target.files[0];
    setAudioEdit(audio);
  }

  function _setImageEdit(e) {
    const image = e.target.files[0];
    setImageEdit(image);
  }


  const [modaler, setModaler] = useState(false);
  const [buyers, setBuyers] = useState([]);

  function getBuyers(id) {
    axios.get(`https://drmollaii.ir/v1/public/admin/lesson/buyers/${id}`,{
     
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
                  <h6 className="col-6">ایجاد عنوان جدید</h6>
                  <div className="row col-6 mx-0">
                    <div className="col-sm-6 p-0">
                      <input
                        dir="ltr"
                        type="text"
                        className="form-control text-end"
                        placeholder="قیمت"
                        ref={newPrice}
                      />
                    </div>
                   
                    <div className="col-sm-6 p-0">
                      <input
                        dir="auto"
                        type="text"
                        className="form-control text-end"
                        placeholder="عنوان"
                        ref={newTitle}
                      />
                    </div>
                    <div className="col-sm-12 p-0">
                      <textarea
                        dir="auto"
                        type="text"
                        className="form-control text-end"
                        placeholder="شرح"
                        ref={newDesc}
                      />
                    </div>
                    <div className="col-sm-6 p-0">
                      <select onChange={e => setPayment(e.target.value)} className="form-select">
                        {
                          payments.map((payment, i) => (
                            <option key={i} value={payment.id}>
                              {payment.title}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                    <div className="col-sm-6 px-1">
                        <input
                          dir="auto"
                          type="file"
                          accept="image/*"
                          className="d-none"
                          ref={image_ref}
                          onChange={_setImage}
                        />
                        <button
                          className="btn btn-outline-primary w-100"
                          onClick={() => image_ref.current.click()}
                        >
                          تصویر
                          <i className="bi bi-filetype-jpg mx-2"></i>
                        </button>
                      </div>
                    <div className="row mx-0 my-1">
                      {/* <div className="col-6 px-1">
                        <input
                          dir="auto"
                          type="file"
                          accept="audio/*"
                          className="d-none"
                          ref={audio_ref}
                          onChange={_setAudio}
                        />
                        <button
                          className="btn btn-outline-primary w-100"
                          onClick={() => audio_ref.current.click()}
                        >
                          صوت
                          <i className="bi bi-filetype-mp3 mx-2"></i>
                        </button>
                      </div> */}
                      
                    </div>
                    <button
                      className="btn btn-sm btn-primary m-1 col-3 mx-auto"
                      onClick={_create}
                    >
                      ذخیره
                    </button>
                  </div>
                </div>
                {edit_id && (
                  <div className="col-md-6 d-flex flex-column align-items-center">
                    <h6 className="col-6">ویرایش عنوان </h6>
                    <div className="row col-6 mx-0">
                      <input
                        dir="ltr"
                        type="text"
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
                      <input
                        dir="auto"
                        type="text"
                        className="form-control col text-end"
                        placeholder="عنوان"
                        value={edit_id.title}
                        onChange={(e) =>
                          setEditId((prevState) => ({
                            ...prevState,
                            title: e.target.value,
                          }))
                        }
                      />
                      <textarea
                        dir="auto"
                        type="text"
                        className="form-control text-end"
                        placeholder="شرح"
                        value={edit_id.desc}
                        onChange={(e) =>
                          setEditId((prevState) => ({
                            ...prevState,
                            desc: e.target.value,
                          }))
                        }
                      />
                      <div className="row mx-0 my-1">
                        {/* <div className="col-6 px-1">
                          <input
                            dir="auto"
                            type="file"
                            accept="audio/*"
                            className="d-none"
                            ref={audio_ref_edit}
                            onChange={_setAudioEdit}
                          />
                          <button
                            className="btn btn-outline-primary w-100"
                            onClick={() => audio_ref_edit.current.click()}
                          >
                            صوت
                            <i className="bi bi-filetype-mp3 mx-2"></i>
                          </button>
                        </div> */}
                        <div className="col-6 px-1">
                          <input
                            dir="auto"
                            type="file"
                            accept="image/*"
                            className="d-none"
                            ref={image_ref_edit}
                            onChange={_setImageEdit}
                          />
                          <button
                            className="btn btn-outline-primary w-100"
                            onClick={() => image_ref_edit.current.click()}
                          >
                            تصویر
                            <i className="bi bi-filetype-jpg mx-2"></i>
                          </button>
                        </div>
                        <div className="col-sm-6 p-0">
                      <select value={edit_id.payment_id} onChange={(e) =>
                          setEditId((prevState) => ({
                            ...prevState,
                            payment_id: e.target.value,
                          }))
                        } className="form-select">
                        {
                          payments.map((payment, i) => (
                            <option key={i} value={payment.id}>
                              {payment.title}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                      </div>
                      <button
                        className="btn btn-sm btn-primary m-1 col-3 mx-auto"
                        onClick={_edit}
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
                      <th>عنوان درس</th>
                      <th>قیمت</th>
                      <th>تصویر</th>
                      <th>شرح</th>
                      <th>درگاه</th>
                      {/* <th>صوت</th> */}
                      <th>حذف</th>
                      <th>ویرایش</th>
                      <th>خریداران</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lesson.map((el, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <Link
                            to={`/lesson?parent_id=${el.id}`}
                            onClick={() => {
                              dispatch(
                                setMap({
                                  title: el.title,
                                  index: 4,
                                })
                              );
                            }}
                          >
                            {el.title}
                          </Link>
                        </td>
                        <td>{el.price} تومان</td>
                        <td>
                          {el.picture && (
                            <img
                              width={"50px"}
                              alt={el.title}
                              src={
                                "https://drmollaii.ir/v1/public/" + el.picture.url
                              }
                            />
                          )}
                        </td>
                        <td>
                          {el.desc}
                        </td>
                        <td>
                          درگاه
                          {el.payment_id}
                        </td>
                        {/* <td>
                          {el.audio && (
                            <audio controls style={{ height: "30px" }}>
                              <source
                                src={"https://drmollaii.ir/v1/public/" + el.audio.url}
                                type="audio/mp3"
                              />
                            </audio>
                          )}
                        </td> */}
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

export default Major;
