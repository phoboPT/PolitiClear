import Link from 'next/link';
import React, { Component } from 'react';
import styled from 'styled-components';
import { permissions } from '../lib/permissions';
import EditAccount from './EditAccount';
import Me from './Me';
import SickButton from './styles/SickButton';

const Grid = styled.div`
  display: flex;
  button {
    margin: 0 auto;
    margin: 2rem;
  }
  .button {
    text-align: center;
  }
  .one {
    flex: 1 1 auto;
  }
`;

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
    };
  }

  changeEdit = () => {
    const { edit } = this.state;

    this.setState({ edit: !edit });
  };

  render() {
    const { edit, data } = this.state;
    return (
      <Me>
        {(items, isLoaded, fetch) => (
          <Grid>
            {!items.error && isLoaded && (
              <>
                {edit ? (
                  <>
                    <div className="one">
                      <EditAccount
                        data={items}
                        edit={this.editUserData}
                        changeEdit={this.changeEdit}
                        refetch={fetch}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="one">
                      {data}
                      <p> name: {items.name} </p>
                      <p>email: {items.email}</p>
                    </div>
                    <div className="one">
                      <SickButton
                        type="button"
                        onClick={() => {
                          this.setState({ edit: !edit });
                        }}
                      >
                        Edit
                      </SickButton>

                      {items.permission !== permissions[0] &&
                        items.permission !== permissions[1] && (
                          <Link href="/verify">
                            <a>Verify account</a>
                          </Link>
                        )}
                    </div>
                  </>
                )}
              </>
            )}
            {items.error && <p>You need to login first</p>}
          </Grid>
        )}
      </Me>
    );
  }
}

export default Account;
