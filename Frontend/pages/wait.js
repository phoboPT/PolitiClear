import React, { Component } from 'react';
import Table from '../components/styles/Table';
import { getData } from '../lib/requests';
class Wait extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentDidMount() {
    const response = await getData('http://127.0.0.1:5000/wait');
    this.setState({ response: response.data, loading: false });
  }

  render() {
    const { response, loading } = this.state;
    return (
      <>
        <h1>Carregou Logo e vai esperar</h1>
        {loading && <h2>Loading...</h2>}
        {response && (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email </th>
                <th>Mensagem</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{response.name}</td>
                <td>{response.email}</td>
                <td>{response.mensagem}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </>
    );
  }
}

export default Wait;
