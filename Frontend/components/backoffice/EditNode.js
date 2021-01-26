import React, { Component } from 'react';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import Form from '../styles/Form';
import Error from '../ErrorMessage';
import SuccessMessage from '../styles/SuccessMessage';
import { sendRequest, getData } from '../../lib/requests';
import SickButton from '../styles/SickButton';

const ButtonDiv = styled.div`
  button {
    margin: 0 auto;
    margin: 2rem;
  }

  text-align: center;
`;
class EditNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      error: '',
      nodesTypes: [],
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  saveForm = async () => {
    this.setState({ loading: true });
    const token = Cookies.get('token');
    const data = {
      key: this.props.data.Key,
      description: this.state.description,
      nodeType: this.state.nodeType,
      token,
    };
    const res = await sendRequest(
      'PUT',
      'http://127.0.0.1:5000/nodes/update',
      data,
    );
    this.setState({ data: res.data.data, error: '', loading: false });
    this.hideTimeout = setTimeout(
      () => this.setState({ data: null, error: null }),
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

  async componentDidMount() {
    const nodesTypes = await getData(
      'http://127.0.0.1:5000/readByType/NodesTypes',
    );
    this.setState({ nodesTypes: nodesTypes.data });
  }

  render() {
    const { description } = this.props.data.Record;
    const { loading } = this.state;
    return (
      <Form>
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>Edit the Node</h2>
          <Error error={this.state.error} />
          <SuccessMessage message={this.state.data} />
          <label htmlFor="email">
            Decription
            <input
              type="description"
              name="description"
              placeholder="Description"
              defaultValue={description}
              onChange={this.saveToState}
            />
          </label>
          <label htmlFor="politician">
            Select the type of Event to add
            <select
              id="dropdownlist"
              onChange={this.saveToState}
              name="nodeType"
              defaultValue="a"
            >
              <option value="a" disabled hidden>
                Select a type
              </option>
              {this.state.nodesTypes.map((node) => (
                <option key={node.Key} value={node.Key}>
                  {node.Record.name}
                </option>
              ))}
            </select>
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

export default EditNode;
