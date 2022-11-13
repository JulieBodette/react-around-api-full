import { Link } from 'react-router-dom';
import React, { useState } from 'react';

export function Login({ handleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    // Prevent the browser from navigating to the form address aka...
    e.preventDefault(); //prevent the page from immeidately refreshing and closing the popup
    handleLogin({ password: password, email: email });
  };

  return (
    <form
      name="loginform"
      className="login__form login"
      onSubmit={handleSubmit}
    >
      <h1 className="login__title">Log in</h1>
      <input
        className="login__input-text"
        name="email"
        placeholder="Email"
        id="email"
        value={email}
        onChange={handleEmailChange}
        required
      />
      {/*Could add an error field here- similar to the modal errors- maybe check to make sure the test is an email (has @ sign?) */}
      <input
        type="password" //This causes the text to look like dots
        className="login__input-text"
        name="password"
        placeholder="Password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
        required
      />

      <button type="submit" className="login__submit-button">
        Log in
      </button>
      <Link className="login__text" to="/signup">
        Not a member yet? Sign up here!
      </Link>
    </form>
  );
}
