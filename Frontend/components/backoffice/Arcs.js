import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Me from '../Me';
import Error from '../ErrorMessage';
import { getData, deleteByKey } from '../../lib/requests';
import { permissions } from '../../lib/permissions';
import Table from '../styles/Table';
import Inner from '../styles/InnerDiv';
import EditArcs from './EditArcs';
import formatDate from '../../lib/formatDate';
class Arcs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      form: 0,
      formData: [],
    };
  }

  fetch = async () => {
    const data = await getData('http://127.0.0.1:5000/readByType/Arcs');
    this.setState({ formData: data.data });
  };

  changeForm = () => {
    this.setState({ form: 0 });
  };

  async componentDidMount() {
    this.fetch();
  }

  delete = async (key) => {
    const token = Cookies.get('token');
    const data = {
      key,
      token,
    };
    console.log(data);
    await deleteByKey('http://127.0.0.1:5000/arcs/delete', data);
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
                  <h1>Arcs</h1>
                  <Error error={this.state.error} />

                  <Table>
                    <thead>
                      <tr>
                        <th>From</th>
                        <th>Relation </th>
                        <th>To</th>
                        <th>Created by:</th>
                        <th>Credibility</th>
                        <th>Created At:</th>
                        <th>Updated At:</th>
                        <th>Edit </th>
                        {/* <th>Delete </th> */}
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
                            <td>{item.Record.initialNodeDescription}</td>
                            <td>{item.Record.description}</td>
                            <td>{item.Record.finalNodeDescription}</td>
                            <td>{item.Record.creatorIdDescription}</td>
                            <td>{item.Record.totalVotes}</td>
                            <td>{formatDate(createdAt)}</td>
                            <td>{formatDate(updatedAt)}</td>

                            <td className="center">
                              {item.Record.isVoted > 0 ? null : (
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
                              )}
                            </td>
                            {/* <td className="center">
                              {item.Record.isVoted > 0 ? null : (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const res = confirm(
                                      'Do you really want to delete?',
                                    );
                                    if (res) {
                                      await this.delete(item.Key);
                                      this.fetch();
                                    }
                                  }}
                                >
                                  ❌
                                </button>
                              )}
                            </td> */}
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
                  <EditArcs
                    changeForm={this.changeForm}
                    edit
                    refetch={this.fetch}
                    data={this.state.data.item}
                  ></EditArcs>
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
export default Arcs;
