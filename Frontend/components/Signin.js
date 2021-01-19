import React, { Component } from 'react';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { login } from '../lib/requests';

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      email: '',
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  signin = async () => {
    const { email, password } = this.state;
    const res = await login('http://127.0.0.1:5000/login', email, password);
    if (res.data.error) {
      this.setState({ error: res.data.error });
    }

    this.props.refetch();
    if (!res.data.error) {
      this.props.closeSwal();
    }
  };

  render() {
    console.log(this.state.error);
    return (
      <Form
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          this.signin();
        }}
      >
        <fieldset>
          <h2>Sign into your account</h2>
          <Error error={this.state.error} />
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              placeholder="email"
              value={this.state.email}
              onChange={this.saveToState}
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              placeholder="password"
              value={this.state.password}
              onChange={this.saveToState}
            />
          </label>

          <button type="submit">Sign In!</button>
        </fieldset>
      </Form>
    );
  }
}

export default Signin;
