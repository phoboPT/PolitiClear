import styled from 'styled-components';
import Search from '../components/Search';

const Div = styled.div`
  text-align: center;
`;
const index = () => (
  <div>
    <Div>
      <h1>Welcome to the PolitiClear</h1>
      <h2>A platform made to acredit relationships between Politcs/Entitys</h2>
    </Div>
    <p>Search a name to start</p>
    <Search></Search>
  </div>
);

export default index;
