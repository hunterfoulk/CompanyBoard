import React from "react";
import useInput from "../hooks/useInput";
import { Link, useHistory } from "react-router-dom";
import { signupUser } from "../actions/actions";

export default function Signup() {
  const email = useInput("");
  const username = useInput("");
  const password = useInput("");
  const history = useHistory();

  const handleSubmitSignup = async (e) => {
    e.preventDefault();

    const payload = {
      email: email.value,
      username: username.value,
      password: password.value,
    };

    const clearForm = () => {
      username.setValue("");
      password.setValue("");
      email.setValue("");
    };

    signupUser(payload, clearForm);
  };

  return (
    <div className="auth-main">
      <div className="auth-container">
        <div className="auth-header">
          <span className="header-title">Create Account</span>
        </div>
        <form onSubmit={(e) => handleSubmitSignup(e)}>
          <input
            placeholder="Email..."
            type="text"
            value={email.value}
            onChange={email.onChange}
          />

          <input
            placeholder="Name..."
            type="text"
            value={username.value}
            onChange={username.onChange}
          />

          <input
            placeholder="Password..."
            type="password"
            value={password.value}
            onChange={password.onChange}
          />
          <button onClick={(e) => handleSubmitSignup(e)}>Sign up</button>
        </form>
        <span
          onClick={() => {
            history.push("/");
          }}
          style={{ marginTop: "15px" }}
          className="header-create"
        >
          Already Signed Up?, Log in here.
        </span>
      </div>
    </div>
  );
}
