import Downshift, { resetIdCounter } from 'downshift';
import debounce from 'lodash.debounce';
import React from 'react';
import { Graph } from 'react-d3-graph';
import Cookies from 'js-cookie';
import swal from '@sweetalert/with-react';
import { searchByKey, search, sendRequest } from '../lib/requests';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import Table from './styles/Table';
import formatString from '../lib/formatString';
import ToolTip from './styles/ToolTip';
import Error from './ErrorMessage';
import SuccessMessage from './styles/SuccessMessage';
import FloatingIcon from './styles/FloatingIcon';
import HelpForm from './HelpForm';
import formatDate from '../lib/formatDate';
import TreeWrapper from './styles/TreeWrapper';

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used

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
    const relations = await searchByKey(
      'http://localhost:5000/nodes/getRelations',
      item.Key,
    );
    if (relations.data.arcs.length > 0) {
      let graph = {
        nodes: [],

        links: [],
      };

      const symbol = {
        Jornalista: 'square',
        'Representante Político': 'circle',
        'Partido Político': 'triangle',
        'Função Politica': 'cross',
        Politico: 'diamond',
        Eventos: 'star',
      };
      relations.data.nodes.forEach((relation) => {
        console.log(relation);
        graph.nodes.push({
          id: relation[0] || 0,
          // arc: relation.Record,
          name: relation[1],
          symbolType: symbol[relation[2]],
          // arcId: relation.Key,post
        });
      });
      relations.data.arcs.forEach((arc) => {
        graph.links.push({
          source: arc[1] || 0,
          target: arc[4],
          label: arc[7],
          arc,
        });
      });

      graph = {
        ...graph,
      };
      console.log(graph);
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

    this.setState({
      width: window.innerWidth * 0.8,
      myConfig: {
        nodeHighlightBehavior: true,
        automaticRearrangeAfterDropNode: true,
        collapsible: false,
        directed: false,
        focusAnimationDuration: 0.75,
        initialZoom: 0.8,
        freezeAllDragEvents: false,
        height: 600,
        highlightDegree: 1,
        highlightOpacity: 0.2,
        linkHighlightBehavior: true,
        maxZoom: 8,
        minZoom: 0.1,
        nodeHighlightBehavior: true,
        panAndZoom: false,
        staticGraph: false,
        staticGraphWithDragAndDrop: false,
        width: window.innerWidth * 0.8,
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
          labelProperty: 'name',
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
        },
        link: {
          highlightColor: 'lightblue',
          labelProperty: 'label',
          fontSize: 15,
          strokeLinecap: '"round"',
          fontWeight: 'normal',
          highlightFontSize: 8,
          highlightFontWeight: 'bold',
          mouseCursor: 'pointer',
          opacity: 1,
          renderLabel: true,
          semanticStrokeWidth: false,
          strokeWidth: 7,
          markerHeight: 6,
          markerWidth: 6,
          strokeDasharray: 0,
          strokeDashoffset: 0,
          type: 'CURVE_SMOOTH',
        },
      },
    });
  }

  onChange = debounce(async () => {
    // turn loading on
    this.setState({ loading: true });
    this.fetch();
  }, 300);

  onClickLink = (source, target) => {
    const nodes = {};
    this.state.data.links.map((item) => {
      if (
        (item.target === source || item.target === target) &&
        (item.source === source || item.source === target)
      ) {
        if (!nodes[item.arc[0]]) {
          nodes[item.arc[0]] = {
            arc: item,
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
      Key: node.id,
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

  vote = async (id, isUpvote, arcUserId) => {
    const token = Cookies.get('token');
    console.log(arcUserId);
    const data = {
      token,
      arcId: id,
      vote: isUpvote ? 1 : -1,
      arcUserId,
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
    if (res.data.data === 'Sucess') {
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
    const { loading, nodes, data, myConfig } = this.state;
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
            <div className="img">
              <p>Representante Político:</p>
              <img src="../static/circle.png" alt="" />
              <p>Jornalista:</p>
              <img src="../static/square.png" alt="" />
              <p>Partido Político:</p>
              <img src="../static/triangle.png" alt="" />
              <p>Função Politica:</p>
              <img src="../static/cross.png" alt="" />
              <p>Politico:</p>
              <img src="../static/diamond.png" alt="" />
              <p>Evento:</p>
              <img src="../static/star.png" alt="" />
            </div>

            <div className="left" style={{ width: this.state.width }}>
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
                      {this.state.nodesInfo.map((item) => {
                        console.log(item);
                        const createdAt = new Date(
                          item.arc.arc[8],
                        ).toISOString();

                        return (
                          <tr key={item.arc.arc[0]}>
                            <td>
                              <ToolTip>
                                <li
                                  className="tooltip fade"
                                  data-title={item.arc.arc[2]}
                                >
                                  <p>
                                    {formatString(item.arc.arc[2] || '', 20)}
                                  </p>
                                </li>
                              </ToolTip>
                            </td>
                            <td>
                              <ToolTip>
                                <li
                                  className="tooltip fade"
                                  data-title={item.arc.arc[7]}
                                >
                                  <p>
                                    {formatString(item.arc.arc[7] || '', 20)}
                                  </p>
                                </li>
                              </ToolTip>
                            </td>
                            <td>
                              <ToolTip>
                                <li
                                  className="tooltip fade"
                                  data-title={item.arc.arc[5]}
                                >
                                  <p>
                                    {formatString(item.arc.arc[5] || '', 20)}
                                  </p>
                                </li>
                              </ToolTip>
                            </td>

                            <td>{formatDate(createdAt)}</td>
                            {item.arc.arc[0] === this.state.voted.arcId ? (
                              <td>{item.arc.arc[9] + this.state.voted.vote}</td>
                            ) : (
                              <td>{item.arc.arc[9]}</td>
                            )}

                            <td className="votes">
                              <img
                                className="upvote"
                                src="../static/like.svg"
                                onClick={async () => {
                                  this.vote(
                                    item.arc.arc[0],
                                    true,
                                    item.arc.arc[10],
                                  );
                                }}
                              ></img>
                              <img
                                className="downvote"
                                src="../static/dislike.svg"
                                onClick={async () => {
                                  this.vote(
                                    item.arc.arc[0],
                                    false,
                                    item.arc.arc[10],
                                  );
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
        {!this.props.user.createdAt && this.props.loading && (
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
