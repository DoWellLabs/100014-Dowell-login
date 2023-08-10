import "./add.scss";
import { useEffect, useState } from "react";
import { getUserInfoFromLogin } from "../../utils/UserInfo";
import { ClipLoader } from "react-spinners";
import ShowIcon from "../../assets/eye-12120.svg";
import Cookies from "js-cookie";
import axios from "axios";

const Add = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [product, setProduct] = useState();
  const [portfolio, setPortfolio] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [orgId, setOrgId] = useState("");
  const [currentOrg, setCurrentOrg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const session_id = Cookies.get("session_id");

  const userInfo = JSON.parse(localStorage.getItem("user"));
  const token = userInfo?.token;

  const config = {
    header: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchUser = async () => {
      const loggedinUser = await getUserInfoFromLogin(session_id);

      setUser(loggedinUser.data);
    };
    session_id && fetchUser();
  }, [session_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return setErrMsg("Username and Password are required.");
    }

    const data = {
      username,
      password,
      organization: currentOrg.org_name,
      portfolio,
      product,
      isAdmin,
    };

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/users", data, config);
      setSuccessMsg(res.data);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      setErrMsg(err.response.data);
    }
  };

  const filteredArray = user?.other_org.filter((org) => org.org_id);

  const handleOrg = () => {
    setCurrentOrg(filteredArray?.find((arr) => arr.org_id === orgId));
  };

  return (
    <div className="add">
      <h3>Add members to the organization and generate a link</h3>
      {errMsg && <span className="error">{errMsg}</span>}
      {successMsg && <span className="success">{successMsg}</span>}
      <form onSubmit={handleSubmit}>
        <div className="inputContainer">
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            // required
          />
        </div>
        <div className="inputContainer">
          <label>Password</label>
          <div className="passworContainer">
            <input
              type={showPassword ? "password" : "text"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // required
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
        <div className="inputContainer">
          <label>Organization</label>
          <select
            onChange={(e) => setOrgId(e.target.value)}
            onClick={handleOrg}
          >
            <option value="">Select Organization</option>
            {filteredArray?.map((org) => (
              <option value={org.org_id} key={org.org_id}>
                {org.org_name}({org.org_name})
              </option>
            ))}
          </select>
        </div>
        <div className="inputContainer">
          <label>Portfolio</label>
          <select onChange={(e) => setPortfolio(e.target.value)} required>
            <option value="">Select Portfolio</option>
            <option value={currentOrg?.portfolio_name}>
              {currentOrg?.portfolio_name}
            </option>
          </select>
        </div>
        <div className="inputContainer">
          <label>Product</label>
          <select onChange={(e) => setProduct(e.target.value)} required>
            <option value="">Select Product</option>
            <option value={currentOrg?.product}>{currentOrg?.product}</option>
          </select>
        </div>
        <div className="adminCheck">
          <label>Is Admin</label>
          <input
            type="checkbox"
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </div>
        <button type="submit" disabled={!currentOrg}>
          {loading ? <ClipLoader /> : "Proceed"}
        </button>
      </form>
    </div>
  );
};

export default Add;
