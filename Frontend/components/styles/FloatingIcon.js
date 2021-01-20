import styled from 'styled-components';

const FloatingIcon = styled.div`
  body {
    background: #f7f7f7;
  }
  .has-dim {
    height: 1000px;
  }
  .wsk-float {
    position: fixed;
    bottom: 40px;
    right: 40px;
  }
  .wsk-float a,
  .wsk-float a img {
    display: block;
  }

  .pulse-button {
    position: relative;
    width: 70px;
    height: 70px;
    border: none;
    box-shadow: 0 0 0 0 rgba(41, 167, 26, 0.7);
    border-radius: 50%;
    background-color: #29a71a;
    background-image: url(https://pngimage.net/wp-content/uploads/2018/05/dialer-icon-png-9.png);
    background-size: cover;
    background-repeat: no-repeat;
    cursor: pointer;
    -webkit-animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
    -moz-animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
    -ms-animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
    animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  }
  .pulse-button:hover {
    -webkit-animation: none;
    -moz-animation: none;
    -ms-animation: none;
    animation: none;
  }

  @-webkit-keyframes pulse {
    to {
      box-shadow: 0 0 0 45px rgba(232, 76, 61, 0);
    }
  }
  @-moz-keyframes pulse {
    to {
      box-shadow: 0 0 0 45px rgba(232, 76, 61, 0);
    }
  }
  @-ms-keyframes pulse {
    to {
      box-shadow: 0 0 0 45px rgba(232, 76, 61, 0);
    }
  }
  @keyframes pulse {
    to {
      box-shadow: 0 0 0 45px rgba(232, 76, 61, 0);
    }
  }
`;

export default FloatingIcon;
