import styled from 'styled-components';
import Me from '../components/Me';
import Search from '../components/Search';

const Div = styled.div`
  text-align: center;
`;
const index = () => (
  <Me>
    {(items, isLoaded, fetch) => {
      console.log(items);

      return (
        <div>
          <Div>
            <h1>Welcome to the PolitiClear</h1>
            <h2>
              A platform made to acredit relationships between Politcs/Entitys
            </h2>
          </Div>
          <p>Search a name to start</p>
          <Search user={items}></Search>
        </div>
      );
    }}
  </Me>
);

export default index;
