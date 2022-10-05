import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import SideBar from "./sidebar";
import { useSelector } from "react-redux";
import { api_token, search } from "../redux/optionsSlice";

function Unit(props) {
  const [flashcard, setflashcard] = useState([]);
  const [edit_id, setEditId] = useState(null);
  const location = useLocation();
  const token = useSelector(api_token)
  const [parent_id, setParentId] = useState(null);
  const [_audio_edit, setAudioEdit] = useState(null);
  const [_image_edit, setImageEdit] = useState(null);
  const [deleting, setDelete] = useState(false);
  const audio_ref_edit = useRef(null);
  const image_ref_edit = useRef(null);
  const [deleteList, setDeleteList] = useState([]);
  const srch = useSelector(search);
  function addToDeleteList(id) {
    const list = [...deleteList];
    if (list.includes(id)) list.splice(list.indexOf(id), 1);
    else list.push(id);

    setDeleteList([...list]);
    if (deleteList.length > 0 && deleting !== "multi") setDelete("multi");
  }

  function deleteMulti() {
    deleteList.map((id, i) => {
      _delete(id);
      if (deleteList.length === i + 1) {
        setDeleteList([]);
        setDelete(false);
      }
    });
  }

  useEffect(() => {
    setParentId(new URLSearchParams(location.search).get("parent_id"));
  }, [location.search]);

  useEffect(() => {
    getflashcard();
  }, [parent_id]);

  //get all lesson
  function getflashcard() {
    parent_id &&
      axios
        .get(`https://drmollaii.ir/v1/public/admin/flashcard/${parent_id}`,{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then((respone) => respone.data)
        .then((data) => {
          if (data.msg === "system_success") setflashcard(data.result);
        });
  }

  //delete lessontype with id
  function _delete(id) {
    axios
      .delete(`https://drmollaii.ir/v1/public/admin/flashcard/${id}`,{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت حذف شد");
          getflashcard();
        }
      });
  }

  //delete lessontype with id
  function _edit() {
    const form = new FormData();
    _image_edit && form.append("picture", _image_edit);
    _audio_edit && form.append("audio", _audio_edit);
    form.append("front", edit_id.front);
    form.append("back", edit_id.back);
    axios
      .post(`https://drmollaii.ir/v1/public/admin/flashcard/${edit_id.id}`, form, {
        headers: {
          "content-type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ویرایش شد");
          setAudioEdit(null);
          setImageEdit(null);
          image_ref_edit.current.value = "";
          audio_ref_edit.current.value = "";
          getflashcard();
          setEditId(null);
        }
      });
  }

  function orderEdit(id, state) {
    axios
      .post(`https://drmollaii.ir/v1/public/admin/flashcard/order/edit`, {
        id,
        state,
      },{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت به روز شد");
          getflashcard();
        }
      });
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
            {edit_id && (
              <div className="main-header">
                <div className="row text-end">
                  <div className="col-md-12 d-flex flex-column align-items-center">
                    <h6 className="col-sm-6">ویرایش فلش کارت </h6>
                    <div className="row mx-0">
                      <textarea
                        dir="auto"
                        type="text"
                        className="form-control col-12 mb-1 text-end"
                        onChange={(e) =>
                          setEditId((prevState) => ({
                            ...prevState,
                            front: e.target.value,
                          }))
                        }
                        value={edit_id.front}
                      />
                      <textarea
                        dir="auto"
                        type="text"
                        className="form-control col-12 mb-1 text-end"
                        onChange={(e) =>
                          setEditId((prevState) => ({
                            ...prevState,
                            back: e.target.value,
                          }))
                        }
                        value={edit_id.back}
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
                      </div>
                      <button
                        className="btn btn-sm btn-primary m-1 col-3 mx-auto"
                        onClick={_edit}
                      >
                        ذخیره
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="main-cards">
              <div className="card">
                <table className="table table-stripped" dir="rtl">
                  <thead>
                    <tr>
                      <th>
                        {deleting === "multi" ? (
                          <>
                            <button
                              className="btn-sm btn btn-outline-info mx-1"
                              style={{ width: "70px" }}
                              onClick={() => {
                                setDelete(false);
                                setDeleteList([]);
                              }}
                            >
                              انصراف
                            </button>

                            <button
                              className="btn-sm btn btn-outline-danger mx-1"
                              style={{ width: "70px" }}
                              onClick={() => deleteMulti()}
                            >
                              حذف
                            </button>
                          </>
                        ) : null}
                      </th>
                      <th>#</th>
                      <th>رو</th>
                      <th>پشت</th>
                      <th>تصویر</th>
                      {/* <th>صوت</th> */}
                      <th>حذف</th>
                      <th>ویرایش</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flashcard.map((el, i) =>
                      srch ? (
                        el.front.includes(srch) && (
                          <tr key={i}>
                            <td>
                              <input
                                type="checkbox"
                                checked={deleteList.includes(el.id)}
                                onChange={() => addToDeleteList(el.id)}
                              />
                            </td>
                            <td>{el.order}</td>
                            <td>{el.front}</td>
                            <td>{el.back}</td>
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
                              {el.audio && (
                                <audio controls style={{ height: "30px" }}>
                                  <source
                                    src={
                                      "https://drmollaii.ir/v1/public/" + el.audio.url
                                    }
                                    type="audio/mp3"
                                  />
                                </audio>
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
                              <i
                                className="bi bi-arrow-up c-pointer"
                                onClick={() => orderEdit(el.id, "minus")}
                                style={{ fontSize: "15px" }}
                              ></i>
                              <i
                                className="bi bi-arrow-down c-pointer"
                                onClick={() => orderEdit(el.id, "plus")}
                                style={{ fontSize: "15px" }}
                              ></i>
                            </td>
                          </tr>
                        )
                      ) : (
                        <tr key={i}>
                          <td>
                            <input
                              type="checkbox"
                              checked={deleteList.includes(el.id)}
                              onChange={() => addToDeleteList(el.id)}
                            />
                          </td>
                          <td>{el.order}</td>
                          <td>{el.front}</td>
                          <td>{el.back}</td>
                          <td>
                            {el.picture && (
                              <img
                                width={"50px"}
                                alt={el.title}
                                src={"https://drmollaii.ir/v1/public/" + el.picture.url}
                              />
                            )}
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
                            <i
                              className="bi bi-arrow-up c-pointer"
                              onClick={() => orderEdit(el.id, "minus")}
                              style={{ fontSize: "15px" }}
                            ></i>
                            <i
                              className="bi bi-arrow-down c-pointer"
                              onClick={() => orderEdit(el.id, "plus")}
                              style={{ fontSize: "15px" }}
                            ></i>
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

export default Unit;
