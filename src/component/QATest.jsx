import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { api_token, setMap } from "../redux/optionsSlice";

import SideBar from "./sidebar";

function QATest() {
  const location = useLocation();
  const [parent_id, setParentId] = useState(null);
  useEffect(() => {
    setParentId(new URLSearchParams(location.search).get("parent_id"));
  }, [location.search]);
  const [__Test, set__Test] = useState([]);
  const [edit_id, setEditId] = useState(null);
  const [deleting, setDelete] = useState(false);
  const [Title, setTitle] = useState(null);
  const [_image_edit, setImageEdit] = useState(null);
  const [_image, setImage] = useState(null);
  const image_ref = useRef(null);
  const image_ref_edit = useRef(null);
  const [answers, setAnswers] = useState({
    a1: null,
    a2: null,
    a3: null,
    a4: null,
    correct: null,
  });

  const token = useSelector(api_token);
  useEffect(() => {
    if (parent_id) getTest();
  }, [parent_id]);
  function getTest() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/test/testquestion/index/2`, {
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

  function _create() {
    const form = new FormData();
    _image && form.append("picture", _image);
    form.append("question_text", Title);
    form.append("parent_id", parent_id);
    form.append("answers", JSON.stringify(answers));
    axios
      .post(`https://drmollaii.ir/v1/public/admin/test/testquestion`, form, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ایجاد شد");
          setImage(null);
          getTest();
        }
      });
  }

  //delete lessontype with id
  function _delete(id) {
    axios
      .delete(`https://drmollaii.ir/v1/public/admin/test/testquestion/${id}`, {
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
    _image_edit && form.append("picture", _image_edit);
    form.append("edit", JSON.stringify(edit_id));

    axios
      .post(
        `https://drmollaii.ir/v1/public/admin/test/testquestion/${edit_id.id}`,form,
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
          setImageEdit(null);
        }
      });
  }

  function updateAnswer(e, i) {
    const text = e.target.value;
    const newArray = [...edit_id.answers];
    newArray[i].text = text;
    setEditId((prevState) => ({ ...prevState, answers: newArray }));
  }

  function _setImageEdit(e) {
    const image = e.target.files[0];
    setImageEdit(image);
  }

  function _setImage(e) {
    const image = e.target.files[0];
    setImage(image);
  }

  return (
    <>
      <SideBar
        Main={
          <>
            <div className="main-header">
              <div className="row text-end">
                <div className="col-md-6 d-flex flex-column align-items-center">
                  <h6 className="col-6">ایجاد آزمون</h6>
                  <div className="row flex-column col-sm-12 mx-0">
                    <textarea
                      dir="ltr"
                      type="text"
                      className="form-control text-end col mb-1"
                      placeholder="سوال"
                      onChange={(e) => setTitle(e.target.value)}
                    />

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

                    <input
                      dir="ltr"
                      type="text"
                      className="form-control text-end mb-1"
                      placeholder="پاسخ ۱"
                      onChange={(e) =>
                        {
                          setAnswers((prevState) => ({
                            ...prevState,
                            a1: e.target.value,
                          }));

                          if(!answers.correct)
                          setAnswers((prevState) => ({
                            ...prevState,
                            correct: 'a1',
                          }));
                        }
                      }
                    />
                    <input
                      dir="ltr"
                      type="text"
                      className="form-control text-end mb-1"
                      placeholder="پاسخ ۲"
                      onChange={(e) =>
                        setAnswers((prevState) => ({
                          ...prevState,
                          a2: e.target.value,
                        }))
                      }
                    />
                    <input
                      dir="ltr"
                      type="text"
                      className="form-control text-end mb-1"
                      placeholder="پاسخ ۳"
                      onChange={(e) =>
                        setAnswers((prevState) => ({
                          ...prevState,
                          a3: e.target.value,
                        }))
                      }
                    />
                    <input
                      dir="ltr"
                      type="text"
                      className="form-control text-end mb-1"
                      placeholder="پاسخ ۴"
                      onChange={(e) =>
                        setAnswers((prevState) => ({
                          ...prevState,
                          a4: e.target.value,
                        }))
                      }
                    />
                    <label htmlFor="correct">صحیح</label>
                    <select
                      id="correct"
                      className="form-select"
                      value={answers.correct}
                      onChange={(e) =>
                        setAnswers((prevState) => ({
                          ...prevState,
                          correct: e.target.value,
                        }))
                      }
                    >
                      <option value="a1">{answers.a1}</option>
                      <option value="a2">{answers.a2}</option>
                      <option value="a3">{answers.a3}</option>
                      <option value="a4">{answers.a4}</option>
                    </select>
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
                    <div className="row flex-column col-sm-12 mx-0">
                      <textarea
                        dir="ltr"
                        type="text"
                        className="form-control text-end col mb-1"
                        placeholder="سوال"
                        value={edit_id.text}
                        onChange={(e) =>
                          setEditId((prevState) => ({
                            ...prevState,
                            text: e.target.value,
                          }))
                        }
                      />

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
                      <input
                        dir="ltr"
                        type="text"
                        className="form-control text-end mb-1"
                        placeholder="پاسخ ۱"
                        value={edit_id.answers[0].text}
                        onChange={(e) => updateAnswer(e, 0)}
                      />
                      <input
                        dir="ltr"
                        type="text"
                        className="form-control text-end mb-1"
                        placeholder="پاسخ ۲"
                        value={edit_id.answers[1].text}
                        onChange={(e) => updateAnswer(e, 1)}
                      />
                      <input
                        dir="ltr"
                        type="text"
                        className="form-control text-end mb-1"
                        placeholder="پاسخ ۳"
                        value={edit_id.answers[2].text}
                        onChange={(e) => updateAnswer(e, 2)}
                      />
                      <input
                        dir="ltr"
                        type="text"
                        className="form-control text-end mb-1"
                        placeholder="پاسخ ۴"
                        value={edit_id.answers[3].text}
                        onChange={(e) => updateAnswer(e, 3)}
                      />
                      <label htmlFor="correct">صحیح</label>
                      <select
                        id="correct"
                        className="form-select"
                        value={edit_id.correct_answer}
                        onChange={(e) =>
                          setEditId((prevState) => ({
                            ...prevState,
                            correct_answer: e.target.value,
                          }))
                        }
                      >
                        {edit_id.answers.map((answer, i) => (
                          <option key={i} value={answer.id}>
                            {answer.text}
                          </option>
                        ))}
                      </select>
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
                      <th>پرسش</th>
                      <th>پاسخ۱</th>
                      <th>پاسخ۲</th>
                      <th>پاسخ۳</th>
                      <th>پاسخ۴</th>
                      <th>صحیح</th>
                      <th>تصویر</th>
                      <th>حذف</th>
                      <th>ویرایش</th>
                    </tr>
                  </thead>
                  <tbody>
                    {__Test.map((el, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{el.text}</td>
                        {el.answers.map((answer, i) => (
                          <td key={i}>{answer.text}</td>
                        ))}

                        <td>{el.correct && el.correct.text}</td>
                        <td>
                          {el.picture && (
                            <img
                              width={"50px"}
                              alt={el.text}
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

export default QATest;
