import "./login.scss";
import ShowIcon from "../../assets/eye-12120.svg";
import React, { useEffect, useState } from "react";
import { getMetaData } from "../../utils/getmetadata";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMSG] = useState("");
  const [loading, setIsloading] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (Cookies.get("session_id")) {
  //     navigate("/settings");
  //   }
  // }, [Cookies.get("session_id")]);

  useEffect(() => {
    if (Cookies.get("username")) {
      navigate("/public");
    }
  }, [Cookies.get("username")]);

  // const setCookies = async (session_id) => {
  //   Cookies.set("session_id", session_id);
  // };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    setIsloading(true);
    e.preventDefault();

    const metadata = await getMetaData();
    const data = {
      api_service_id: "DOWELL10002",
      api_key: process.env.REACT_APP_API_KEY,
      username: email,
      password: password,
      ...metadata,
    };

    const publicData = {
      username: email,
      password: password,
    };

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/users/login",
        publicData
      );

      if (res.data.isAdmin === 1) {
        const response = await axios.post(
          "https://100014.pythonanywhere.com/api/loginapi/",
          data,
          config
        );

        if (response.data.msg) {
          setErrMSG("Server Error");
          console.log(response.data);
          setErr(true);
          setIsloading(false);
        } else if (response.data.session_id) {
          Cookies.set("session_id", response.data.session_id);
          setErr(false);

          window.location.href = "http://localhost:3000/settings";
        } else {
          setErrMSG(response.data.data);
          setErr(true);
          console.log(response.data);
          setIsloading(false);
        }
      } else {
        window.location.replace("/public");
        Cookies.set("username", res.data.username);
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
      setErrMSG(err.response.data);
      setErr(true);
      setIsloading(false);
    }
  };

  return (
    <div className="container">
      {!Cookies.get("username") && (
        <form className="login">
          <div className="login-logo">
            <img
              src="https://www.login.dowellstore.org/wp-content/uploads/2022/10/artistic-logo-150x150.png"
              alt="DoWell Research"
            />
          </div>
          <div className="login-actions">
            <div className="login-actions_welcome">
              <h3>Welcome </h3>
              <p className={err ? "err-txt" : ""}>
                {err ? errMsg : "Please enter your credentials"}
              </p>
            </div>

            <div onSubmit={handleSubmit} className="login-actions_input">
              <div className="email">
                <p>Username</p>
                <input
                  type="text"
                  required
                  onChange={handleEmailChange}
                  value={email}
                />
              </div>
              <div className="password">
                <p>Password</p>
                <div className="pass-input">
                  <input
                    type={showPassword ? "password" : "text"}
                    required
                    onChange={handlePasswordChange}
                    value={password}
                  />
                  <img
                    src={ShowIcon}
                    alt="show password"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="login-submit">
            {loading ? (
              <ClipLoader color="#36d7b7" size={"1.7rem"} />
            ) : (
              <button
                type="submit"
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                {selected ? "Login" : "Register"}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
