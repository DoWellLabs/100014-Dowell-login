import "./index.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import Login from "./screens/login/Login";
import Cookies from "js-cookie";
import { getUserInfoFromLogin } from "./utils/UserInfo";
import Settings from "./screens/settings/Settings";
import PublicUser from "./screens/publicUser/PublicUser";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);
  // const [publicUser, setPublicUser] = useState(null);
  const session_id = Cookies.get("session_id");

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await getUserInfoFromLogin(session_id);

      setUser(userInfo);
    };
    session_id && fetchUser();
  }, [session_id]);

  return (
    <Router>
      <Routes>
        <Route exact path="/settings" element={<Settings />}></Route>
        <Route path="/public" element={<PublicUser />}></Route>
        <Route path="/" element={<Login />}></Route>
      </Routes>
      <Login />
    </Router>
  );
};

export default App;
