import React from "react";
import moment from "moment-jalaali";

function Modal(props) {
  const { close, buyers } = props;
  return (
    <div
      style={{
        background: "#0006",
        display: "grid",
        placeItems: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        zIndex: 1000,
        left: 0,
        top: 0,
      }}
      onClick={(e) => {
        if (e.currentTarget == e.target) close();
      }}
    >
      <div className="card col-10">
        <table className="table table-stripped" dir="rtl">
          <thead>
            <tr>
              <th>#</th>
              <th>نام</th>
              <th>شماره همراه</th>
              <th className="text-center">زمان</th>
            </tr>
          </thead>
          <tbody>
            {buyers.length > 0 && buyers[0].paids.map((buyer, i) => (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{buyer.user.fname} {buyer.user.lname}</td>
                    <td>{buyer.user.phonenumber}</td>
                    <td dir="ltr" className="text-center">{moment(buyer.created_at).format('jYYYY/jMM/jDD HH:MM')}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Modal;
