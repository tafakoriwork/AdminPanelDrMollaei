import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { api_token, setMap } from "../redux/optionsSlice";

import SideBar from "./sidebar";

function VideoCategory() {
  const [VideoCats, setVideoCats] = useState([]);
  const [edit_id, setEditId] = useState(null);
  const [deleting, setDelete] = useState(false);
  const [Title, setTitle] = useState(null);
  const dispatch = useDispatch();
  const token = useSelector(api_token);
  useEffect(() => {
    getVideoCategories();
  }, [!VideoCats]);
  function getVideoCategories() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/video/category`,{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data) setVideoCats(data.result);
      });
  }

  function _create() {
    axios
      .post(`https://drmollaii.ir/v1/public/admin/video/category`, {
        title: Title,
      },{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ایجاد شد");
          getVideoCategories();
        }
      });
  }

  //delete lessontype with id
  function _delete(id) {
    axios
      .delete(`https://drmollaii.ir/v1/public/admin/video/category/${id}`,{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت حذف شد");
          getVideoCategories();
        }
      });
  }

  //delete lessontype with id
  function _edit() {
    axios
      .put(`https://drmollaii.ir/v1/public/admin/video/category/${edit_id.id}`, {
        title: edit_id.title,
      },{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ویرایش شد");
          getVideoCategories();
        }
      });
  }

  return (
    <>
      <SideBar
        Main={
          <>
            <div className="main-header">
              <div className="row text-end">
                <div className="col-md-6 d-flex flex-column align-items-center">
                  <h6 className="col-6">ایجاد دسته بندی چندرسانه ای</h6>
                  <div className="row flex-column col-6 mx-0">
                    <input
                      dir="ltr"
                      type="text"
                      className="form-control text-end col"
                      placeholder="عنوان"
                      onChange={(e) => setTitle(e.target.value)}
                    />
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
                    <h6 className="col-6">ویرایش دسته بندی چندرسانه ای</h6>
                    <div className="row flex-column col-6 mx-0">
                      <input
                        dir="ltr"
                        type="text"
                        className="form-control text-end col"
                        placeholder="عنوان"
                        value={edit_id.title}
                        onChange={(e) =>
                          setEditId((prevState) => ({
                            ...prevState,
                            title: e.target.value,
                          }))
                        }
                      />
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
                      <th>حذف</th>
                      <th>ویرایش</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VideoCats.map((el, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <Link
                            to={`/Video?parent_id=${el.id}`}
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

export default VideoCategory;
