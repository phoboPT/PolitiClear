import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { sendRequest, getData } from '../../lib/requests';
import Error from '../ErrorMessage';
import Form from '../styles/Form';
import SuccessMessage from '../styles/SuccessMessage';

export default class CreateNode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      data: null,
      nodesTypes: [],
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async componentDidMount() {
    const nodesTypes = await getData(
      'http://127.0.0.1:5000/readByType/NodesTypes',
    );
    this.setState({ nodesTypes: nodesTypes.data, name: this.props.name });
  }

  createNode = async () => {
    this.setState({ loading: true });
    const token = Cookies.get('token');
    const data = {
      description: this.state.name,
      token,
      nodeTypeId: this.state.nodeType,
    };
    const res = await sendRequest(
      'POST',
      'http://127.0.0.1:5000/nodes/create',
      data,
    );
    this.setState({ data: res.data.data, error: '', loading: false });
    this.hideTimeout = setTimeout(() => {
      this.setState({ data: null, error: null, loading: false });
    }, 3000);

    if (res.data.error) {
      this.setState({ error: res.data.error || '', data: '', loading: false });
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        <Form>
          <fieldset disabled={loading} aria-busy={loading}>
            <SuccessMessage message={this.state.data} />
            <Error error={this.state.error} />
            <h2>Add new Politic/Event </h2>
            <label htmlFor="name">
              Description
              <input
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={this.props.name}
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
            <button type="button" onClick={this.createNode}>
              Sav{loading ? 'ing' : 'e'}
            </button>
          </fieldset>
        </Form>
      </div>
    );
  }
}
