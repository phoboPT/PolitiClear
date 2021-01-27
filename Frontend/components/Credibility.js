import React, { Component } from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import debounce from 'lodash.debounce';
import Table from './styles/Table';
import Error from './ErrorMessage';
import { getData } from '../lib/requests';
import formatDate from '../lib/formatDate';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import TreeWrapper from './styles/TreeWrapper';

export default class Credibility extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      formData: [],
      data: null,
      users: [],
    };
  }

  populate = async () => {
    const data = await getData('http://127.0.0.1:5000/users/acredited');
    this.setState({ users: data.data });
  };

  fetch = async () => {
    const data = await getData('http://127.0.0.1:5000/users/acredited');
    this.setState({ users: data.data });
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
    this.fetch();
  }

  render() {
    const { users, loading } = this.state;
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
                      {users.map((item, index) => {
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

        <Error error={this.state.error} />

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
            {users.map((item) => {
              const createdAt = new Date(item.Record.createdAt).toISOString();
              let updatedAt = '';
              if (item.Record.updatedAt) {
                updatedAt = new Date(item.Record.updatedAt).toISOString();
              }
              return (
                <tr key={item.Key}>
                  <td>{item.Record.name}</td>
                  <td>{item.Record.credibility}</td>
                  <td>{formatDate(createdAt)}</td>
                  <td>{formatDate(updatedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
