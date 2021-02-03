import React, { Component } from 'react';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import Router from 'next/router';
import Me from './Me';
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

function routeToItem() {
  Router.push({
    pathname: '/account',
  });
}

class VerifyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      error: '',
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  saveForm = async (items) => {
    const token = Cookies.get('token');

    const data = {
      email: items.email,
      message: this.state.message,
      token,

      upgradeRequest: true,
    };
    const res = await sendRequest(
      'POST',
      'http://127.0.0.1:5000/forms/create',
      data,
    );
    this.setState({ data: res.data.data, error: '' });
    this.hideTimeout = setTimeout(
      () => this.setState({ data: null, error: null }),
      3000,
    );
    if (res.data.error) {
      this.setState({ error: res.data.error || '', data: '' });
    }
  };

  render() {
    return (
      <Me>
        {(items, isLoaded, fetch) => {
          if (isLoaded) {
            return (
              <div>
                <h1>Request to upgrade your account</h1>
                <Form>
                  <fieldset>
                    <Error error={this.state.error} />
                    <SuccessMessage message={this.state.data} />

                    <label htmlFor="message">
                      Write a message to the admins explaining why you should
                      have your permissions upgraded
                      <input
                        type="text"
                        name="message"
                        placeholder="message"
                        onChange={this.saveToState}
                      />
                    </label>
                  </fieldset>
                  <ButtonDiv>
                    <SickButton
                      type="button"
                      onClick={() => {
                        this.saveForm(items);
                      }}
                    >
                      Save
                    </SickButton>

                    <SickButton
                      type="button"
                      onClick={() => {
                        routeToItem();
                      }}
                    >
                      Back
                    </SickButton>
                  </ButtonDiv>
                </Form>
              </div>
            );
          }
          return null;
        }}
      </Me>
    );
  }
}
export default VerifyAccount;
