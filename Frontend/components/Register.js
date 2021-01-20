import React, { Component } from 'react';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { signup } from '../lib/requests';
import SuccessMessage from './styles/SuccessMessage';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  register = async (e) => {
    e.preventDefault();
    const res = await signup(this.state);

    this.setState({ data: res.data.data, error: '' });
    this.hideTimeout = setTimeout(
      () => this.setState({ data: null, error: null }),
      3000,
    );

    if (res.data.error) {
      this.setState({ error: res.data.error });
    }
    this.props.refetch();
  };

  render() {
    return (
      <Form>
        <fieldset>
          <h2>Sign Up for An Account</h2>
          <Error error={this.state.error} />
          <SuccessMessage message={this.state.data} />
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={this.saveToState}
            />
          </label>
          <label htmlFor="name">
            Name
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={this.saveToState}
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.saveToState}
            />
          </label>

          <button type="submit" onClick={this.register}>
            Sign Up!
          </button>
        </fieldset>
      </Form>
    );
  }
}

export default Register;
