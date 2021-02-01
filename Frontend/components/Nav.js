import Link from 'next/link';
import swal from '@sweetalert/with-react';
import NavStyles from './styles/NavStyles';
import Me from './Me';
import Signout from './Signout';
import Login from './Login';
import { permissions } from '../lib/permissions';

const close = () => {
  swal.close();
};
const Nav = () => (
  <Me>
    {(items, isLoaded, fetch) => (
      <NavStyles data-test="nav">
        <Link href="/credibility">
          <a>Credibility</a>
        </Link>
        {!items.error && isLoaded && (
          <>
            {items.permission === permissions[0] && (
              <Link href="/admin">
                <a>admin</a>
              </Link>
            )}
            {items.permission === permissions[1] && (
              <Link href="/relations">
                <a>relations</a>
              </Link>
            )}

            <Link href="/account">
              <a>Account</a>
            </Link>
            <Signout refetch={fetch} />
          </>
        )}

        {items.error && isLoaded && (
          <>
            <button
              type="button"
              onClick={async () => {
                swal({
                  width: '1800px',
                  height: '600px',
                  buttons: false,
                  content: <Login refetch={fetch} closeSwal={close} />,
                }).then;
              }}
            >
              Sign in
            </button>
          </>
        )}
      </NavStyles>
    )}
  </Me>
);

export default Nav;
