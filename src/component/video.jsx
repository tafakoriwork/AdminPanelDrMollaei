import { upload } from "@testing-library/user-event/dist/upload";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { api_token } from "../redux/optionsSlice";
import Modal from "./Modal";

import SideBar from "./sidebar";

function Video() {
  const [Videos, setVideos] = useState([]);
  const [edit_id, setEditId] = useState(null);
  const [deleting, setDelete] = useState(false);
  const [Title, setTitle] = useState(null);
  const [Desc, setDesc] = useState(null);
  const [Price, setPrice] = useState(null);
  const location = useLocation();
  const [parent_id, setParentId] = useState(null);
  const [_video, setVideo] = useState(null);
  const [_video_edit, setVideoEdit] = useState(null);
  const [Type, setType] = useState(1);
  const video_ref = useRef(null);
  const video_ref_edit = useRef(null);
  const token = useSelector(api_token);
  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState(1);
  const [_image_edit, setImageEdit] = useState(null);
  const [_image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const image_ref = useRef(null);
  const image_ref_edit = useRef(null);

  function getVideos() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/video/category/${parent_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success" && data.result)
          setVideos(data.result.videos);
      });
  }

  useEffect(() => {
    setParentId(new URLSearchParams(location.search).get("parent_id"));
  }, [location.search]);

  useEffect(() => {
    getVideos();
    getPayments();
  }, [parent_id]);

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

  function _create() {
    setUploading(true);
    const form = new FormData();
    form.append("title", Title);
    form.append("desc", Desc);
    form.append("price", Price);
    form.append("parent_id", parent_id);
    form.append("mediafile", _video);
    _image && form.append("picture", _image);
    form.append("type", Type);
    form.append("payment_id", payment);
    axios
      .post(`https://drmollaii.ir/v1/public/admin/video/upload`, form, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          setUploading(false);
          toast.success("با موفقیت ایجاد شد");
          getVideos();
        }
      });
  }

  //delete lessontype with id
  function _delete(id) {
    axios
      .delete(`https://drmollaii.ir/v1/public/admin/video/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data) {
          toast.success("با موفقیت حذف شد");
          getVideos();
        }
      });
  }


 
  //delete lessontype with id
  function _edit() {
    const form = new FormData();
    _image_edit && form.append("picture", _image_edit);
    _video_edit && form.append("mediafile", _video_edit);
    form.append("edit", JSON.stringify(edit_id));

    axios
      .post(
        `https://drmollaii.ir/v1/public/admin/video/edit/${edit_id.id}`,form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          getVideos();
          toast.success("با موفقیت ویرایش شد");
          setEditId(null);
          setImageEdit(null);
          setVideoEdit(null);
        }
      });
  }


  function _setVideo(e) {
    const video = e.target.files[0];
    setVideo(video);
  }

  function _setvideoEdit(e) {
    const video = e.target.files[0];
    setVideoEdit(video);
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
    axios.get(`https://drmollaii.ir/v1/public/admin/video/buyers/${id}`,{
     
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
          {uploading && <div style={{position:'fixed', left: 0, top: 0, zIndex: 1000, backgroundColor: '#3339', width: '100vw', height: '100vh', display: 'grid', placeItems: 'center',color: '#fff'}}>
            در حال آپلود، لطفا صبر کنید
          </div>
          }
            <div className="main-header">
              <div className="row text-end">
                <div className="col-md-6 d-flex flex-column align-items-center">
                  <h6 className="col-6">ایجاد ویدیو یا صوت </h6>
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
                    <select
                      value={Type}
                      className="form-select"
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="1">ویدیو</option>
                      <option value="2">صوت</option>
                    </select>
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
                    {Type == 1 ? (
                      <div className="col-6 py-0 px-1 my-1">
                        <input
                          dir="auto"
                          type="file"
                          accept="video/*"
                          className="d-none"
                          ref={video_ref}
                          onChange={_setVideo}
                        />
                        <button
                          className="btn btn-sm btn-outline-primary w-100"
                          onClick={() => video_ref.current.click()}
                        >
                          انتخاب ویدیو
                          <i className="bi bi-filetype-mp4 mx-2"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="col-6 py-0 px-1 my-1">
                        <input
                          dir="auto"
                          type="file"
                          accept="audio/*"
                          className="d-none"
                          ref={video_ref}
                          onChange={_setVideo}
                        />
                        <button
                          className="btn btn-sm btn-outline-primary w-100"
                          onClick={() => video_ref.current.click()}
                        >
                          انتخاب صوت
                          <i className="bi bi-filetype-mp3 mx-2"></i>
                        </button>
                      </div>
                    )}
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
                         <h6 className="col-6">ویرایش ویدیو یا صوت </h6>
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

                        {edit_id.type == 'video' ? (
                      <div className="col-6 py-0 px-1 my-1">
                        <input
                          dir="auto"
                          type="file"
                          accept="video/*"
                          className="d-none"
                          ref={video_ref_edit}
                          onChange={_setvideoEdit}
                        />
                        <button
                          className="btn btn-sm btn-outline-primary w-100"
                          onClick={() => video_ref_edit.current.click()}
                        >
                          انتخاب ویدیو
                          <i className="bi bi-filetype-mp4 mx-2"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="col-6 py-0 px-1 my-1">
                        <input
                          dir="auto"
                          type="file"
                          accept="audio/*"
                          className="d-none"
                          ref={video_ref_edit}
                          onChange={_setvideoEdit}
                        />
                        <button
                          className="btn btn-sm btn-outline-primary w-100"
                          onClick={() => video_ref_edit.current.click()}
                        >
                          انتخاب صوت
                          <i className="bi bi-filetype-mp3 mx-2"></i>
                        </button>
                      </div>
                    )}
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
                      <th>فایل</th>
                      <th>تصویر</th>
                      <th>حذف</th>
                      <th>ویرایش</th>
                      <th>خریداران</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Videos.map((el, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{el.title}</td>
                        <td>{el.price} تومان</td>
                        <td>{el.desc} </td>
                        <td>درگاه{el.payment_id}</td>
                        <td>
                          <video style={{ width: "200px" }} controls>
                            <source
                              src={"https://drmollaii.ir/v1/public/" + el.url}
                            />
                          </video>
                        </td>
                        <td>
                          {el.picture && <img width={"50px"} src={"https://drmollaii.ir/v1/public/" + el.picture.url} />}
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

export default Video;
