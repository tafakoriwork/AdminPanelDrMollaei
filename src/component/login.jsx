import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
function Login() {
  const [phonenumber, setphonenumber] = useState(null);
  const [isCode, setIsCode] = useState(null);
  const [code, setCode] = useState(null);
  function preSignup() {
    axios
      .post("https://drmollaii.ir/v1/public/users/presignup", {
        phonenumber,
      })
      .then((response) => response.data)
      .then((result) => {
        if (result.msg === "system_success") {
          toast.success("پیام برای شما ارسال شد");
          setIsCode(true);
        }
      });
  }

  function checkOtp() {
    axios
      .post("https://drmollaii.ir/v1/public/users/checkotp", {
        phonenumber,
        code
      })
      .then((response) => response.data)
      .then((result) => {
        if (result.msg === "system_success") {
          localStorage.setItem('api_token', result.api_token);
          window.location.reload();
        }
      });
  }
  return (
    <div className="container">
      <h1>ورود </h1>
      <input
        type="text"
        disabled={isCode}
        required
        onChange={(e) => setphonenumber(e.target.value)}
      />
      <label htmlFor="text">
        <span>شماره همراه</span>
      </label>
      {isCode && (
        <>
          <input type="text" name="" id="" required onChange={(e) => setCode(e.target.value)}/>
          <label htmlFor="password">
            <span>کد دریافتی</span>
          </label>
        </>
      )}
      <button type="submit" onClick={() => !isCode ? preSignup() : checkOtp()}>
        ورود
      </button>
      <p style={{ fontSize: "12px" }}>
        برای ورود ادمین یا ثبت شماره برای تایید ادمین جدید
      </p>
    </div>
  );
}

export default Login;
