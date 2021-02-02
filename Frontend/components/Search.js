import Downshift, { resetIdCounter } from 'downshift';
import debounce from 'lodash.debounce';
import React from 'react';
import { Graph } from 'react-d3-graph';
import Cookies from 'js-cookie';
import swal from '@sweetalert/with-react';
import styled from 'styled-components';
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
const symbol = {
  'Partido Político':
    'https://cdn3.iconfinder.com/data/icons/election-world-1/64/candidate-compititor-election-nominee-vote-256.png',
  'Cargo Político':
    'https://cdn1.iconfinder.com/data/icons/government-1/100/government_politics_political_legal_administrative_leadership-29-256.png',
  Politico:
    'https://cdn3.iconfinder.com/data/icons/politics-line/96/politic_congress_government_president-256.png',
  Evento:
    'https://cdn4.iconfinder.com/data/icons/business-and-finance-163/32/finance_event_calendar-256.png',
  Jornalista:
    'https://i.pinimg.com/originals/81/6b/0a/816b0ac0aff866ec3a155995811b2a24.png',

  Cidadão: 'https://img.icons8.com/ios/452/global-citizen.png',
  Empresa:
    'https://cdn0.iconfinder.com/data/icons/stock-market-3/64/enterprise-organization-business-company-team-512.png',
};

const Labels = styled.div`
  border-bottom: 1px solid black;
  .label {
    margin-left: 50px;
  }
`;
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      data: null,
      nodes: [],
      voted: { arcId: '', vote: 0 },
      level: false,
    };
  }

  populate = async (item) => {
    this.setState({ loading: true, key: item.Key, data: null });
    let relations = '';
    if (this.state.level) {
      relations = await searchByKey(
        'http://localhost:5000/searchNodes',
        item.Key,
      );
    } else {
      relations = await searchByKey(
        'http://localhost:5000/nodes/getRelations',
        item.Key,
      );
    }
    if (relations.data.arcs.length > 0) {
      let graph = {
        nodes: [],

        links: [],
      };

      relations.data.nodes.forEach((relation) => {
        console.log(relation);
        graph.nodes.push({
          id: relation[0] || 0,
          // arc: relation.Record,
          name: relation[1],
          svg: symbol[relation[2]],

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
    const token = Cookies.get('token');

    this.setState({
      token,
      width: window.innerWidth * 0.8,
      myConfig: {
        nodeHighlightBehavior: true,
        automaticRearrangeAfterDropNode: true,
        collapsible: false,
        directed: true,
        focusAnimationDuration: 0.75,
        initialZoom: 0.8,
        freezeAllDragEvents: false,
        height: window.innerHeight * 0.8,
        highlightDegree: 1,
        highlightOpacity: 0.2,
        linkHighlightBehavior: true,
        maxZoom: 8,
        minZoom: 0.1,
        nodeHighlightBehavior: true,
        panAndZoom: false,
        staticGraph: false,
        staticGraphWithDragAndDrop: false,
        width: window.innerWidth - 220,
        d3: {
          alphaTarget: 0.05,
          gravity: -800,
          linkLength: 400,
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
          labelPosition: 'top',
          strokeColor: 'none',
          strokeWidth: 1.5,
        },
        link: {
          highlightColor: 'red',
          labelProperty: 'label',
          fontSize: 15,
          color: '#adadad',
          fontWeight: 'normal',
          highlightFontSize: 8,
          highlightFontWeight: 'bold',
          mouseCursor: 'pointer',
          opacity: 1,
          renderLabel: false,
          semanticStrokeWidth: false,
          strokeWidth: 7,
          markerHeight: 6,
          markerWidth: 6,
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
    const data = {
      token: this.state.token,
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

  showLabels = () => {
    const config = this.state.myConfig;
    config.link.renderLabel = !config.link.renderLabel;
    this.setState({ loading: true });

    this.setState({
      labels: !this.state.labels,
      config,
      loading: false,
    });
  };

  levelSwitch = (e) => {
    this.setState({ loading: true });

    this.setState({
      level: !this.state.level,

      loading: false,
    });
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
    const { loading, nodes, data, myConfig, token, level } = this.state;
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
                    placeholder: 'Search a name to start',
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
        <br />
        <Labels>
          <label htmlFor="labels">
            Show Labels
            <input
              type="checkbox"
              name="labels"
              defaultValue="false"
              onChange={this.showLabels}
            />
          </label>

          <label htmlFor="labels" className="label">
            Show 1 level
            <input
              type="checkbox"
              name="labels"
              checked={level}
              defaultValue="false"
              onChange={this.levelSwitch}
            />
          </label>
        </Labels>
        <br />

        {this.state.message && <p>{this.state.message}</p>}
        {this.state.data && (
          <TreeWrapper>
            <div className="right">
              {this.state.nodesInfo && (
                <>
                  <Error error={this.state.error} />
                  <SuccessMessage message={this.state.data2} />
                  <Table>
                    <thead>
                      <tr>
                        <th>From:</th>
                        <th>Relation:</th>
                        <th>To:</th>
                        <th>Author:</th>
                        <th>Created At:</th>
                        <th>Credibility:</th>
                        {token && <th>Verify:</th>}
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
                            <td>
                              <ToolTip>
                                <li
                                  className="tooltip fade"
                                  data-title={item.arc.arc[11]}
                                >
                                  <p>
                                    {formatString(item.arc.arc[11] || '', 20)}
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
                            {token && (
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
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <br />
                </>
              )}
            </div>
            <div className="img">
              <p className="start">Cargo Político:</p>
              <img
                src="https://cdn1.iconfinder.com/data/icons/government-1/100/government_politics_political_legal_administrative_leadership-29-256.png"
                alt=""
              />
              <p>Jornalista:</p>
              <img
                src="https://cdn3.iconfinder.com/data/icons/seo-and-internet-marketing-11/512/48-512.png"
                alt=""
              />
              <p>Partido Político:</p>
              <img
                src="https://cdn3.iconfinder.com/data/icons/election-world-1/64/candidate-compititor-election-nominee-vote-256.png"
                alt=""
              />

              <p>Politico:</p>
              <img
                src="https://cdn3.iconfinder.com/data/icons/politics-line/96/politic_congress_government_president-256.png"
                alt=""
              />
              <p>Evento:</p>
              <img
                src="https://cdn4.iconfinder.com/data/icons/business-and-finance-163/32/finance_event_calendar-256.png"
                alt=""
              />
              <p>Empresa:</p>
              <img
                src="https://cdn0.iconfinder.com/data/icons/stock-market-3/64/enterprise-organization-business-company-team-512.png"
                alt=""
              />
              <p>Cidadão:</p>
              <img
                src="https://img.icons8.com/ios/452/global-citizen.png"
                alt=""
              />
            </div>
            <div className="left">
              {!loading && (
                <Graph
                  id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                  data={data}
                  config={myConfig}
                  onClickNode={this.onClickNode}
                  onClickLink={this.onClickLink}
                />
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
