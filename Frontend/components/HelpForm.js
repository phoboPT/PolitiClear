import React, { Component } from 'react';
import styled from 'styled-components';
import Form from './styles/Form';
import Error from './ErrorMessage';
import SuccessMessage from './styles/SuccessMessage';
import { sendRequest } from '../lib/requests';
import SickButton from './styles/SickButton';

const ButtonDiv = styled.div`
  button {
    margin: 0 auto;
    margin: 2rem;
  }

  text-align: center;
`;

export default class HelpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      error: '',
      loading: false,
      message: '',
      email: '',
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  saveForm = async () => {
    this.setState({ loading: true });
    const data = {
      email: this.state.email,
      message: this.state.message,
      upgradeRequest: false,
    };
    const res = await sendRequest(
      'POST',
      'http://127.0.0.1:5000/forms/create',
      data,
    );
    this.setState({
      data: res.data.data,
      error: '',
      loading: false,
      message: '',
      email: '',
    });
    this.hideTimeout = setTimeout(
      () => this.setState({ data: null, error: null }),
      3000,
    );
    if (res.data.error) {
      this.setState({ error: res.data.error || '', data: '', loading: false });
    }
  };

  render() {
    const { loading, message, email } = this.state;
    return (
      <div>
        <h2>Help me</h2>
        <Form>
          <fieldset disabled={loading} aria-busy={loading}>
            <Error error={this.state.error} />
            <SuccessMessage message={this.state.data} />

            <label htmlFor="message">
              Write a message with your questions, and it will be answered as
              soon as possible
              <input
                type="text"
                name="message"
                placeholder="message"
                value={message}
                onChange={this.saveToState}
              />
            </label>
            <label htmlFor="email">
              Email
              <input
                type="text"
                name="email"
                placeholder="email"
                value={email}
                onChange={this.saveToState}
              />
            </label>
            <ButtonDiv>
              <SickButton
                disabled={loading}
                type="button"
                onClick={() => {
                  this.saveForm();
                }}
              >
                Sav{loading ? 'ing' : 'e'}
              </SickButton>
            </ButtonDiv>
          </fieldset>
        </Form>
      </div>
    );
  }
}
