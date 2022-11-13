import { Link } from 'react-router-dom';
import React, { useState } from 'react';

export function Register({ handleSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  const handleSubmit = (e) => {
    // Prevent the browser from navigating to the form address
    e.preventDefault();
    handleSignUp({ password: password, email: email });
  };

  return (
    <form
      name="registerform"
      className="register__form register"
      onSubmit={handleSubmit}
    >
      <h1 className="register__title">Sign up</h1>
      <input
        className="register__input-text"
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
        className="register__input-text"
        name="password"
        placeholder="Password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
        required
      />

      <button type="submit" className="register__submit-button">
        Sign up
      </button>
      <Link to="/signin" className="register__text">
        Already a member? Log in here!
      </Link>
    </form>
  );
}
