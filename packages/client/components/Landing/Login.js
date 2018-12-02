import { Link, Redirect } from "react-router-dom";
import { graphql, compose } from "react-apollo";
import React, { Component } from "react";
import gql from "graphql-tag";
import axios from "axios";

import Landing from "./Landing";
import { SERVER_HOST } from "../../Client";
import ActionButton from "../ActionButton/ActionButton";
import StatusReport from "../StatusReport/StatusReport";

const ACCESS_TOKEN_STORAGE = "qhacksAccessToken";
const REFRESH_TOKEN_STORAGE = "qhacksRefreshToken";

const UPDATE_AUTHENTICATION_STATUS_MUTATION = gql`
  mutation UpdateAutheticationStatus($isAuthenticated: Boolean) {
    updateAuthenticationStatus(isAuthenticated: $isAuthenticated) @client
  }
`;

const GET_AUTHENTICATION_STATUS = gql`
  query {
    isAuthenticated @client
  }
`;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      rememberMe: true
    };
  }

  getRedirectPath() {
    const locationState = this.props.location.state;

    if (locationState && locationState.from.pathname) {
      return locationState.from.pathname;
    }

    return "/";
  }

  async login() {
    const { email, password } = this.state;

    try {
      const response = await axios.post(`${SERVER_HOST}/oauth/session`, {
        email,
        password,
        grantType: "password"
      });

      localStorage.setItem(ACCESS_TOKEN_STORAGE, response.data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_STORAGE, response.data.refreshToken);

      this.props.mutate({
        variables: {
          isAuthenticated: true
        }
      });
    } catch (err) {
      this.setState({ error: "Test Error" });
    }
  }

  render() {
    const { isAuthenticated } = this.props.data;

    if (isAuthenticated) {
      return (
        <Redirect
          to={{
            pathname: this.getRedirectPath(),
            state: {
              from: this.props.location
            }
          }}
        />
      );
    }

    return (
      <Landing>
        <img
          src={"../../assets/img/qhacks-wordmark-colored.svg"}
          css={`
            max-height: 40px;
          `}
          alt="QHacks"
        />
        <p
          className="blurb"
          css={`
            margin-top: 24px;
            color: #8a929f;
          `}
        >
          Welcome back.
        </p>
        <p
          className="blurb"
          css={`
            margin-top: 12px;
            color: #8a929f;
          `}
        >
          Please login to your account.
        </p>
        <div
          css={`
            margin-top: 64px;
          `}
        >
          <input
            id="email"
            type="text"
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
            placeholder="Enter your email address"
          />
          <input
            id="password"
            type="password"
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
            placeholder="Enter your password"
          />
        </div>
        <div
          css={`
            margin: 40px 0;
            display: flex;
          `}
        >
          <div
            css={`
              flex-grow: 1;
            `}
          >
            <input
              type="checkbox"
              id="rememberMe"
              onChange={(e) => this.setState({ rememberMe: e.target.checked })}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <div
            css={`
              flex-grow: 1;
            `}
          >
            <Link className="landingLink" to="/forgot-password">
              Forgot password
            </Link>
          </div>
        </div>
        {this.state.error ? (
          <StatusReport type="danger" message={this.state.error} />
        ) : (
          ""
        )}
        <div>
          <ActionButton color="blue" onClick={() => this.login()}>
            Login
          </ActionButton>{" "}
          <ActionButton internal link="/qhacks-2019/apply">
            Apply
          </ActionButton>
        </div>
      </Landing>
    );
  }
}

export default compose(
  graphql(UPDATE_AUTHENTICATION_STATUS_MUTATION),
  graphql(GET_AUTHENTICATION_STATUS)
)(Login);
