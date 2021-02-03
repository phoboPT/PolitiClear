import React, { Component } from 'react';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import Form from '../styles/Form';
import Error from '../ErrorMessage';
import SuccessMessage from '../styles/SuccessMessage';
import { sendRequest } from '../../lib/requests';
import SickButton from '../styles/SickButton';

const ButtonDiv = styled.div`
  button {
    margin: 0 auto;
    margin: 2rem;
  }

  text-align: center;
`;
class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      certify: false,
      error: '',
      loading: false,
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  changeStatus = (e, status) => {
    this.setState({ status: !this.state.status });
  };

  changeCertify = (e) => {
    this.setState({ certify: !this.state.certify });
  };

  saveForm = async () => {
    this.setState({ loading: true });
    const data = {
      response: this.state.response,
      key: this.props.data.Key,
      status: 'Closed',
    };
    const res = await sendRequest(
      'PUT',
      'http://127.0.0.1:5000/forms/update',
      data,
    );
    this.setState({ data: res.data.data, error: '', loading: false });
    this.hideTimeout = setTimeout(
      () => this.setState({ data: null, error: null }),
      3000,
    );

    if (res.data.error) {
      this.setState({ error: res.data.error || '', data: '' });
    }
    this.props.refetch();
  };

  updateUser = async () => {
    const token = Cookies.get('token');
    this.setState({ loading: true });
    const data = {
      key: this.props.data.Record.createdBy,
      permission: this.state.certify ? 'ACREDITED-USER' : '',
      token,
    };
    const res = await sendRequest(
      'PUT',
      'http://127.0.0.1:5000/users/update',
      data,
    );
    this.setState({ data: res.data.data, error: '', loading: false });
    this.hideTimeout = setTimeout(
      () => this.setState({ data: null, error: null, loading: false }),
      3000,
    );

    if (res.data.error) {
      this.setState({ error: res.data.error || '', data: '', loading: false });
    }
    this.props.refetch();
  };

  componentWillUnmount() {
    clearTimeout(this.hideTimeout);
  }

  componentDidMount() {
    const { email, message, status, response } = this.props.data.Record;
    this.setState({
      email,
      message,
      response,
      key: this.props.data.Key,
      status: status === 'Open',
    });
  }

  render() {
    const { email, message } = this.props.data.Record;
    const { loading, certify } = this.state;
    return (
      <Form>
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Respond to the form</h2>
          <Error error={this.state.error} />
          <SuccessMessage message={this.state.data} />
          {this.props.data.Record.upgradeRequest && (
            <>
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  disabled
                  placeholder="Email"
                  defaultValue={email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="message">
                Message
                <input
                  type="text"
                  name="message"
                  disabled
                  placeholder="message"
                  defaultValue={message}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="response">
                Response
                <input
                  type="text"
                  name="response"
                  placeholder="Response"
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="status">
                Certify user
                <input
                  type="checkbox"
                  name="certify"
                  placeholder="status"
                  defaultValue="false"
                  onChange={this.changeCertify}
                />
              </label>
            </>
          )}

          {!this.props.data.Record.upgradeRequest && (
            <>
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  disabled
                  placeholder="Email"
                  defaultValue={email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="message">
                Message
                <input
                  type="text"
                  name="message"
                  disabled
                  placeholder="message"
                  defaultValue={message}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="response">
                Response
                <input
                  type="text"
                  name="response"
                  placeholder="Response"
                  onChange={this.saveToState}
                />
              </label>
            </>
          )}
          <ButtonDiv>
            <SickButton
              type="button"
              onClick={() => {
                !certify ? this.saveForm() : this.updateUser();
              }}
            >
              Sav{loading ? 'ing' : 'e'}
            </SickButton>

            <SickButton type="button" onClick={this.props.changeForm}>
              Back
            </SickButton>
          </ButtonDiv>
        </fieldset>
      </Form>
    );
  }
}

export default EditForm;
