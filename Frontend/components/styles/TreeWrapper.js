import styled from 'styled-components';

const TreeWrapper = styled.div`
  #graph-id-graph-wrapper {
    background-color: #eaf6f0;
  }
  .img {
    text-align: center;
    display: inline-flex;
    justify-content: flex-start;
    /* vertical-align: middle; */
    width: 100%;
    img {
      margin: auto 50px auto 5px;
      width: 30px;
      height: 30px;
    }
    p {
      margin: 5px;
    }
    .start {
      margin-left: 0px;
    }
  }
  h2 {
    margin: 5px;
  }
  .left {
    margin: auto;
    width: auto;
    height: auto;
  }
  .right {
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
