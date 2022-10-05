import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { api_token } from "../redux/optionsSlice";
import SideBar from "./sidebar";

function Guide() {
  const [Guide, setGuide] = useState('متن راهنما ');
  const token = useSelector(api_token);
  useEffect(() => {
    getGuide();
  }, []);

  function getGuide() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/option/guide`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        setGuide(data.result.text);
      });
  }

  function saveGuide() {
    axios(`https://drmollaii.ir/v1/public/admin/option`, {
      method: "post",
      data: {
        title: 'راهنما',
        text: Guide,
        name: 'guide',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((respone) => respone.data)
      .then((data) => {
        if(data.msg == 'system_success')
      {
        toast.success("با موفقیت ویرایش شد")
        getGuide();
      }
      });
  }

  return (
    <>
      <SideBar
        Main={
          <>
            <div className="main-cards">
              <div className="card">
                <textarea value={Guide} className="form-control h-100" dir="auto" onChange={e => setGuide(e.target.value)}/>
                <button onClick={() => saveGuide()} className="btn btn-sm btn-primary me-auto my-2">
                  ذخیره
                </button>
              </div>
            </div>
          </>
        }
      />
    </>
  );
}

export default Guide;
