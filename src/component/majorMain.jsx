import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { api_token, setMap } from "../redux/optionsSlice";
import SideBar from "./sidebar";

function MajorMain(props) {
  const [majors, setmajors] = useState([]);
  const [edit_id, setEditId] = useState(null);
  const newTitle = useRef(null);
  const dispatch = useDispatch();
  const [deleting, setDelete] = useState(false);
  const location = useLocation();
  const [parent_id, setParentId] = useState(null);
  const [_audio, setAudio] = useState(null);
  const [_image, setImage] = useState(null);
  const [_audio_edit, setAudioEdit] = useState(null);
  const [_image_edit, setImageEdit] = useState(null);
  const image_ref = useRef(null);
  const image_ref_edit = useRef(null);
  const token = useSelector(api_token);
  useEffect(() => {
    setParentId(new URLSearchParams(location.search).get("parent_id"));
  }, [location.search]);

  useEffect(() => {
    getmajors();
  }, [parent_id]);
  //get all majors
  function getmajors() {
    parent_id &&
      axios
        .get(`https://drmollaii.ir/v1/public/admin/major/${parent_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((respone) => respone.data)
        .then((data) => {
          if (data.msg === "system_success") setmajors(data.result);
        });
  }

  //delete major with id
  function _create() {
    const form = new FormData();
    _image && form.append("picture", _image);
    form.append("title", newTitle.current.value);
    form.append("parent_id", parent_id);
    axios
      .post(`https://drmollaii.ir/v1/public/admin/major`, form, {
        headers: {
          "content-type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          getmajors();
          toast.success("با موفقیت ایجاد شد");
          setAudio(null);
          setImage(null);
          image_ref.current.value = "";
//          audio_ref.current.value = "";
          newTitle.current.value = "";
        }
      });
  }

  //delete major with id
  function _delete(id) {
    axios
      .delete(`https://drmollaii.ir/v1/public/admin/major/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت حذف شد");
          getmajors();
        }
      });
  }


   //delete lessontype with id
   function _edit() {
    const form = new FormData();
    _image_edit && form.append("picture", _image_edit);
    form.append("title", edit_id.title);
    axios
      .post(`https://drmollaii.ir/v1/public/admin/major/${edit_id.id}`,form, {
        headers: {
          "content-type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          setImageEdit(null);
          image_ref_edit.current.value = "";
          toast.success("با موفقیت ویرایش شد");
          getmajors();
          setEditId(null);
        }
      });
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

  return (
    <>
      <SideBar
        Main={
          <>
            <div className="main-header">
              <div className="row text-end">
                <div className="col-md-6 d-flex flex-column align-items-center">
                  <h6 className="col-6">ایجاد عنوان جدید</h6>
                 
                  <div className="row col-6 mx-0">
                    <button
                      className="btn btn-sm btn-primary m-1 col-3"
                      onClick={_create}
                    >
                      ذخیره
                    </button>
                    <input
                      dir="auto"
                      type="text"
                      className="form-control col text-end"
                      placeholder="عنوان"
                      ref={newTitle}
                    />
                  </div>
                  <div className="col-6 px-1">
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
                </div>
                {edit_id && (
                  <div className="col-md-6 d-flex flex-column align-items-center">
                    <h6 className="col-6">ویرایش</h6>
                    
                    <div className="row col-6 mx-0">
                      <button
                        className="btn btn-sm btn-primary m-1 col-3"
                        onClick={_edit}
                      >
                        ذخیره
                      </button>
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
                      
                    </div>
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
                      <th>تصویر</th>
                      <th>حذف</th>
                      <th>ویرایش</th>
                    </tr>
                  </thead>
                  <tbody>
                    {majors.map((el, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <Link
                            to={`/major?parent_id=${el.id}`}
                            onClick={() => {
                              dispatch(
                                setMap({
                                  title: el.title,
                                  index: 2,
                                })
                              );
                            }}
                          >
                            {el.title}
                          </Link>
                        </td>
                            <td>
                          {el.picture && (
                            <img
                              width={"50px"}
                              alt={el.title}
                              src={"https://drmollaii.ir/v1/public/" + el.picture.url}
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

export default MajorMain;
