import "./settings.scss";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Add from "../../components/add/Add";
import { useEffect, useState } from "react";
import PublicUser from "../publicUser/PublicUser";

const Settings = () => {
  const [isActive, setIsActive] = useState("view");
  const navigate = useNavigate();

  const session_id = Cookies.get("session_id");

  useEffect(() => {
    if (!session_id) {
      navigate("/");
    }
  }, [session_id]);

  const links = [
    {
      id: 1,
      name: "View Users",
      type: "view",
      className: "fa-solid fa-users",
    },
    {
      id: 2,
      name: "Add Users",
      type: "add",
      className: "fa-solid fa-plus",
    },
  ];

  const handlNavigate = () => {
    Cookies.remove("session_id");
    Cookies.remove("username");
    navigate("/");
  };

  const handleClick = (type) => {
    if (type === "view") {
    }
    setIsActive(type);
  };

  const displayComponent = () => {
    switch (isActive) {
      case "view":
        return <PublicUser />;

      case "add":
        return <Add />;

      default:
        return <PublicUser />;
    }
  };

  return (
    <div className="settings">
      <div className="top">
        <img
          src="https://uxlivinglab.com/wp-content/uploads/2022/12/Living-Lab-Admin-1.png"
          alt=""
        />
        <span>Settings</span>
        <button onClick={handlNavigate}>Logout</button>
      </div>
      <hr className="line" />
      <div className="navContainer">
        {links.map((link) => (
          <button
            className={isActive === link.type && "active"}
            key={link.id}
            onClick={() => handleClick(link.type)}
          >
            <i className={link.className}></i>
            <span>{link.name}</span>
          </button>
        ))}
      </div>
      {displayComponent()}
    </div>
  );
};

export default Settings;
