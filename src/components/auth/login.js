import React, { useState } from "react";
import "./auth.scss";
import useInput from "../hooks/useInput";
import useLogin from "../actions/index";
import { Link, useHistory } from "react-router-dom";

export default function Login() {
  const email = useInput("");
  const password = useInput("");
  const history = useHistory();
  const loginUser = useLogin();

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    const payload = {
      email: email.value,
      password: password.value,
    };

    const clearForm = () => {
      email.setValue("");
      password.setValue("");
    };

    loginUser(payload, clearForm);
  };

  return (
    <div className="auth-main">
      <div className="auth-container">
        <div className="auth-header">
          <span className="header-title">Log in to CompanyBoard</span>
        </div>
        <form onSubmit={(e) => handleSubmitLogin(e)}>
          <input
            placeholder="Email..."
            type="text"
            value={email.value}
            onChange={email.onChange}
          />

          <input
            placeholder="Password..."
            type="password"
            value={password.value}
            onChange={password.onChange}
          />
          <button onClick={(e) => handleSubmitLogin(e)}>Log in</button>
        </form>
        <span
          className="header-create"
          onClick={() => {
            history.push("/signup");
          }}
          style={{ marginTop: "15px" }}
        >
          Sign up for an account
        </span>
      </div>
    </div>
  );
}
