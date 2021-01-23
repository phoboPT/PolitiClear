import Downshift, { resetIdCounter } from 'downshift';
import debounce from 'lodash.debounce';
import React from 'react';
import { Graph } from 'react-d3-graph';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import swal from '@sweetalert/with-react';
import { searchNodes, search, sendRequest } from '../lib/requests';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import Table from './styles/Table';
import formatString from '../lib/formatString';
import ToolTip from './styles/ToolTip';
import Error from './ErrorMessage';
import SuccessMessage from './styles/SuccessMessage';
import FloatingIcon from './styles/FloatingIcon';
import HelpForm from './HelpForm';
import formatDate from '../lib/formatDate';

const TreeWrapper = styled.div`
  #graph-id-graph-wrapper {
    background-color: #eaf6f0;
  }
  margin-top: 50px;
  .left {
    width: 100%;
    margin: auto;
  }
  .right {
    margin-left: 20px;
    width: 100%;
  }
  .votes {
    display: flex;
    justify-content: space-evenly;
    width: 100px;
    border: none;
    height: 80%;
    margin: auto;
    img {
      border: none;
      padding-top: 3px;
    }
    .upvote {
      background-color: rgba(10, 169, 113, 0.46);
    }
    .downvote {
      background-color: #e42121;
    }
  }
`;

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
  nodeHighlightBehavior: true,
  automaticRearrangeAfterDropNode: false,
  collapsible: false,
  directed: false,
  focusAnimationDuration: 0.75,
  focusZoom: 1,
  freezeAllDragEvents: false,
  height: 800,
  highlightDegree: 1,
  highlightOpacity: 0.2,
  linkHighlightBehavior: true,
  maxZoom: 8,
  minZoom: 0.1,
  nodeHighlightBehavior: true,
  panAndZoom: false,
  staticGraph: false,
  staticGraphWithDragAndDrop: false,
  width: 1700,
  d3: {
    alphaTarget: 0.05,
    gravity: -400,
    linkLength: 300,
    linkStrength: 1,
    disableLinkForce: false,
  },
  node: {
    color: 'lightgreen',
    highlightStrokeColor: 'blue',
    labelProperty: 'id',
    mouseCursor: 'pointer',
    opacity: 1,
    fontSize: 12,
    fontWeight: 'normal',
    highlightFontSize: 12,
    highlightFontWeight: 'bold',
    highlightStrokeWidth: 1.5,
    mouseCursor: 'pointer',
    opacity: 1,
    renderLabel: true,
    size: 450,
    strokeColor: 'none',
    strokeWidth: 1.5,
    symbolType: 'circle',
  },
  link: {
    highlightColor: 'lightblue',
    fontSize: 10,
    strokeLinecap: '"round"',
    fontWeight: 'normal',
    highlightFontSize: 8,
    highlightFontWeight: 'bold',
    mouseCursor: 'pointer',
    opacity: 1,
    renderLabel: false,
    semanticStrokeWidth: false,
    strokeWidth: 4,
    markerHeight: 6,
    markerWidth: 6,
    strokeDasharray: 0,
    strokeDashoffset: 0,
    type: 'CURVE_SMOOTH',
  },
};

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      data: null,
      nodes: [],
      voted: { arcId: '', vote: 0 },
    };
  }

  populate = async (item) => {
    this.setState({ loading: true, key: item.Key, data: null });
    const relations = await searchNodes(
      'http://localhost:5000/searchNodes',
      item.Key,
    );
    console.log(relations);
    if (relations.data.data.length > 0) {
      let graph = {
        nodes: [],

        links: [],
      };
      relations.data.data.forEach((relation) => {
        graph.nodes.push({
          id: relation.finalNode.Record.description,
          arc: relation.arc,
          keyNode: relation.arc.Record.finalNode,
          arcId: relation.arc.Key,
        });
        graph.nodes.push({
          id: relation.initialNode.Record.description,
          arc: relation.arc,
          keyNode: relation.arc.Record.initialNode,
          arcId: relation.arc.Key,
        });

        graph.links.push({
          source: relation.initialNode.Record.description,
          target: relation.finalNode.Record.description,
        });
      });

      graph = {
        ...graph,
      };
      this.setState({
        show: true,
        loading: false,
        message: null,
        data: { ...graph },
      });
    } else {
      this.setState({
        show: false,
        loading: false,
        message: 'The politician don´t exist or don´t have any relation',
      });
    }
  };

  async componentDidMount() {
    // await this.getAll();
  }

  getAll = async () => {
    this.setState({ loading: true, data: null });
    const user = await searchNodes('http://localhost:5000/nodes/getRelations');

    if (user.data.nodes.length > 0) {
      let graph = {
        nodes: [],

        links: [],
      };
      for (let i = 0; i < user.data.nodes.length; i++) {
        graph.nodes.push({
          id: user.data.nodes[i].Record.description,
          keyNode: user.data.nodes[i].Key,
          // arc: user.data[i],
          // arcId: user.data[i].arcId,
        });
      }

      for (let i = 0; i < user.data.arcs.length; i++) {
        graph.links.push({
          source: user.data.arcs[i].Record.initialNodeDescription,
          target: user.data.arcs[i].Record.finalNodeDescription,
        });
      }

      graph = {
        ...graph,
      };
      // console.log(graph);
      this.setState({
        show: true,
        loading: false,
        message: null,
        data: { ...graph },
      });
    } else {
      this.setState({
        show: false,
        loading: false,
        message: 'The politician don´t exist or don´t have any relation',
      });
    }
  };

  onChange = debounce(async () => {
    // turn loading on
    this.setState({ loading: true });
    this.fetch();
  }, 300);

  onClickLink = (source, target) => {
    const nodes = {};
    this.state.data.nodes.map((item) => {
      if (
        (item.arc.Record.finalNodeDescription === source ||
          item.arc.Record.finalNodeDescription === target) &&
        (item.arc.Record.initialNodeDescription === source ||
          item.arc.Record.initialNodeDescription === target)
      ) {
        if (!nodes[item.arc.Record.description]) {
          nodes[item.arc.Record.description] = {
            arc: item.arc.Record,
            from: item.arc.Record.initialNodeDescription,
            to: item.arc.Record.finalNodeDescription,
            arcId: item.arc.Key,
          };
        }
      }
    });
    const info = [];
    const keys = Object.values(nodes);
    for (const values of keys) {
      info.push(values);
    }

    this.setState({ ...this.state, nodesInfo: info });
  };

  onClickNode = (nodeId, node) => {
    this.setState({ nodesInfo: null });
    const item = {
      Key: node.keyNode,
    };
    this.populate(item);
  };

  fetch = async () => {
    const data = await search(
      'http://127.0.0.1:5000/search',
      this.state.search,
    );
    this.setState({ nodes: data.data, loading: false });
  };

  vote = async (id, isUpvote) => {
    const token = Cookies.get('token');
    const data = {
      token,
      arcId: id,
      vote: isUpvote ? 1 : -1,
    };

    const res = await sendRequest(
      'POST',
      'http://127.0.0.1:5000/votes/create',
      data,
    );
    this.hideTimeout = setTimeout(
      () => this.setState({ error: null, data2: null }),
      3000,
    );
    if (res.data.data === 'Created') {
      this.setState({
        voted: { arcId: id, vote: isUpvote ? 1 : -1 },
        data2: res.data.data,
      });
    }
    if (res.data.error) {
      this.setState({ error: res.data.error });
    }
  };

  componentWillUnmount() {
    clearTimeout(this.hideTimeout);
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.onChange();
  };

  openForm = () => {
    swal({
      width: '1800px',
      height: '600px',
      buttons: false,
      content: <HelpForm></HelpForm>,
    }).then;
  };

  render() {
    const { loading, nodes, data } = this.state;
    resetIdCounter();
    return (
      <>
        <SearchStyles>
          <Downshift
            onChange={this.populate}
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
                            <p>{item.Record.description}</p>
                          </DropDownItem>
                        );
                      }
                    })}
                    {!nodes.length && !loading && (
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

        {this.state.message && <p>{this.state.message}</p>}
        {this.state.data && (
          <TreeWrapper>
            <h2>Graph</h2>
            <div className="left">
              <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={data}
                config={myConfig}
                // onClickGraph={onClickGraph}
                onClickNode={this.onClickNode}
                // onDoubleClickNode={onDoubleClickNode}
                // onRightClickNode={onRightClickNode}
                onClickLink={this.onClickLink}
                // onRightClickLink={onRightClickLink}
                // onMouseOverNode={onMouseOverNode}
                // onMouseOutNode={onMouseOutNode}
                // onMouseOverLink={onMouseOverLink}
                // onMouseOutLink={onMouseOutLink}
                // onNodePositionChange={onNodePositionChange}
                // onZoomChange={onZoomChange}
              />
            </div>

            <div className="right">
              <h2>Relations</h2>
              {this.state.nodesInfo ? (
                <>
                  <Error error={this.state.error} />
                  <SuccessMessage message={this.state.data2} />
                  <Table>
                    <thead>
                      <tr>
                        <th>From:</th>
                        <th>Relation:</th>
                        <th>To:</th>
                        <th>Created At:</th>
                        <th>Credibility:</th>
                        <th>Verify:</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.nodesInfo.map((item, index) => {
                        const createdAt = new Date(
                          item.arc.createdAt,
                        ).toISOString();

                        return (
                          <tr key={item.arcId + index}>
                            <td>
                              <ToolTip>
                                <li
                                  className="tooltip fade"
                                  data-title={item.from}
                                >
                                  <p>{formatString(item.from || '', 20)}</p>
                                </li>
                              </ToolTip>
                            </td>
                            <td>
                              <ToolTip>
                                <li
                                  className="tooltip fade"
                                  data-title={item.arc.description}
                                >
                                  <p>
                                    {formatString(
                                      item.arc.description || '',
                                      20,
                                    )}
                                  </p>
                                </li>
                              </ToolTip>
                            </td>
                            <td>
                              <ToolTip>
                                <li
                                  className="tooltip fade"
                                  data-title={item.to}
                                >
                                  <p>{formatString(item.to || '', 20)}</p>
                                </li>
                              </ToolTip>
                            </td>

                            <td>{formatDate(createdAt)}</td>
                            {item.arcId === this.state.voted.arcId ? (
                              <td>
                                {item.arc.totalVotes + this.state.voted.vote}
                              </td>
                            ) : (
                              <td>{item.arc.totalVotes}</td>
                            )}

                            <td className="votes">
                              <img
                                className="upvote"
                                src="../static/like.svg"
                                onClick={async () => {
                                  this.vote(item.arcId, true);
                                }}
                              ></img>
                              <img
                                className="downvote"
                                src="../static/dislike.svg"
                                onClick={async () => {
                                  this.vote(item.arcId, false);
                                }}
                              ></img>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </>
              ) : (
                <p>Click on a relation to see more info</p>
              )}
            </div>
          </TreeWrapper>
        )}
        {!this.props.user.createdAt && (
          <FloatingIcon>
            <div className="wsk-float">
              <a
                onClick={() => {
                  this.openForm();
                }}
                className="pulse-button"
              ></a>
            </div>
          </FloatingIcon>
        )}
      </>
    );
  }
}
export default Search;
