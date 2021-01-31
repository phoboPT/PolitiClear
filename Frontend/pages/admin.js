import React, { Component } from 'react';
import styled from 'styled-components';
import NodesTypes from '../components/backoffice/NodesTypes';
import Forms from '../components/backoffice/Forms';
import Users from '../components/backoffice/Users';
import Nodes from '../components/backoffice/Nodes';
import Arcs from '../components/backoffice/Arcs';
import Me from '../components/Me';
import { permissions } from '../lib/permissions';
import SickButton from '../components/styles/SickButton';
const Div = styled.div`
  padding: 0;
  margin: 10px 0px;
  list-style: none;
  display: flex;
  justify-content: space-evenly;
  .button {
    padding: 5px;
    width: 60px;
    height: 50px;
    margin: 5px;
    line-height: 50px;
    color: white;
    font-weight: bold;
    font-size: 2em;
    text-align: center;
  }
`;

class admin extends Component {
  constructor(props) {
    super(props);
    this.state = { show: 0 };
  }

  render() {
    return (
      <Me>
        {(items, isLoaded, fetch) => (
          <>
            {!items.error && isLoaded && (
              <>
                {items.permission === permissions[0] ? (
                  <>
                    <Div>
                      <SickButton
                        type="button"
                        onClick={() => {
                          this.setState({ show: 1 });
                        }}
                      >
                        NodesTypes
                      </SickButton>
                      <SickButton
                        type="button"
                        onClick={() => {
                          this.setState({ show: 2 });
                        }}
                      >
                        Users
                      </SickButton>
                      <SickButton
                        type="button"
                        onClick={() => {
                          this.setState({ show: 3 });
                        }}
                      >
                        Nodes
                      </SickButton>
                      <SickButton
                        type="button"
                        onClick={() => {
                          this.setState({ show: 4 });
                        }}
                      >
                        Arcs
                      </SickButton>
                      <SickButton
                        type="button"
                        onClick={() => {
                          this.setState({ show: 5 });
                        }}
                      >
                        Forms
                      </SickButton>
                    </Div>
                    <div>
                      {this.state.show === 1 && <NodesTypes></NodesTypes>}
                      {this.state.show === 2 && <Users></Users>}
                      {this.state.show === 3 && <Nodes></Nodes>}
                      {this.state.show === 4 && <Arcs></Arcs>}
                      {this.state.show === 5 && <Forms></Forms>}
                    </div>
                  </>
                ) : (
                  <h1>You dont have permissions to access this page</h1>
                )}
              </>
            )}
          </>
        )}
      </Me>
    );
  }
}

export default admin;
