import React, { Component } from "react";
import { toast } from "react-toastify";

import "./Auth.css";
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
  state = {
    isLogin: true,
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $pwd: String!) {
          login(email: $email, password: $pwd) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email,
        pwd: password,
      },
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $pwd: String!) {
            createUser(userInput: {email: $email, password: $pwd}) {
              _id
              email
            }
          }
        `,
        variables: {
          email,
          pwd: password,
        },
      };
    }

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Authentication Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        if (
          resData.data.login &&
          resData.data.login.token &&
          this.state.isLogin
        ) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
          return;
        }
        toast.success("Signed up successfully!");
        this.switchModeHandler();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">
            {this.state.isLogin ? "Login" : "Signup"}
          </button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
