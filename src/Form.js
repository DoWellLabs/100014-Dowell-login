import React from "react";
import Platform from "platform";
import { useState, useEffect } from "react";
import axios from "axios";

const Form = () => {
  // using useState react hooks to handle state for username,password,ip,latitutde,longnitude,islogin,and disabled
  const [username, setUsername] = useState("Testing_400415");
  const [password, setPassword] = useState("dowell123");
  const [ip, setIp] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [islogIn, setLogIn] = useState(false);

  // fetching data from the serve is a side effect so we use useeffect to fetch the ip ,longitude and latitude of the user and use their state to hold the data
  useEffect(() => {
    fetch("http://ip-api.com/json/?fields=61439")
      .then((res) => res.json())
      .then((data) => {
        setIp(data.query);
        setLatitude(data.lat);
        setLongitude(data.lon);
      });
  }, []);

  // URL to send the request to
  const url = "https://100014.pythonanywhere.com/api/loginapi/";

  // listening to the user input on the form and handling it with a state
  const inputUsernameHandler = (event) => {
    setUsername(event.target.value);
  };

  // listening to the user input on the form and handling it with a state
  const inputPasswordHandler = (event) => {
    setPassword(event.target.value);
  };

  // getting user time
  const d = new Date();
  let time = d.toLocaleTimeString();
  //getting user  timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // getting user OS
  const os = `${Platform.os.family} ${Platform.os.version}`;

  //getting  user location
  const location = `${longitude} ${latitude}`;

  //  getting user browser
  const browser = Platform.name;

  // getting user language
  let language = navigator.language;
  if (!language) {
    language = "";
  }

  // this submithandler is a function that submit the user details to the serve making a post request to the endpoint

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      return;
    }
    const userData = {
      username,
      password,
      time,
      timeZone,
      ip,
      os,
      location,
      browser,
      language,
    };

    const payloads = {
      api_services: "DoWell Login",
      api_key: "afe62ac3-b945-4ebc-98c4-71ff3c44bea8",
      ...userData,
    };
    // using axios to make a post request to the server
    try {
      setDisabled(true);
      const response = await axios.post(url, payloads);

      if (response.status !== 200) {
        throw new Error("something went wrong ");
      }
      console.log(response.data);
      setPassword("");
      setUsername("");
      setLogIn(true);
    } catch (err) {
      console.error(err);
    } finally {
      setDisabled(false);
      setLogIn(true);
    }
  };

  const backHandler = () => {
    setLogIn(false);
  };

  return (
    <div>
      {islogIn ? (
        <p>you are login , welcome to Dowell uxliving lab </p>
      ) : (
        <form onSubmit={submitHandler}>
          <h5> welcome back , please login into your account</h5>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="usernames"
            onChange={inputUsernameHandler}
            required
          />

          <input
            type="password"
            value={password}
            name="password"
            placeholder="password"
            onChange={inputPasswordHandler}
            required
          />
          <button disabled={disabled}>Log in</button>
        </form>
      )}
      {islogIn && <button onClick={backHandler}>back</button>}
    </div>
  );
};

export default Form;
