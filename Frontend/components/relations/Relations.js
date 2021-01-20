import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Me from '../Me';
import Error from '../ErrorMessage';
import { getData, searchNodes } from '../../lib/requests';
import { permissions } from '../../lib/permissions';
import Table from '../styles/Table';
import Inner from '../styles/InnerDiv';
import AddEvents from './AddEvents';

class Relations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      nodes: [],
      nodesTypes: [],
      form: 0,
      formData: [],
    };
  }

  async componentDidMount() {
    this.fetch();
  }

  fetch = async () => {
    const data = await this.reqData();
    data[0].data.map((item) => {
      console.log(item.Record.nodeType);

      data[1].data.map((nodeType) => {
        if (item.Record.nodeType === nodeType.Key) {
          item.Record.nodeType = nodeType.Record.name;
        }
      });
    });
    this.setState({ formData: data[0].data });
  };

  changeForm = () => {
    this.setState({ form: 0 });
  };

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  reqData = async () => {
    const token = Cookies.get('token');

    const nodes = searchNodes('http://127.0.0.1:5000/nodes/userNodes', token);
    const nodesTypes = getData('http://127.0.0.1:5000/readByType/NodesTypes');
    const res = await Promise.all([nodes, nodesTypes]);
    return Promise.resolve(res);
  };

  render() {
    return (
      <Me>
        {(items, isLoaded) => {
          if (
            items.error !== 0 &&
            isLoaded &&
            items.permission === permissions[2]
          ) {
            if (this.state.form == 0) {
              return (
                <div>
                  <h1>Relations</h1>
                  <Error error={this.state.error} />

                  <Table>
                    <thead>
                      <tr>
                        <th>Description </th>
                        <th>created by</th>
                        <th>Type</th>
                        <th>Created At:</th>
                        <th>Updated At:</th>
                        <th>Edit </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.formData.map((item) => (
                        <tr key={item.Key}>
                          <td>{item.Record.description}</td>
                          <td>{item.Record.creatorId}</td>
                          <td>{item.Record.nodeType}</td>
                          <td>{item.Record.createdAt}</td>
                          <td>{item.Record.updatedAt}</td>

                          <td className="center">
                            <button
                              type="button"
                              onClick={() => {
                                this.setState({
                                  form: 2,
                                  data: { item },
                                });
                              }}
                            >
                              ✏
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <button
                    type="button"
                    onClick={() => {
                      this.setState({ form: 2 });
                    }}
                  >
                    Add new
                  </button>
                </div>
              );
            }

            if (this.state.form == 2) {
              return (
                <Inner>
                  <AddEvents
                    changeForm={this.changeForm}
                    edit
                    refetch={this.fetch}
                    data={this.state.formData.item}
                  ></AddEvents>
                </Inner>
              );
            }
          }
          return null;
        }}
      </Me>
    );
  }
}
export default Relations;
