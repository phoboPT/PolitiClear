import React, { Component } from "react";
import styled from "styled-components";
import NodesTypes from "../components/backoffice/NodesTypes";
import Forms from "../components/backoffice/Forms";
import Users from "../components/backoffice/Users";
import Nodes from "../components/backoffice/Nodes";
import Arcs from "../components/backoffice/Arcs";
import Me from "../components/Me";
import { permissions } from "../lib/permissions";
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
            {console.log(items)}
            {!items.error && isLoaded && (
              <>
                {items.permission === permissions[0] && (
                  <>
                    <Div>
                      <button
                        type="button"
                        onClick={() => {
                          this.setState({ show: 1 });
                        }}
                      >
                        NodesTypes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          this.setState({ show: 2 });
                        }}
                      >
                        Users
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          this.setState({ show: 3 });
                        }}
                      >
                        Nodes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          this.setState({ show: 4 });
                        }}
                      >
                        Arcs
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          this.setState({ show: 5 });
                        }}
                      >
                        Forms
                      </button>
                    </Div>
                    <div>
                      {this.state.show === 1 && <NodesTypes></NodesTypes>}
                      {this.state.show === 2 && <Users></Users>}
                      {this.state.show === 3 && <Nodes></Nodes>}
                      {this.state.show === 4 && <Arcs></Arcs>}
                      {this.state.show === 5 && <Forms></Forms>}
                    </div>
                  </>
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