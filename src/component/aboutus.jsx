import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { api_token } from "../redux/optionsSlice";
import SideBar from "./sidebar";

function AboutUs() {
  const [aboutus, setAboutus] = useState('متن درباره ما');
  const token = useSelector(api_token);
  useEffect(() => {
    getAboutus();
  }, []);

  function getAboutus() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/option/aboutus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((respone) => respone.data)
      .then((data) => {
        setAboutus(data.result.text);
      });
  }

  function saveAboutus() {
    axios(`https://drmollaii.ir/v1/public/admin/option`, {
      method: "post",
      data: {
        title: 'درباره ما',
        text: aboutus,
        name: 'aboutus',
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
        getAboutus();
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
                <textarea value={aboutus} className="form-control h-100" dir="auto" onChange={e => setAboutus(e.target.value)}/>
                <button onClick={() => saveAboutus()} className="btn btn-sm btn-primary me-auto my-2">
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

export default AboutUs;
