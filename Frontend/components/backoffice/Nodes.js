import React, { Component } from 'react';
import Me from '../Me';
import Error from '../ErrorMessage';
import { getData, deleteByKey } from '../../lib/requests';
import { permissions } from '../../lib/permissions';
import EditNode from './EditNode';
import Table from '../styles/Table';
import Inner from '../styles/InnerDiv';
import formatDate from '../../lib/formatDate';
class Nodes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      form: 0,
      formData: [],
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  fetch = async () => {
    const data = await getData('http://127.0.0.1:5000/readByType/Nodes');
    this.setState({ formData: data.data });
  };

  changeForm = () => {
    this.setState({ form: 0 });
  };

  async componentDidMount() {
    this.fetch();
  }

  render() {
    return (
      <Me>
        {(items, isLoaded) => {
          if (
            items.error !== 0 &&
            isLoaded &&
            items.permission === permissions[0]
          ) {
            if (this.state.form == 0) {
              return (
                <div>
                  <h1>Nodes</h1>
                  <Error error={this.state.error} />

                  <Table>
                    <thead>
                      <tr>
                        <th>Description </th>
                        <th>Created by:</th>
                        <th>Type:</th>
                        <th>Created At:</th>
                        <th>Updated At:</th>
                        <th>Edit </th>
                        <th>Delete </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.formData.map((item) => {
                        const createdAt = new Date(
                          item.Record.createdAt,
                        ).toISOString();
                        let updatedAt = '';
                        if (item.Record.updatedAt) {
                          updatedAt = new Date(
                            item.Record.updatedAt,
                          ).toISOString();
                        }
                        console.log(item);
                        return (
                          <tr key={item.Key}>
                            <td>{item.Record.description}</td>
                            <td>{item.Record.creatorIdDescription}</td>
                            <td>{item.Record.nodeTypeDescription}</td>
                            <td>{formatDate(createdAt)}</td>
                            <td>{formatDate(updatedAt)}</td>

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
                            <td className="center">
                              <button
                                type="button"
                                onClick={async () => {
                                  const res = confirm(
                                    'Do you really want to delete?',
                                  );
                                  if (res) {
                                    await deleteByKey(
                                      'http://127.0.0.1:5000/nodes/delete',
                                      item.Key,
                                    );
                                    this.fetch();
                                  }
                                }}
                              >
                                ❌
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              );
            }

            if (this.state.form == 2) {
              return (
                <Inner>
                  <EditNode
                    changeForm={this.changeForm}
                    edit
                    refetch={this.fetch}
                    data={this.state.data.item}
                  ></EditNode>
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
export default Nodes;
