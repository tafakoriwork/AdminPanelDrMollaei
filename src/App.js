import React, { useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Users from "./component/users";
import TestCategory from "./component/TestCategory";
import { Toaster } from "react-hot-toast";
import MajorMain from "./component/majorMain";
import {
  api_token,
  majormains,
  setMajormains,
  setToken,
} from "./redux/optionsSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Major from "./component/major";
import Lesson from "./component/lesson";
import Unit from "./component/unit";
import Test from "./component/Test";
import QATest from "./component/QATest";
import VideoCategory from "./component/videoCategory";
import Video from "./component/video";
import PDFCategory from "./component/pdfCategory";
import PDF from "./component/pdf";
import Notification from "./component/notification";
import Ticket from "./component/ticket";
import TicketChat from "./component/ticketChat";
import Takhfif from "./component/takhfif";
import Login from "./component/login";
import Logout from "./component/logout";
import "./App.css";
import AboutUs from "./component/aboutus";
import Updating from "./component/updating";
import Guide from "./component/guide";
if (window.location.pathname === "/login") import("./login.css");
function App() {
  const dispatch = useDispatch();
  const _majormains = useSelector(majormains);
  const token = useSelector(api_token);
  function getMajorMains() {
    axios
      .get("https://drmollaii.ir/v1/public/admin/majormain", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data) => {
        if (data.msg === "system_success") dispatch(setMajormains(data.result));
      });
  }
  //did mount
  useEffect(() => {
    if (!_majormains.length) getMajorMains();
    const token = localStorage.getItem("api_token");
    if (token) {
      dispatch(setToken(token));
      window.location.pathname === "/login" && (window.location.href = "/");
    } else {
      window.location.pathname !== "/login" &&
        (window.location.href = "/login");
    }
  }, []);
  return (
    <>
      <Toaster position="bottom-left" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Users />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/testcategory" element={<TestCategory />} />
          <Route path="/test" element={<Test />} />
          <Route path="/testqa" element={<QATest />} />
          <Route path="/majormain" element={<MajorMain />} />
          <Route path="/major" element={<Major />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/unit" element={<Unit />} />
          <Route path="/videocategory" element={<VideoCategory />} />
          <Route path="/video" element={<Video />} />
          <Route path="/pdfcategory" element={<PDFCategory />} />
          <Route path="/pdf" element={<PDF />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/ticketcategory" element={<Ticket />} />
          <Route path="/ticket" element={<TicketChat />} />
          <Route path="/ticketc" element={<TicketChat />} />
          <Route path="/takhfif" element={<Takhfif />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/updating" element={<Updating />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
