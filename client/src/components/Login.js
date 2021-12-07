import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DataContext } from "./UserContext";
import { AuthContext } from "./AuthContext";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import Kaktus from "./Kaktus";
const Login = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useContext(DataContext);
  const [token, setToken] = useContext(AuthContext);
  const [showEye, setShowEye] = useState(false);
  const [loginMessage, setLoginMessage] = useState("WELCOME IM CASA VERDE 🌱");
  const [rotation, setRotation] = useState(0);
  const [msgcolor, setMsgcolor] = useState("black");
  axios.defaults.withCredentials = true;

  const loginUser = () => {
    axios
      .post("user/login", {
        username,
        password,
      })
      .then((res) => {
        if (!res.data.token) {
          console.log(rotation);
          setRotation(110);
          
          setLoginMessage(res.data.message);
        } else {
          setToken(res.data.token);
          setData(res.data);
          localStorage.setItem("token", res.data.token);
          setLoginMessage("Du bist eingeloggt");
          history.push("/");
        }
      })
      .catch((error) => {
        setRotation(110);
        setMsgcolor("red");
        setLoginMessage(error.response.data.message);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div onSubmit={handleSubmit} className="login-container">
    <div className="login-container">
    <p class="speech-bubble" style={{ color: `${msgcolor}` }}><b>{loginMessage}</b></p>
      <div
        style={{ transform: `rotate(${rotation}deg)` }}
        className="kaktuscon"
      >
      
        <Kaktus />
      </div>
      <h5 style={{ color: "red" }}></h5>
      <input
        type="text"
        value={username}
        name="username"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Benutzername oder E-Mail Adresse eingeben"
      />
      <div className="password">
        <input
          type={showEye ? "text" : "password"}
          value={password}
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort eingeben"
        />
        <span className="iconPass" onClick={() => setShowEye(!showEye)}>
          {" "}
          {showEye ? <HiOutlineEye /> : <HiOutlineEyeOff />}
        </span>
      </div>

      <button className="button-dash" onClick={loginUser}>
        Anmelden
      </button>
      <Link to="/forgetPassword">Passwort vergessen?</Link>
      <h4>oder</h4>
      <button className="button-dash">
        <Link to="/register">Registrieren</Link>
      </button>
    </div>
    </div>
  );
};
export default Login;
