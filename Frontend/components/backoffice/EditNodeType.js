import React, { Component } from "react";
import Form from ".././styles/Form";
import Error from ".././ErrorMessage";
import SuccessMessage from ".././styles/SuccessMessage";
import { sendRequest } from "../../lib/requests";
import SickButton from ".././styles/SickButton";
import styled from "styled-components";
const ButtonDiv = styled.div`
  button {
    margin: 0 auto;
    margin: 2rem;
  }

  text-align: center;
`;
class EditNodeType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      error: "",
    };
  }

  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  saveUser = async (create) => {
    this.setState({ loading: true });
    if (create) {
      const data = { name: this.state.name };
      const res = await sendRequest(
        "POST",
        "http://127.0.0.1:5000/nodesTypes/create",
        data
      );
      this.setState({ data: res.data.data, error: "" });
      if (res.data.error) {
        this.setState({ error: res.data.error || "", data: "" });
      }
      this.props.refetch();
    } else {
      const data = { name: this.state.name, key: this.props.data.Key };
      const res = await sendRequest(
        "PUT",
        "http://127.0.0.1:5000/nodesTypes/update",
        data
      );
      this.setState({ data: res.data.data, error: "", loading: false });
      this.hideTimeout = setTimeout(
        () => this.setState({ data: null, error: null }),
        3000
      );
      if (res.data.error) {
        this.setState({
          error: res.data.error || "",
          data: "",
          loading: false,
        });
      }
      this.props.refetch();
    }
  };

  render() {
    const { name } = this.props.data.Record;
    return (
      <Form>
        <fieldset disabled={loading} aria-busy={loading}>
          <h2>
            {this.props.edit
              ? `Edit ${this.props.data.Record.name}`
              : "Create new NodeType"}
          </h2>
          <Error error={this.state.error} />
          <SuccessMessage message={this.state.data} />
          <label htmlFor="name">
            Name
            <input
              type="text"
              name="name"
              placeholder="Name"
              defaultValue={name}
              onChange={this.saveToState}
            />
          </label>
          <ButtonDiv>
            {!this.props.edit && (
              <SickButton type="button" onClick={() => this.saveUser(true)}>
                Sav{loading ? "ing" : "e"}
              </SickButton>
            )}
            {this.props.edit && (
              <SickButton type="button" onClick={() => this.saveUser()}>
                Sav{loading ? "ing" : "e"}
              </SickButton>
            )}

            <SickButton type="button" onClick={this.props.changeForm}>
              Back
            </SickButton>
          </ButtonDiv>
        </fieldset>
      </Form>
    );
  }
}

export default EditNodeType;
