import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignedup, setIsSignedup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    emailid: "",
    password: "",
    confirmPassword: "",
  });

  const inputHandler = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const inputValidate = () => {
    if (isSignedup && !formData.username.trim()) {
      alert('Please enter a username');
      return false;
    }

    if (!formData.emailid.trim() || !formData.emailid.includes('@')) {
      alert('Invalid Emailid');
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      alert('Please enter a valid password and the password must be at least 6 characters');
      return false;
    }

    if (isSignedup && formData.password !== formData.confirmPassword) {
      alert('Password does not match');
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!inputValidate()) return;

    if (isSignedup) {
      let newinput = {
        username: formData.username,
        emailid: formData.emailid,
        password: formData.password,
      };

      axios.post("http://localhost:8000/signUp", newinput)
        .then((response) => {
          if (response.data.Status === "Success") {
            alert("Registered Successfully");
            setFormData({ username: "", emailid: "", password: "", confirmPassword: "" });
          } else {
            alert("This Email id is already registered");
            setFormData({ username: "", emailid: "", password: "", confirmPassword: "" });
          }
        })
        .catch((error) => console.log(error));
    } else {
      let input = { emailid: formData.emailid, password: formData.password };

      axios.post("http://localhost:8000/login", input)
        .then((response) => {
          if (response.data.Status === "Invalid password") {
            alert("Incorrect Password");
          } else if (response.data.Status === "Invalid Emailid") {
            alert("Invalid Email id");
          } else {
            let token = response.data.Token;
            let userId = response.data.UserId;

            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("token", token);

            navigate("/todoscreen");
          }
        });
    }
  };

  return (
    <div className="auth-container">
      <style>
        {`
          body {
            background-color: lightblue;
          }
          .auth-container {
            max-width: 400px;
            margin: 20px auto;
            padding: 20px;
            border: 2px solid black;
            border-radius: 5px;
            background-color: #fff;
          }
          .auth-heading {
            text-align: center;
            margin-bottom: 15px;
          }
          .auth-input {
            width: 80%;
            padding: 8px;
            margin-bottom: 12px;
            border: 2px solid black;
            border-radius: 4px;
          }
          .auth-btn {
            width: 50%;
            padding: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            color: white;
            background-color: green;
            border: none;
            border-radius: 4px;
          }
          .auth-toggle-btn {
            background: none;
            border: none;
            color: blue;
            cursor: pointer;
            text-decoration: underline;
          }
          .auth-text {
            text-align: center;
            margin-top: 10px;
          }
        `}
      </style>

      <h2 className="auth-heading">{isSignedup ? "Signup" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isSignedup && (
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={inputHandler}
            className="auth-input"
          />
        )}
        <input
          type="email"
          name="emailid"
          placeholder="Enter Email"
          value={formData.emailid}
          onChange={inputHandler}
          className="auth-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={inputHandler}
          className="auth-input"
        />
        {isSignedup && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={inputHandler}
            className="auth-input"
          />
        )}
        <button type="submit" className="auth-btn">
          {isSignedup ? "Signup" : "Login"}
        </button>
      </form>
      <p className="auth-text">
        {isSignedup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsSignedup(!isSignedup)}
          className="auth-toggle-btn"
        >
          {isSignedup ? "Login here" : "Signup here"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
