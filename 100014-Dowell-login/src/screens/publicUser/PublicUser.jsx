import "./publicUser.scss";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import Logo from "../../assets/dowell-logo.png";

const PublicUser = ({ isAdminComponent }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

<<<<<<< HEAD
  console.log(currentUser);

=======
>>>>>>> ae2d96a8177e080236f911c890c036511d51e2b9
  const username = Cookies.get("username");
  const session_id = Cookies.get("session_id");

  const userInfo = JSON.parse(localStorage.getItem("user"));
  const token = userInfo?.token;

<<<<<<< HEAD
  // console.log(token);

  const config = {
    headers: {
      "Content-Type": "application/json",
=======
  const config = {
    headers: {
>>>>>>> ae2d96a8177e080236f911c890c036511d51e2b9
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
<<<<<<< HEAD
        const res = await axios.get(
          `http://localhost:5000/users/org/${currentUser?.uxLivingLabAdminId}`,
          // "https://testapp-beta-eight.vercel.app/users",
          config
        );
=======
        const res = await axios.get("http://localhost:5000/users", config);
>>>>>>> ae2d96a8177e080236f911c890c036511d51e2b9

        setUsers(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchUsers();
<<<<<<< HEAD
  }, [currentUser?.uxLivingLabAdminId]);
=======
  }, []);
>>>>>>> ae2d96a8177e080236f911c890c036511d51e2b9

  useEffect(() => {
    const fetchPublicUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/users/${username}`,
<<<<<<< HEAD
          // `https://testapp-beta-eight.vercel.app/users/${username}`,
=======
>>>>>>> ae2d96a8177e080236f911c890c036511d51e2b9
          config
        );
        setCurrentUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    username && fetchPublicUser();
  }, [username]);

  const navigate = useNavigate();

  useEffect(() => {
    if ((!username && !session_id) || !token) {
      navigate("/");
    }
  }, [username, session_id]);

  const handleLogout = () => {
    Cookies.remove("session_id");
    Cookies.remove("username");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="public">
      {loading ? (
        <ClipLoader />
      ) : (
        <div className="container">
          {!isAdminComponent && (
            <div className="top">
              <img src={Logo} alt="" />
              <button className="logoutBtn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
          <div className="info">
            <h1>Product Links</h1>
            <p>
              Welcome, <span className="username">{currentUser?.username}</span>
            </p>
            <p>
              Please click on the associated link to navigate to the product
              page
            </p>
          </div>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Username</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: "bold" }}>{index + 1}. </td>
                    <td style={{ fontSize: "16px", fontWeight: "bold" }}>
                      {user.username}
                    </td>
                    <td>
                      <a href={user.link.split("=")[1]}>
                        <button
                          disabled={!session_id && user?.id !== currentUser?.id}
                        >
                          {user.link}
                        </button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicUser;
