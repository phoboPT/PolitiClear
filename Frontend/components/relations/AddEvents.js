import React, { Component } from 'react';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import Downshift, { resetIdCounter } from 'downshift';
import debounce from 'lodash.debounce';
import swal from '@sweetalert/with-react';
import Form from '../styles/Form';
import Error from '../ErrorMessage';
import { search, sendRequest } from '../../lib/requests';
import SuccessMessage from '../styles/SuccessMessage';
import { DropDownItem } from '../styles/DropDown';
import CreateNode from './CreateNode';

const DropDown = styled.div`
  position: absolute;
  width: 20%;
  z-index: 2;
  border: 1px solid ${(props) => props.theme.lightgrey};
`;
const ButtonDiv = styled.div`
  button {
    margin: 0 auto;
    margin: 2rem;
  }

  text-align: center;
`;

class AddRelation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: [],
      nodesTypes: [],
      loading: false,
    };
  }

  populate = async (item, id) => {
    if (id === 1) {
      this.setState({
        initialNode: item.Key,
      });
    } else {
      this.setState({
        finalNode: item.Key,
      });
    }
    //
  };

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.onChange();
  };

  createArc = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    const newArc = {
      description: this.state.description,
      initialNode: this.state.initialNode,
      finalNode: this.state.finalNode,
      token,
    };

    const res = await sendRequest(
      'POST',
      'http://127.0.0.1:5000/arcs/create',
      newArc,
    );

    this.hideTimeout = setTimeout(
      () => this.setState({ data: null, error: null }),
      3000,
    );
    if (res.data.data) this.setState({ data: res.data.data });
    if (res.data.error === 0) this.setState({ error: res.data.errorMessage });
  };

  //

  fetch = async () => {
    const data = await search(
      'http://127.0.0.1:5000/search',
      this.state.search,
    );
    this.setState({ nodes: data.data, loading: false });
  };

  onChange = debounce(async () => {
    // turn loading on
    this.setState({ loading: true });
    this.fetch();
  }, 300);

  componentWillUnmount() {
    clearTimeout(this.hideTimeout);
  }

  saveToState = (e) => {
    this.setState({ loading: true });
    this.setState({ [e.target.name]: e.target.value });
    this.onChange();
  };

  openSwal = () => {
    this.setState({ name: this.state.search });
    swal({
      width: '1800px',
      height: '600px',
      buttons: false,
      content: <CreateNode name={this.state.search} />,
    });
  };

  render() {
    const { nodes, loading } = this.state;
    const { changeForm } = this.props;
    resetIdCounter();

    return (
      <Form>
        <fieldset>
          <h2>Add a new relation</h2>
          <SuccessMessage message={this.state.data} />
          <Error error={this.state.error} />
          <label htmlFor="politician">
            Source:
            <Downshift
              onChange={(e) => this.populate(e, 1)}
              itemToString={(item) =>
                item === null ? '' : item.Record.description
              }
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
                      {nodes.map((item, index) => {
                        if (item) {
                          return (
                            <DropDownItem
                              key={index}
                              {...getItemProps({ item })}
                              highlighted={index === highlightedIndex}
                            >
                              <p>
                                {`${item.Record.description} - ${item.Record.nodeTypeDescription}`}
                              </p>
                            </DropDownItem>
                          );
                        }
                      })}
                      {!nodes.length && !loading && (
                        <DropDownItem>
                          <a onClick={this.openSwal}>
                            Event not found. Add new {inputValue}?
                          </a>
                        </DropDownItem>
                      )}
                    </DropDown>
                  )}
                </div>
              )}
            </Downshift>
          </label>
          <label htmlFor="description">
            Relation:
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={this.state.description}
              onChange={this.saveToState}
            />
          </label>
          <label htmlFor="politician">
            To:
            <Downshift
              onChange={(e) => this.populate(e, 2)}
              itemToString={(item) =>
                item === null ? '' : item.Record.description
              }
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
                      {nodes.map((item, index) => {
                        if (item) {
                          return (
                            <DropDownItem
                              key={index}
                              {...getItemProps({ item })}
                              highlighted={index === highlightedIndex}
                            >
                              <p>
                                {`${item.Record.description} - ${item.Record.nodeTypeDescription}`}
                              </p>
                            </DropDownItem>
                          );
                        }
                      })}
                      {!nodes.length && !loading && (
                        <DropDownItem>
                          <a onClick={this.openSwal}>
                            Event not found. Add new {inputValue}?
                          </a>
                        </DropDownItem>
                      )}
                    </DropDown>
                  )}
                </div>
              )}
            </Downshift>
          </label>

          <ButtonDiv>
            <button type="button" onClick={this.createArc}>
              Create
            </button>
            <button type="button" onClick={changeForm}>
              Back
            </button>
          </ButtonDiv>
        </fieldset>
      </Form>
    );
  }
}
export default AddRelation;
