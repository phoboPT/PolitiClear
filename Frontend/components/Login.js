import { Component } from 'react';
import styled from 'styled-components';
import Register from './Register';
import Signin from './Signin';
import RequestReset from './RequestReset';
import SickButton from './styles/SickButton';
const Div = styled.div`
  button {
    margin-right: 30px;
  }
`;
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
        <Div>
          <Register refetch={refetch}></Register>
          <SickButton
            type="button"
            onClick={() => {
              this.setState({ login: 1, register: 0, reset: 0 });
            }}
          >
            Login
          </SickButton>{' '}
          <SickButton
            type="button"
            onClick={() => {
              this.setState({ login: 0, register: 0, reset: 1 });
            }}
          >
            Reset
          </SickButton>
        </Div>
      );
    }
    if (login === 1) {
      return (
        <Div>
          <Signin refetch={refetch} closeSwal={closeSwal}></Signin>
          <SickButton
            type="button"
            onClick={() => {
              this.setState({ login: 0, register: 1, reset: 0 });
            }}
          >
            Register
          </SickButton>{' '}
          <SickButton
            type="button"
            onClick={() => {
              this.setState({ login: 0, register: 0, reset: 1 });
            }}
          >
            Reset
          </SickButton>
        </Div>
      );
    }
    if (reset === 1) {
      return (
        <Div>
          <RequestReset refetch={refetch}></RequestReset>
          <SickButton
            type="button"
            onClick={() => {
              this.setState({ login: 1, register: 0, reset: 0 });
            }}
          >
            Sign in
          </SickButton>{' '}
          <SickButton
            type="button"
            onClick={() => {
              this.setState({ login: 0, register: 1, reset: 0 });
            }}
          >
            Register
          </SickButton>
        </Div>
      );
    }
    return null;
  }
}

export default Login;
