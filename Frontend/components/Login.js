import { Component } from "react";
import Register from "./Register";
import Signin from "./Signin";
import RequestReset from "./RequestReset";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { register: 0, login: 1, reset: 0 };
  }

  render() {
    const { register, login, reset } = this.state;
    const { refetch, closeSwal } = this.props;
    if (register === 1) {
      return (
        <div>
          <Register refetch={refetch}></Register>
          <button
            type="button"
            onClick={() => {
              this.setState({ login: 1, register: 0, reset: 0 });
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              this.setState({ login: 0, register: 0, reset: 1 });
            }}
          >
            Reset
          </button>
        </div>
      );
    }
    if (login === 1) {
      return (
        <div>
          <Signin refetch={refetch} closeSwal={closeSwal}></Signin>
          <button
            type="button"
            onClick={() => {
              this.setState({ login: 0, register: 1, reset: 0 });
            }}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              this.setState({ login: 0, register: 0, reset: 1 });
            }}
          >
            Reset
          </button>
        </div>
      );
    }
    if (reset === 1) {
      return (
        <div>
          <RequestReset refetch={refetch}></RequestReset>
          <button
            type="button"
            onClick={() => {
              this.setState({ login: 1, register: 0, reset: 0 });
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              this.setState({ login: 0, register: 1, reset: 0 });
            }}
          >
            Register
          </button>
        </div>
      );
    }
    return null;
  }
}

export default Login;
