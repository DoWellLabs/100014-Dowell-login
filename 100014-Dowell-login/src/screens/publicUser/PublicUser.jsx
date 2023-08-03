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

  const username = Cookies.get("username");
  const session_id = Cookies.get("session_id");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/users");

        setUsers(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPublicUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${username}`);
        setCurrentUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    username && fetchPublicUser();
  }, [username]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!username && !session_id) {
      navigate("/");
    }
  }, [username, session_id]);

  const handleLogout = () => {
    Cookies.remove("session_id");
    Cookies.remove("username");
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
                      <a href={user.link}>
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
