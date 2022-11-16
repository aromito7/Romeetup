// frontend/src/components/SignupFormPage/index.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './SignupForm.css'

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true)
    if(errors.length < 1){
      const newUser = {
        firstName,
        lastName,
        email,
        username,
        password
      }

    console.log("Hello World")
    return dispatch(sessionActions.signup(newUser))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
    }

  };

  useEffect(() => {
    const validationErrors = []
    if(!firstName) validationErrors.push("First Name is required")
    if(!lastName) validationErrors.push("Last Name is required")
    if(!email) validationErrors.push("Email is required")
    if(!username) validationErrors.push("Username is required")
    if(!password) validationErrors.push("Please enter a password")
    if(!confirmPassword)  validationErrors.push("Please confirm password")
    if(password && confirmPassword && (password !== confirmPassword)){
      validationErrors.push("Passwords do not match")
    }
    setErrors(validationErrors)
  },[firstName, lastName, email, username, password, confirmPassword])

  if (sessionUser) return <Redirect to="/" />;

  return (
    <form onSubmit={handleSubmit} id='signup'>
      {hasSubmitted &&
      <ul>
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      }
      <label>
        First Name
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </label>
      <label>
        Last Name
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </label>
      <label>
        Email
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label>
        Confirm Password
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" formNoValidate={true}>Sign Up</button>
    </form>
  );
}

export default SignupFormPage;
