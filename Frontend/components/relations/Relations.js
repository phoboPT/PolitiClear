import React, { Component } from 'react';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import Me from '../Me';
import Error from '../ErrorMessage';
import { getData, searchNodes } from '../../lib/requests';
import { permissions } from '../../lib/permissions';
import Table from '../styles/Table';
import Inner from '../styles/InnerDiv';
import AddEvents from './AddEvents';
import formatDate from '../../lib/formatDate';
const Button = styled.button`
  background: #e4e5e6;
  background-image: -webkit-linear-gradient(
    top,
    rgba(233, 233, 233, 0.781),
    #a7a3a3
  );
  background-image: -moz-linear-gradient(top, #c2c2c2, #a7a3a3);
  background-image: -ms-linear-gradient(top, #c2c2c2, #a7a3a3);
  background-image: -o-linear-gradient(top, #c2c2c2, #a7a3a3);
  background-image: -webkit-gradient(to bottom, #c2c2c2, #a7a3a3);
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 5px;
  color: #000000;
  padding: 10px;
  -webkit-box-shadow: 1px 1px 42px 0 #c7c4c4;
  -moz-box-shadow: 1px 1px 42px 0 #c7c4c4;
  box-shadow: 1px 1px 42px 0 #c7c4c4;
  border: solid #c2c2c2 1px;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  text-align: center;

  :hover {
    border: solid #c2c2c2 1px;
    background: #a7a3a3;
    background-image: -webkit-linear-gradient(top, #a7a3a3, #c2c2c2);
    background-image: -moz-linear-gradient(top, #a7a3a3, #c2c2c2);
    background-image: -ms-linear-gradient(top, #a7a3a3, #c2c2c2);
    background-image: -o-linear-gradient(top, #a7a3a3, #c2c2c2);
    background-image: -webkit-gradient(to bottom, #a7a3a3, #c2c2c2);
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 5px;
    text-decoration: none;
  }
`;

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
    const nodes = searchNodes('http://127.0.0.1:5000/arcs/userArcs', token);
    const nodesTypes = getData('http://127.0.0.1:5000/readByType/NodesTypes');
    const res = await Promise.all([nodes, nodesTypes]);
    return Promise.resolve(res);
  };

  render() {
    return (
      <Me>
        {(items, isLoaded) => {
          if (!items.error && isLoaded && items.permission === permissions[2]) {
            if (this.state.form == 0) {
              return (
                <div>
                  <h1>Relations</h1>
                  <Error error={this.state.error} />
                  <Button
                    type="button"
                    onClick={() => {
                      this.setState({ form: 2 });
                    }}
                  >
                    Add new
                  </Button>
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
