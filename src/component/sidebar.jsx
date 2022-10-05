import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  majormains,
  map,
  setMap,
  setMapBack,
  setSearch,
  search,
  api_token,
} from "../redux/optionsSlice";
import SearchPopup from "./tools/searchpopup";
function SideBar(props) {
  const { Main } = props;
  const sidenavEl = React.createRef();
  const _majormains = useSelector(majormains);
  const _map = useSelector(map);
  const location = useLocation();
  const _search = useRef(null);
  const dispatch = useDispatch();
  const history = useNavigate();
  const srch = useSelector(search);
  const [popup, setPopup] = useState(false);
  const [srchcontent, setSearchContent] = useState(null);
  const [contents, setContents] = useState([]);

  const token = useSelector(api_token);

  function toggleClassName(el, className) {
    if (el.classList.contains(className)) {
      el.classList.remove(className);
    } else {
      el.classList.add(className);
    }
  }

  function serch() {
    axios
      .get(`https://drmollaii.ir/v1/public/admin/srchcard`, {
        params: {
          text: srchcontent,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setContents(data);
        console.log(data);
        setPopup(true);
      });
  }

  useEffect(() => {
    if (srchcontent) {
      serch();
    }
  }, [srchcontent]);

  return (
    <>
      {popup && <SearchPopup getflashcard={async() => serch()} contents={contents} closer={async () => setPopup(false)} />}
      <div className="grid-container">
        <div
          className="menu-icon"
          onClick={() => toggleClassName(sidenavEl.current, "active")}
        >
          <i className="fas fa-bars header__menu">
            <i className="bi bi-list"></i>
          </i>
        </div>

        <header className="header">
          <i
            className="bi bi-arrow-left c-pointer"
            onClick={() => {
              if (_map.length > 2) {
                dispatch(setMapBack());
                history(-1);
              }
              if (location.pathname === "/ticketc") history(-1);
            }}
          ></i>
          {location.pathname === "/majormain" && (
            <div className="header__search position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="جستجو..."
                dir="rtl"
                ref={_search}
              />
              {!srch ? (
                <i
                  onClick={() => {
                    setSearchContent(null);
                    setTimeout(() => {
                      setSearchContent(_search.current.value);
                    }, 300);
                  }}
                  className="bi bi-search position-absolute text-dark c-pointer"
                  style={{ top: "10px", fontSize: "16px", left: "10px" }}
                ></i>
              ) : (
                <i
                  onClick={() => setSearchContent(null)}
                  className="bi bi-x position-absolute text-dark c-pointer"
                  style={{ top: "10px", fontSize: "16px", left: "10px" }}
                ></i>
              )}
            </div>
          )}
          <div className="header__avatar">
            <Link to={"/logout"} className="list-item">
              خروج
              <i className="bi bi-box-arrow-in-left"></i>
            </Link>
          </div>
        </header>
        <nav className="row bg-secondary"></nav>
        <aside className="sidenav" ref={sidenavEl}>
          <div
            className="sidenav__close-icon"
            onClick={() => toggleClassName(sidenavEl.current, "active")}
          >
            <i className="fas fa-times sidenav__brand-close">
              <i className="bi bi-x"></i>
            </i>
          </div>
          <ul className="sidenav__list">
            <li>
              <Link
                to={"/"}
                className="sidenav__list-item"
                onClick={() =>
                  dispatch(
                    setMap({
                      title: "کاربران",
                      index: 1,
                    })
                  )
                }
              >
                خانه
                <i className="bi bi-house"></i>
              </Link>
            </li>
            <li>
              <Link
                to={"/"}
                className="sidenav__list-item"
                onClick={() =>
                  dispatch(
                    setMap({
                      title: "کاربران",
                      index: 1,
                    })
                  )
                }
              >
                کاربران
                <i className="bi bi-people"></i>
              </Link>
            </li>
            {_majormains.map((el, i) => (
              <li key={i}>
                <Link
                  to={"/majormain?parent_id=" + el.id}
                  className="sidenav__list-item"
                  onClick={() =>
                    dispatch(
                      setMap({
                        title: el.title,
                        index: 1,
                      })
                    )
                  }
                >
                  {el.title}
                  <i className="bi bi-app"></i>
                </Link>
              </li>
            ))}

            <li>
              <Link
                to={"/testcategory"}
                className="sidenav__list-item"
                onClick={() =>
                  dispatch(
                    setMap({
                      title: "آزمون‌ها",
                      index: 1,
                    })
                  )
                }
              >
                آزمون ها
                <i className="bi bi-list"></i>
              </Link>
            </li>

            <li>
              <Link
                to={"/videocategory"}
                className="sidenav__list-item"
                onClick={() =>
                  dispatch(
                    setMap({
                      title: "صوت و تصویر",
                      index: 1,
                    })
                  )
                }
              >
                صوت و تصویر
                <i className="bi bi-camera-video"></i>
              </Link>
            </li>

            <li>
              <Link
                to={"/updating"}
                className="sidenav__list-item"
                onClick={() =>
                  dispatch(
                    setMap({
                      title: "به روزرسانی اپلیکیشن",
                      index: 1,
                    })
                  )
                }
              >
                به روز رسانی اپلیکیشن
                <i className="bi bi-android"></i>
              </Link>
            </li>

            <li>
              <Link
                to={"/pdfcategory"}
                className="sidenav__list-item"
                onClick={() =>
                  dispatch(
                    setMap({
                      title: "پی دی اف ",
                      index: 1,
                    })
                  )
                }
              >
                پی دی اف
                <i className="bi bi-file-pdf"></i>
              </Link>
            </li>

            <li>
              <Link
                to={"/notification"}
                className="sidenav__list-item"
                onClick={() =>
                  dispatch(
                    setMap({
                      title: "پیام ها",
                      index: 1,
                    })
                  )
                }
              >
                پیام ها
                <i className="bi bi-bell"></i>
              </Link>
            </li>

            <li>
              <Link
                to={"/ticketcategory"}
                className="sidenav__list-item"
                onClick={() =>
                  dispatch(
                    setMap({
                      title: "پشتیبانی ها",
                      index: 1,
                    })
                  )
                }
              >
                پشتیبانی
                <i className="bi bi-stickies"></i>
              </Link>
            </li>

            <li>
              <Link
                to={"/takhfif"}
                className="sidenav__list-item"
                onClick={() =>
                  dispatch(
                    setMap({
                      title: "کد تخفیف",
                      index: 1,
                    })
                  )
                }
              >
                کد تخفیف
                <i className="bi bi-ticket"></i>
              </Link>
            </li>

            <li>
              <Link
                to={"/aboutus"}
                className="sidenav__list-item"
                onClick={() =>
                  dispatch(
                    setMap({
                      title: "درباره ما",
                      index: 1,
                    })
                  )
                }
              >
                درباره ما
                <i className="bi bi-ticket"></i>
              </Link>
            </li>

            <li>
              <Link
                to={"/guide"}
                className="sidenav__list-item"
                onClick={() =>
                  dispatch(
                    setMap({
                      title: "راهنما ",
                      index: 1,
                    })
                  )
                }
              >
                 راهنما
                <i className="bi bi-ticket"></i>
              </Link>
            </li>

            <li>
              <Link to={"/logout"} className="sidenav__list-item">
                خروج
                <i className="bi bi-box-arrow-right"></i>
              </Link>
            </li>
          </ul>
        </aside>
        <main className="main">
          {_map.length > 1 && (
            <div
              dir="rtl"
              className="bg-light text-dark py-1"
              style={{
                display: "inline-block",
                textAlign: "center",
                width: "100%",
              }}
            >
              {_map.map((el, i) => (
                <span key={i} className="text-center">
                  {el}
                  {i + 1 !== _map.length && (
                    <i className="bi bi-chevron-left text-10"></i>
                  )}
                </span>
              ))}
            </div>
          )}
          {Main}
        </main>

        <footer className="footer">
          <div className="footer__copyright">&copy; 2022 MTA(Kaveh)</div>
          <div className="footer__signature">Dr Mollaei</div>
        </footer>
      </div>
    </>
  );
}

export default SideBar;
