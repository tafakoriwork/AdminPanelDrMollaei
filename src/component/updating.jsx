import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { api_token } from "../redux/optionsSlice";
import SideBar from "./sidebar";

function Updating() {
  const [_apk, setapk] = useState(null);
  const [app, setApp] = useState(null);
  const [title, setTitle] = useState(null);
  const apk_ref = useRef(null);
  const token = useSelector(api_token);
  const [uploading, setUploading] = useState(false);

    useEffect(() => {
        getApp();
    }, [])

  function getApp() {
    axios
      .get(`https://drmollaii.ir/v1/public/user/app`,{
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        setApp(data);
      });
  }

  function _create() {
    setUploading(true);
    const form = new FormData();
    form.append("title", title);
    _apk && form.append("apk", _apk);
    axios
      .post(`https://drmollaii.ir/v1/public/admin/app`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        if (data.msg === "system_success") {
          toast.success("با موفقیت ایجاد شد");
          setUploading(false);
          getApp();
        }
      });
  }

  function deleteall() {
    axios(`https://drmollaii.ir/v1/public/admin/app/deleteapp`, {
      method: 'post',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        toast.success("با موفقیت حذف شد");
        getApp();
      });
  }

  function _setapk(e) {
    const apk = e.target.files[0];
    setapk(apk);
  }

  return (
    <>
      <SideBar
        Main={
          <>
          {uploading && <div style={{position:'fixed', left: 0, top: 0, zIndex: 1000, backgroundColor: '#3339', width: '100vw', height: '100vh', display: 'grid', placeItems: 'center',color: '#fff'}}>
            در حال آپلود، لطفا صبر کنید
          </div>
          }
            <div className="main-header">
              <div className="row">
                <div className="col-md-12 d-flex flex-column align-items-center">
                  <h6 className="col-6">ایجاد آزمون</h6>
                  <div className="row flex-column col-6 mx-0">
                    <input
                      dir="ltr"
                      type="text"
                      className="form-control text-end col"
                      placeholder="عنوان"
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <div className="col-12 py-0 px-1 my-1">
                      <input
                        dir="auto"
                        type="file"
                        accept="application/apk"
                        className="d-none"
                        ref={apk_ref}
                        onChange={_setapk}
                      />
                      <button
                        className="btn btn-sm btn-outline-primary w-100"
                        onClick={() => apk_ref.current.click()}
                      >
                        فایل جدید برنامه
                        <i className="bi bi-android mx-2"></i>
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
              </div>
            </div>
            <div className="main-cards">
              <div className="card">
                <table className="table table-stripped" dir="rtl">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>نسخه</th>
                      <th>فایل</th>
                      <th>حذف</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    app && <tr>
                    <td>1</td>
                    <td>{app.title}</td>
                    <td>
                      <a href={"https://drmollaii.ir/v1/public/" + app.url}>
                        دانلود فایل
                      </a>
                    </td>
                    <td><button onClick={() => deleteall()} className="btn btn-sm btn-danger">
                      حذف</button></td>
                  </tr>
                  }
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

export default Updating;
