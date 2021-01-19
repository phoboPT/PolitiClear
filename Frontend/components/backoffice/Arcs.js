import React, { Component } from "react";
import Me from "../Me";
import Error from "../ErrorMessage";
import { getData, deleteByKey } from "../../lib/requests";
import { permissions } from "../../lib/permissions";
import Table from "../styles/Table";
import Inner from "../styles/InnerDiv";
import EditArcs from "./EditArcs";

class Arcs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      form: 0,
      formData: [],
    };
  }
  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  fetch = async () => {
    const data = await getData("http://127.0.0.1:5000/readByType/Arcs");
    this.setState({ formData: data.data });
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
                  <h1>Arcs</h1>
                  <Error error={this.state.error} />

                  <Table>
                    <thead>
                      <tr>
                        <th>Description </th>
                        <th>Created by:</th>
                        <th>Initial node</th>
                        <th>Final node</th>
                        <th>Votes</th>
                        <th>Created At:</th>
                        <th>Updated At:</th>
                        <th>Edit </th>
                        <th>Delete </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.formData.map((item) => {
                        return (
                          <tr key={item.Key}>
                            <td>{item.Record.description}</td>
                            <td>{item.Record.creatorId}</td>
                            <td>{item.Record.initialNodeDescription}</td>
                            <td>{item.Record.finalNodeDescription}</td>
                            <td>{item.Record.totalVotes}</td>
                            <td>{item.Record.createdAt}</td>
                            <td>{item.Record.updatedAt}</td>

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
                            <td className="center">
                              <button
                                type="button"
                                onClick={async () => {
                                  const res = confirm(
                                    "Do you really want to delete?"
                                  );
                                  if (res) {
                                    await deleteByKey(
                                      "http://127.0.0.1:5000/arcs/delete",
                                      item.Key
                                    );
                                    this.fetch();
                                  }
                                }}
                              >
                                ❌
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
                  <EditArcs
                    changeForm={this.changeForm}
                    edit
                    refetch={this.fetch}
                    data={this.state.data.item}
                  ></EditArcs>
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
export default Arcs;