import "./users.scss";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const username = Cookies.get("username");
  const session_id = Cookies.get("session_id");

  const userInfo = JSON.parse(localStorage.getItem("user"));
  const token = userInfo?.token;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/users",
          // "https://testapp-beta-eight.vercel.app/users",
          config
        );

        console.log(res.data);

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
        const res = await axios.get(
          `http://localhost:5000/users/${username}`,
          // `https://testapp-beta-eight.vercel.app/users/${username}`,
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

  // useEffect(() => {
  //   if (!username && !session_id) {
  //     navigate("/");
  //   }
  // }, [username, session_id]);

  const deleteUser = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/users/${id}`,
        // `https://testapp-beta-eight.vercel.app/users/${id}`,
        config
      );

      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="public">
      {loading ? (
        <ClipLoader />
      ) : (
        <div className="container">
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
                    <td className="linkGroup">
                      <a href={user.link}>
                        <button
                          disabled={!session_id && user?.id !== currentUser?.id}
                        >
                          {user.link}
                        </button>
                      </a>
                      <button
                        className="delete"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
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

export default Users;
