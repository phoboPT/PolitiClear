import React, { Component } from "react";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import SuccessMessage from "./styles/SuccessMessage";
import { update } from "../lib/requests";
import SickButton from "./styles/SickButton";
class EditAccount extends Component {
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
  updateUser = async () => {
    const data = { ...this.state };
    delete data[res];
    const res = await update(data);
    this.setState({ data: res.data.data, error: "" });
    this.hideTimeout = setTimeout(
      () => this.setState({ data: null, error: null }),
      3000
    );
    if (res.data.error) {
      this.setState({ error: res.data.error, data: "" });
    }
    this.props.refetch();
  };

  render() {
    const { name } = this.props.data;
    return (
      <Form>
        <fieldset>
          <h2>Edit your information</h2>
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
          <label htmlFor="email">
            Old Password
            <input
              type="password"
              name="oldPassword"
              placeholder="Password"
              onChange={this.saveToState}
            />
          </label>
          <label htmlFor="email">
            New Password
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              onChange={this.saveToState}
            />
          </label>
        </fieldset>
        <div className="button">
          <SickButton type="button" onClick={this.updateUser}>
            Save
          </SickButton>
          <SickButton type="button" onClick={this.props.changeEdit}>
            Back
          </SickButton>
        </div>
      </Form>
    );
  }
}

export default EditAccount;
