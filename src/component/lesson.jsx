import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { api_token, setMap } from "../redux/optionsSlice";
import SideBar from "./sidebar";

function Lesson(props) {
  const [unit, setunit] = useState([]);
  const [edit_id, setEditId] = useState(null);
  const location = useLocation();
  const [parent_id, setParentId] = useState(null);
  const [_excel, setExcel] = useState(null);
  const [_audio_edit, setAudioEdit] = useState(null);
  //const [_image_edit, setImageEdit] = useState(null);
  const [deleting, setDelete] = useState(false);
  const excel_ref = useRef(null);
  const audio_ref_edit = useRef(null);
  //const image_ref_edit = useRef(null);
  const token = useSelector(api_token)
  const dispatch = useDispatch();
  useEffect(() => {
    setParentId(new URLSearchParams(location.search).get("parent_id"));
  }, [location.search]);

  useEffect(() => {
    getunit();
  }, [parent_id]);

  //get all lesson
  function getunit() {
    parent_id &&
      axios
        .get(`https://drmollaii.ir/v1/public/admin/unit/${parent_id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then((respone) => respone.data)
        .then((data) => {
          if (data.msg === "system_success") setunit(data.result);
        });
  }

  //delete lessontype with id
  function _create() {
    const form = new FormData();
    if (_excel) form.append("csv", _excel);
    else {
      alert("فایلی انتخاب نشده");
      return 0;
    }
    form.append("parent_id", parent_id);
    axios
      .post(`https://drmollaii.ir/v1/public/admin/unit`, form, {
        headers: {
          "content-type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ایجاد شد");
          excel_ref.current.value = "";
          getunit();
        }
      });
  }

  //delete lessontype with id
  function _delete(id) {
    axios
      .delete(`https://drmollaii.ir/v1/public/admin/unit/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت حذف شد");
          getunit();
        }
      });
  }

  //delete lessontype with id
  function _edit() {
    const form = new FormData();
   // _image_edit && form.append("picture", _image_edit);
    _audio_edit && form.append("audio", _audio_edit);
    form.append("title", edit_id.title);
    form.append("price", edit_id.price);
    form.append("color", String(edit_id.color));
    axios
      .post(`https://drmollaii.ir/v1/public/admin/unit/${edit_id.id}`, form, {
        headers: {
          "content-type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          getunit();
          setEditId(null);
          toast.success("با موفقیت ویرایش شد");
          setAudioEdit(null);
          //setImageEdit(null);
          //image_ref_edit.current.value = "";
          audio_ref_edit.current.value = "";
        }
      });
  }

  function _setExcel(e) {
    const excel = e.target.files[0];
    setExcel(excel);
  }

  function _setAudioEdit(e) {
    const audio = e.target.files[0];
    setAudioEdit(audio);
  }

  // function _setImageEdit(e) {
  //   const image = e.target.files[0];
  //   setImageEdit(image);
  // }

  return (
    <>
      <SideBar
        Main={
          <>
            <div className="main-header">
              <div className="row text-end">
                <div className="col-md-6 d-flex flex-column align-items-center">
                  <h6 className="col-sm-6">بارگذاری اکسل</h6>
                  <div className="row col-sm-8 mx-0">

                    <div className="row mx-0 my-1">
                      <div className="col-sm-12 px-1">
                        <input
                          dir="auto"
                          type="file"
                          className="d-none"
                          ref={excel_ref}
                          onChange={_setExcel}
                        />
                        <button
                          className="btn btn-outline-primary w-100"
                          onClick={() => excel_ref.current.click()}
                        >
                          اکسل
                          <i className="bi bi-filetype-xls mx-2"></i>
                        </button>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-primary m-1 col-sm-4 mx-auto"
                      onClick={_create}
                    >
                      ذخیره
                    </button>
                  </div>
                </div>
                {edit_id && (
                  <div className="col-md-6 d-flex flex-column align-items-center">
                    <h6 className="col-sm-6">ویرایش عنوان </h6>
                    <div className="row col-sm-8 mx-0">
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
                      <label>رنگ کارت</label>
                      <input type="color" value={edit_id.color} className="ms-auto" style={{width: 50, height: 30}} onChange={e => setEditId((prevState) => ({
                            ...prevState,
                            color: e.target.value,
                          }))}/>
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
                        {/* <div className="col-6 px-1">
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
                        </div> */}
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
                      <th>عنوان فصل</th>
                      <th>تعداد فلش کارت</th>
                      {/* <th>تصویر</th> */}
                      {/* <th>صوت</th> */}
                      <th>رنگ کارت</th>
                      <th>حذف</th>
                      <th>ویرایش</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unit.map((el, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <Link
                            to={`/unit?parent_id=${el.id}`}
                            onClick={() => {
                              dispatch(
                                setMap({
                                  title: el.title,
                                  index: 5,
                                })
                              );
                            }}
                          >
                            {el.title}
                          </Link>
                        </td>
                       
                        <td className="text-center">{el.flashcards.length}</td>
                        <td>
                          <input type="color" value={el.color} disabled/>
                        </td>
                        {/* <td>
                          {el.picture && (
                            <img
                              width={"50px"}
                              alt={el.title}
                              src={"https://drmollaii.ir/v1/public/" + el.picture.url}
                            />
                          )}
                        </td> */}
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

export default Lesson;
