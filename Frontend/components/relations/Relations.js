import React, { Component } from 'react';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import Me from '../Me';
import Error from '../ErrorMessage';
import { getData, searchByKey } from '../../lib/requests';
import { permissions } from '../../lib/permissions';
import Table from '../styles/Table';
import Inner from '../styles/InnerDiv';
import AddEvents from './AddEvents';
import formatDate from '../../lib/formatDate';
import SickButton from '../styles/SickButton';

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
    const token = Cookies.get('token');
    if (token) {
      const data = await this.reqData(token);
      data[0].data.map((item) => {
        console.log(item.Record.nodeType);

        data[1].data.map((nodeType) => {
          if (item.Record.nodeType === nodeType.Key) {
            item.Record.nodeType = nodeType.Record.name;
          }
        });
      });
      this.setState({ formData: data[0].data });
    }
  };

  changeForm = () => {
    this.setState({ form: 0 });
  };

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  reqData = async (token) => {
    const nodes = searchByKey('http://127.0.0.1:5000/arcs/userArcs', token);
    const nodesTypes = getData('http://127.0.0.1:5000/readByType/NodesTypes');
    const res = await Promise.all([nodes, nodesTypes]);
    return Promise.resolve(res);
  };

  render() {
    return (
      <Me>
        {(items, isLoaded) => {
          if (!items.error && isLoaded && items.permission === permissions[1]) {
            if (this.state.form == 0) {
              return (
                <div>
                  <h1>Relations</h1>
                  <Error error={this.state.error} />
                  <SickButton
                    type="button"
                    onClick={() => {
                      this.setState({ form: 2 });
                    }}
                  >
                    Add new
                  </SickButton>
                  <br />
                  <br />
                  <Table>
                    <thead>
                      <tr>
                        <th>From</th>
                        <th>Relation </th>
                        <th>To</th>
                        <th>Creator</th>
                        <th>Credibility</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Edit </th>
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
          return (
            <p>
              You dont have permissions to access this page, or you need to
              login
            </p>
          );
        }}
      </Me>
    );
  }
}
export default Relations;
