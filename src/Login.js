import React, { useState } from "react";
import "./styles.css";

function Login({ setUser, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const user = {
      email: email || "demo@user.com",
      id: Date.now(),
    };
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  return (
    <div className="wrapper">
      <div className="container">
        <h1 className="title">📅 Calendar Dashboard</h1>
        <div className="form">
          <h2 className="subtitle">Login</h2>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
          <button onClick={handleLogin} className="submit-button">
            Login
          </button>
        </div>
        <p className="switch-text">
          Don't have an account?{" "}
          <button onClick={switchToSignup} className="switch-button">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
