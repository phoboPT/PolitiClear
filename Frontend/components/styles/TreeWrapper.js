import styled from 'styled-components';

const TreeWrapper = styled.div`
  #graph-id-graph-wrapper {
    background-color: #eaf6f0;
  }
  .img {
    text-align: center;
    display: inline-flex;
    margin: 10px; /* vertical-align: middle; */
    img {
      margin: auto 50px auto 5px;
      width: 30px;
      height: 30px;
    }
    p {
      margin: 5px;
    }
  }
  h2 {
    margin: 5px;
  }
  margin-top: 50px;
  .left {
    margin: auto;
  }
  .right {
    margin-left: 20px;
    width: 100%;
  }
  .votes {
    display: flex;
    justify-content: space-evenly;
    width: 100px;
    border: none;
    height: 80%;
    margin: auto;
    img {
      border: none;
      padding-top: 3px;
    }
    .upvote {
      background-color: rgba(10, 169, 113, 0.46);
    }
    .downvote {
      background-color: #e42121;
    }
  }
`;
export default TreeWrapper;
