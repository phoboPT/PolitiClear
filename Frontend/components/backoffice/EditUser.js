import React, { Component } from 'react';
import styled from 'styled-components';
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
class EditUser extends Component {
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

  saveForm = async () => {
    this.setState({ loading: true });
    const data = {
      name: this.state.name,
      permission: this.state.permission,
      key: this.props.data.Key,
    };
    const res = await sendRequest(
      'PUT',
      'http://127.0.0.1:5000/users/update',
      data,
    );
    this.setState({ data: res.data.data, error: '', loading: false });
    this.hideTimeout = setTimeout(
      () => this.setState({ data: null, error: null }),
      3000,
    );

    if (res.data.error) {
      this.setState({ error: res.data.error || '', data: '', loading: false });
    } else {
      this.setState({ name: '', permission: '' });
    }
    this.props.refetch();
  };

  componentWillUnmount() {
    clearTimeout(this.hideTimeout);
  }

  componentDidMount() {
    const { email, name, permission } = this.props.data.Record;
    this.setState({ email, name, permission });
  }

  render() {
    const { loading, email, name = '', permission = '' } = this.state;
    return (
      <Form>
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Edit the User {name}</h2>
          <Error error={this.state.error} />
          <SuccessMessage message={this.state.data} />
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              disabled
              placeholder="Email"
              defaultValue={email}
            />
          </label>
          <label htmlFor="name">
            Name
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={this.saveToState}
            />
          </label>
          <label htmlFor="permission">
            Permission
            <input
              type="text"
              name="permission"
              placeholder="Permission"
              value={permission}
              onChange={this.saveToState}
            />
          </label>
          <ButtonDiv>
            <SickButton type="button" onClick={this.saveForm}>
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

export default EditUser;
