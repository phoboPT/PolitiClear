import React, { Component } from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import debounce from 'lodash.debounce';
import Table from './styles/Table';
import Error from './ErrorMessage';
import { searchByKey, search } from '../lib/requests';
import formatDate from '../lib/formatDate';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import TreeWrapper from './styles/TreeWrapper';

export default class Credibility extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      formData: [],
      data: [],
      users: [],
    };
  }

  populate = async (item) => {
    this.setState({ loading: true });
    const data = await searchByKey(
      `http://127.0.0.1:5000/users/key/${item.Key}`,
    );

    this.setState({ users: [data.data], loading: false });
  };

  fetch = async () => {
    const data = await search(
      'http://127.0.0.1:5000/users/acredited',
      this.state.search,
    );
    this.setState({ data: data.data });
  };

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.onChange();
  };

  onChange = debounce(async () => {
    // turn loading on
    this.setState({ loading: true });
    this.fetch();
  }, 300);

  changeForm = () => {
    this.setState({ form: 0 });
  };

  async componentDidMount() {
    // this.fetch();
  }

  render() {
    resetIdCounter();
    const { users, loading, data } = this.state;
    return (
      <div>
        <h1>Credibility</h1>
        <TreeWrapper>
          <SearchStyles>
            <Downshift
              onChange={this.populate}
              itemToString={(item) => (item === null ? '' : item.Record.name)}
            >
              {({
                getInputProps,
                getItemProps,
                isOpen,
                inputValue,
                highlightedIndex,
              }) => (
                <div>
                  <input
                    {...getInputProps({
                      type: 'search',
                      name: 'search',
                      placeholder: 'Search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: (e) => {
                        this.saveToState(e);
                      },
                    })}
                  />
                  {isOpen && (
                    <DropDown>
                      {data.map((item, index) => {
                        if (item) {
                          return (
                            <DropDownItem
                              key={index}
                              {...getItemProps({ item })}
                              highlighted={index === highlightedIndex}
                            >
                              <p>{item.Record.name}</p>
                            </DropDownItem>
                          );
                        }
                      })}
                      {!users.length && !loading && (
                        <DropDownItem>
                          No Event found for {inputValue}
                        </DropDownItem>
                      )}
                    </DropDown>
                  )}
                </div>
              )}
            </Downshift>
          </SearchStyles>
        </TreeWrapper>
        <br />
        <br />

        <Error error={this.state.error} />
        {users.length > 0 && (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Credibility </th>
                <th>Created At:</th>
                <th>Updated At:</th>
              </tr>
            </thead>
            <tbody>
              {users.map(({ data }, index) => {
                console.log('item', data);
                const createdAt = new Date(data.createdAt).toISOString();
                let updatedAt = '';
                if (data.updatedAt) {
                  updatedAt = new Date(data.updatedAt).toISOString();
                }
                return (
                  <tr key={index}>
                    <td>{data.name}</td>
                    <td>{data.credibility}</td>
                    <td>{formatDate(createdAt)}</td>
                    <td>{formatDate(updatedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    );
  }
}
