import Router from 'next/router';
import React from 'react';
import { logout } from '../lib/requests';

function routeToItem() {
  Router.push({
    pathname: '/',
  });
}
const Signout = (props) => (
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
export default Signout;
