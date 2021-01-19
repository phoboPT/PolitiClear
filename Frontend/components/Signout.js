import Router from "next/router";
import { logout } from "../lib/requests";
import React from "react";

function routeToItem() {
  Router.push({
    pathname: "/",
  });
}
const Signout = (props) => {
  return (
    <button
      type="button"
      onClick={() => {
        logout();
        props.refetch();
        routeToItem();
      }}
    >
      Signout
    </button>
  );
};
export default Signout;
