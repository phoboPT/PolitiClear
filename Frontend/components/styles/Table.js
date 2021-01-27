import styled from 'styled-components';

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
  background-color: #eeeeee;
  width: 100%;
  text-align: left;
  border-collapse: collapse;
  background: linear-gradient(to right, white 30%, rgba(255, 255, 255, 0)),
    linear-gradient(to right, rgba(255, 255, 255, 0), white 70%) 0 100%,
    radial-gradient(
      farthest-side at 0% 50%,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0)
    ),
    radial-gradient(
        farthest-side at 100% 50%,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
      )
      0 100%;
  background-repeat: no-repeat;
  background-color: white;
  background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
  background-position: 0 0, 100%, 0 0, 100%;
  background-attachment: local, local, scroll, scroll;
  border: 1px solid black;
  thead {
    font-size: 10px;
  }
  td,
  table th {
    padding: 0px 10px;
    border-bottom: 1px solid black;
  }
  table tr {
  }

  thead {
    background: #1c6ea4;
    background: -moz-linear-gradient(
      top,
      #5592bb 0%,
      #327cad 66%,
      #1c6ea4 100%
    );
    background: -webkit-linear-gradient(
      top,
      #5592bb 0%,
      #327cad 66%,
      #1c6ea4 100%
    );
    background: linear-gradient(
      to bottom,
      #5592bb 0%,
      #327cad 66%,
      #1c6ea4 100%
    );
  }
  thead th {
    font-size: 15px;
    font-weight: bold;
    color: #ffffff;
  }
  thead th:first-child {
    border-left: none;
  }

  th {
    padding: 10px 5px;

    position: relative;
  }

  .center {
    border-right: none;
    width: 50px;
    button {
      cursor: pointer;
      background-color: transparent;
      border: none;
      height: 30px;
      width: 100%;
      color: #3498db;
      font-size: 1.5em;
    }
  }
`;

export default Table;
