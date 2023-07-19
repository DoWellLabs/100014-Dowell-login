import ShowIcon from '../assets/eye-12120.svg'
import React, { useState } from 'react';
import { getMetaData } from '../utils/getmetadata';
import { ClipLoader } from "react-spinners"
import axios from 'axios';
import Cookies from 'js-cookie';
import { getUserInfoFromLogin } from '../utils/UserInfo';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selected, setSelected] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMSG] = useState('');
  const [loading, setIsloading] = useState(false);

  const handleExternalNavigation = (session_id) => {
    const homeRoute= `https://100093.pythonanywhere.com/home?session_id=${session_id}`
    window.location.href = homeRoute;
  };
  
  const setCookies =async (session_id)=>{
    Cookies.set('session_id',session_id, { expires: 1, path: '/' });
    const userinfo = await getUserInfoFromLogin(session_id)
    Cookies.set('userinfo',userinfo, { expires: 1, path: '/' });
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    setIsloading(true);
    e.preventDefault();
    const metadata = await getMetaData()
    const data = {
      "api_service_id": "DOWELL10002",
      "api_key": process.env.REACT_APP_API_KEY,
      "username": email,
      "password": password,
      ...metadata
    }

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://100014.pythonanywhere.com/api/loginapi/',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        if (response.data.msg) {
          setErrMSG("Server Error");
          console.log(response.data);
          setErr(true);
          setIsloading(false);

        } else if (response.data.session_id) {
          setCookies(response.data.session_id);
          setErr(false);
          handleExternalNavigation(response.data.session_id);
        } else {
          setErrMSG(response.data.data);
          setErr(true);
          console.log(response.data);
          setIsloading(false);

        };
      })
      .catch((error) => {
        console.log(error);
        setErrMSG("Server Error");
        setErr(true);
        setIsloading(false);
      });

  };

  return (
    <div className="container">
      <form className='login'>
        <div className="login-logo">
          <img src="https://www.login.dowellstore.org/wp-content/uploads/2022/10/artistic-logo-150x150.png" alt="DoWell Research" />
        </div>
        <div className="login-actions">
          <div className="login-actions_welcome">
            <h3>Welcome </h3>
            <p className={err ? "err-txt" : ''}>{err ? errMsg : 'Please enter your credentials'}</p>
          </div>
          {/* <div className="login-actions_options">
            <div className={`login-actions_options-select ${selected ? 'selected':''}`} onClick={()=>{
              setSelected(true)
            }}>
              <p>Sign in</p>
            </div>
            <div className={`login-actions_options-select ${!selected ? 'selected':''}`} onClick={()=>{
              setSelected(false)
            }}>

              <p>Sign up</p>
            </div>
          </div> */}
          <div onSubmit={handleSubmit} className="login-actions_input">
            <div className="email" >
              <p>Username</p>
              <input type='text' required onChange={handleEmailChange} value={email} />
            </div>
            <div className="password"  >
              <p>Password</p>
              <div className="pass-input">
                <input type={showPassword ? 'password' : 'text'} required onChange={handlePasswordChange} value={password} />
                <img src={ShowIcon} alt="show password"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="login-submit">
          {loading ? <ClipLoader color="#36d7b7" size={"1.7rem"} /> : <button type='submit' onClick={e => {
            handleSubmit(e)
          }}>{selected ? 'Login' : 'Register'}</button>}
        </div>
      </form>
    </div>
  );
};

export default Login;
