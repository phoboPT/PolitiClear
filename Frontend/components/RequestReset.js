import React, { Component } from 'react';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { signup } from '../lib/requests';

class RequestReset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  register = (e) => {
    e.preventDefault();
    signup(this.state);
  };

  render() {
    return (
      <Form>
        <fieldset>
          <h2>Request a password reset</h2>
          <Error />

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

          <button type="submit" onClick={this.register}>
            Request Reset!
          </button>
        </fieldset>
      </Form>
    );
  }
}

export default RequestReset;
