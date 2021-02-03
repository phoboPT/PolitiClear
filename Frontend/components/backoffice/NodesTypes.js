import React, { Component } from 'react';
import styled from 'styled-components';
import Me from '../Me';
import Error from '../ErrorMessage';
import { getData, deleteByKey } from '../../lib/requests';
import { permissions } from '../../lib/permissions';
import EditNodeType from './EditNodeType';
import Table from '../styles/Table';
import Inner from '../styles/InnerDiv';
import SuccessMessage from '../styles/SuccessMessage';
import formatDate from '../../lib/formatDate';
import SickButton from '../styles/SickButton';

const ButtonDiv = styled.div`
  button {
    margin: 0 auto;
    margin: 2rem;
  }

  text-align: center;
`;

class NodesTypes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      form: 0,
      nodesTypes: [],
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  fetch = async () => {
    const nodesTypes = await getData(
      'http://127.0.0.1:5000/readByType/NodesTypes',
    );
    this.setState({ nodesTypes: nodesTypes.data });
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
                  <h1>NodesTypes</h1>
                  <Error error={this.state.error} />
                  <SuccessMessage message={this.state.data} />

                  <Table>
                    <thead>
                      <tr>
                        <th>Description </th>
                        <th>Created at: </th>
                        <th>Updated at: </th>
                        <th>Delete </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.nodesTypes.map((nodeType) => {
                        const createdAt = new Date(
                          nodeType.Record.createdAt,
                        ).toISOString();
                        let updatedAt = '';
                        if (nodeType.Record.updatedAt) {
                          updatedAt = new Date(
                            nodeType.Record.updatedAt,
                          ).toISOString();
                        }
                        return (
                          <tr key={nodeType.Key}>
                            <td>{nodeType.Record.name}</td>
                            <td>{formatDate(createdAt)}</td>
                            <td>{formatDate(updatedAt)}</td>

                            <td className="center">
                              {/* {nodeType.Record.isUsed > 0 ? null : */}
                              <button
                                type="button"
                                onClick={async () => {
                                  const res = confirm(
                                    'Do you really want to delete?',
                                  );
                                  if (res) {
                                    const data = await deleteByKey(
                                      'http://127.0.0.1:5000/nodesTypes/delete',
                                      { key: nodeType.Key },
                                    );
                                    this.setState({
                                      data: data.data.data,
                                      error: '',
                                    });
                                    this.hideTimeout = setTimeout(
                                      () =>
                                        this.setState({
                                          data: null,
                                          error: null,
                                        }),
                                      3000,
                                    );
                                    if (data.data.error) {
                                      this.setState({
                                        error: data.data.error || '',
                                        data: '',
                                      });
                                    }
                                    console.log(data);
                                    this.fetch();
                                  }
                                }}
                              >
                                ❌
                              </button>
                              {/* } */}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <ButtonDiv>
                    <SickButton
                      type="button"
                      onClick={() => this.setState({ form: 1 })}
                    >
                      Create
                    </SickButton>
                  </ButtonDiv>
                </div>
              );
            }
            if (this.state.form == 1) {
              return (
                <Inner>
                  <EditNodeType
                    edit={false}
                    changeForm={this.changeForm}
                    data={{ Record: { name: '' } }}
                    refetch={this.fetch}
                  ></EditNodeType>
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
export default NodesTypes;
