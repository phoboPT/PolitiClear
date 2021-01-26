import React, { Component } from 'react';
import Me from '../Me';
import Error from '../ErrorMessage';
import { getData, deleteByKey } from '../../lib/requests';
import { permissions } from '../../lib/permissions';
import EditForm from './EditForm';
import Table from '../styles/Table';
import Inner from '../styles/InnerDiv';
import formatDate from '../../lib/formatDate';

class Forms extends Component {
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
    const data = await getData('http://127.0.0.1:5000/forms/open');
    console.log(data);
    this.setState({ formData: data.data.data });
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
                  <h1>Forms</h1>
                  <Error error={this.state.error} />

                  <Table>
                    <thead>
                      <tr>
                        <th>Email </th>
                        <th>Message</th>
                        <th>Response</th>
                        <th>created by</th>
                        <th>Created At:</th>
                        <th>Updated At:</th>
                        <th>Upgrade request</th>
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
                            <td>{item.Record.message}</td>
                            <td>{item.Record.response}</td>
                            <td>{item.Record.createdByDescription}</td>
                            <td>{formatDate(createdAt)}</td>
                            <td>{formatDate(updatedAt)}</td>
                            <td
                              style={{
                                color: item.Record.upgradeRequest
                                  ? 'red'
                                  : 'black',
                              }}
                            >
                              {item.Record.upgradeRequest.toString()}
                            </td>
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
                                      'http://127.0.0.1:5000/forms/delete',
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
                  <EditForm
                    changeForm={this.changeForm}
                    edit
                    refetch={this.fetch}
                    data={this.state.data.item}
                  ></EditForm>
                </Inner>
              );
            }
          }
          return 'You don´t have permissions to acces this page';
        }}
      </Me>
    );
  }
}
export default Forms;
