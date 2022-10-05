import React, { useEffect } from "react";
function Logout() {
 useEffect(() => {
  localStorage.removeItem('api_token');
  window.location.href ="/";
 })
  return (
    <></>
  );
}

export default Logout;
