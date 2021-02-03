import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Me from '../Me';
import Error from '../ErrorMessage';
import { getData, sendRequest } from '../../lib/requests';
import { permissions } from '../../lib/permissions';
import Table from '../styles/Table';
import Inner from '../styles/InnerDiv';
import EditUser from './EditUser';
import formatDate from '../../lib/formatDate';

class Users extends Component {
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

  async componentDidMount() {
    await this.fetch();
  }

  fetch = async () => {
    const data = await getData('http://127.0.0.1:5000/readByType/Users');
    this.setState({ formData: data.data });
  };

  changeForm = () => {
    this.setState({ form: 0 });
  };

  updateUser = async (key) => {
    this.setState({ formData: [] });
    const token = Cookies.get('token');
    const data = {
      token,
      key,
      activated: '0',
    };
    const res = await sendRequest(
      'PUT',
      'http://127.0.0.1:5000/users/update',
      data,
    );
    if (res) {
      this.fetch();
    }
  };

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
                  <h1>Users</h1>
                  <Error error={this.state.error} />

                  <Table>
                    <thead>
                      <tr>
                        <th>Email </th>
                        <th>Name</th>
                        <th>Permission</th>
                        <th>Activated</th>
                        <th>Created At</th>
                        <th>Updated At</th>
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

                        return (
                          <tr key={item.Key}>
                            <td>{item.Record.email}</td>
                            <td>{item.Record.name}</td>
                            <td>{item.Record.permission}</td>
                            <td>
                              {item.Record.activated === 1
                                ? 'Activated'
                                : 'Disabled'}
                            </td>
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
                              {item.Record.activated === 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const res = confirm(
                                      'Do you really want to delete?',
                                    );
                                    if (res) {
                                      this.updateUser(item.Key);
                                    }
                                  }}
                                >
                                  ❌
                                </button>
                              )}
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
                  <EditUser
                    changeForm={this.changeForm}
                    edit
                    refetch={this.fetch}
                    data={this.state.data.item}
                  ></EditUser>
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
export default Users;
