import styled from 'styled-components';
import Me from '../components/Me';
import Search from '../components/Search';

const Div = styled.div`
  text-align: center;
  h2,h3{
    margin:5px;
  }
`;
const P=styled.p`
  margin:5px;
`;
const index = () => (
  <Me>
    {(items, isLoaded, fetch) => {
      console.log(items);

      return (
        <div>
          <Div>
            <h2>Welcome to the PolitiClear</h2>
            <h3>
              A platform made to acredit relationships between Politcs/Entitys
            </h3>
          </Div>
          <P>Search a name to start</P>
          <Search user={items}></Search>
        </div>
      );
    }}
  </Me>
);

export default index;
