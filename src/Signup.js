import React, { useState } from "react";
import "./styles.css";
import "./signup.css";


function Signup({ setUser, switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
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
          <h2 className="subtitle">Sign Up</h2>
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
          <button onClick={handleSignup} className="submit-button">
            Sign Up
          </button>
        </div>
        <p className="switch-text">
          Already have an account?{" "}
          <button onClick={switchToLogin} className="switch-button">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
