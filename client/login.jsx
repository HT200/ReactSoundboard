const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleLogin = (e) => {
  e.preventDefault();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;

  if (!username || !pass) {
    helper.handleError('Username or password is empty!');
    return false;
  }

  helper.sendPost(e.target.action, {username, pass});

  return false;
};

const handleLoginSwitch = (e) => {
  e.preventDefault();
  ReactDOM.render(<LoginLink />, 
    document.getElementById('link'));
  ReactDOM.render(<LoginWindow />, 
    document.getElementById('content'));
  helper.handleError('');
  return false;
};

const handleGeneric = (e, action) => {
  e.preventDefault();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;
  const pass2 = e.target.querySelector('#pass2').value;

  if (!username || !pass || !pass2){
    helper.handleError('All fields are required!');
    return false;
  }

  if (pass !== pass2) {
    helper.handleError('Passwords do not match!');
    return false;
  }

  helper.sendPost(e.target.action, {username, pass, pass2});
  action();

  return false;
};

const handleSignup = (e) => handleGeneric(e, () => {});
const handleChangePassWord = (e) => handleGeneric(e, () => handleLoginSwitch(e));

const handleSignupSwitch = (e) => {
  e.preventDefault();
  ReactDOM.render(<SignupLink />, 
    document.getElementById('link'));
  ReactDOM.render(<SignupWindow />, 
    document.getElementById('content'));
  helper.handleError('');
  return false;
};

const handleForgotPasswordSwitch = (e) => {
  e.preventDefault();
  ReactDOM.render(<ForgotPasswordLink />, 
    document.getElementById('link'));
  ReactDOM.render(<ForgotPasswordWindow />, 
    document.getElementById('content'));
  helper.handleError('');
  return false;
};

const LoginWindow = (props) => {
  return (
    <form id="loginForm" 
        name="loginForm"
        onSubmit={handleLogin}
        action="/login"
        method="POST"
        className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username"/>
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password"/>
      <input className="formSubmit" type="submit" value="Sign In"/>
    </form>
  )
};

const LoginLink = (props) => {
  const handleSignupSwitch = (e) => {
    e.preventDefault();
    ReactDOM.render(<SignupLink />, 
      document.getElementById('link'));
    ReactDOM.render(<SignupWindow />, 
      document.getElementById('content'));
    helper.handleError('');
    return false;
  };

  return (
    <div className="options">
      <a id="signupButton" onClick={handleSignupSwitch}>Sign up</a>
      <a id="signupButton" onClick={handleForgotPasswordSwitch}>Forgot your password?</a>
    </div>
  )
};

const SignupWindow = (props) => {
  return (
    <form id="signupForm"
        name="signupForm"
        onSubmit={handleSignup}
        action="/signup"
        method="POST"
        className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username"/>
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password"/>
      <label htmlFor="pass2">Type Password Again: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
      <input className="formSubmit" type="submit" value="Sign Up"/>
    </form>
  )
};

const SignupLink = (props) => {
  return (
    <div className="options">
      <a id="loginButton" onClick={handleLoginSwitch}>Login</a>
    </div>
  )
};

const ForgotPasswordWindow = (props) => {
  return (
    <form id="forgotPasswordForm" 
        name="forgotPasswordForm"
        onSubmit={handleChangePassWord}
        action="/changePassword"
        method="POST"
        className="mainForm"
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username"/>
      <label htmlFor="pass">New Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password"/>
      <label htmlFor="pass2">Type New Password Again: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
      <input className="formSubmit" type="submit" value="Change Password"/>
    </form>
  )
};

const ForgotPasswordLink = (props) => {
  return (
    <div className="options">
      <a id="signupButton" onClick={handleSignupSwitch}>Sign up</a>
      <a id="signupButton" onClick={handleLoginSwitch}>Login</a>
    </div>
  )
};

const init = () => {
  ReactDOM.render(<LoginWindow />, 
    document.getElementById('content'));

  ReactDOM.render(<LoginLink />, 
    document.getElementById('link'));
};

window.onload = init;