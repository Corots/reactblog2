import React, { useState } from "react";
import axios from "axios";

function ResetPasswordForm() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await axios.post("https://myawesomeapp.me/reset_password", {
        username: usernameOrEmail,
        email,
      });

      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setMessage("");
      setError("An error occurred while resetting your password");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="usernameOrEmail">Username or Email</label>
        <input
          type="text"
          id="usernameOrEmail"
          value={usernameOrEmail}
          onChange={(event) => setUsernameOrEmail(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <button type="submit">Reset Password</button>
      {message && <div>{message}</div>}
      {error && <div>{error}</div>}
    </form>
  );
}

export default ResetPasswordForm;