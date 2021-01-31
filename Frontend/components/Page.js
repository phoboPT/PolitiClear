import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Header from './Header';
import Meta from './Meta';

const theme = {
  black: '#2c2f33',
  blue: '#5bc0de',
  borderRadius: '10px',
  bs: '0 12px 24px 0 rgba(0,0,0,0.09)',
  darkblue: '#428bca',
  green: '#5cb85c',
  lightGrey: '#99aab5',
  red: '#d9534f',
  white: '#ffffff',
  adminBarSizeSmall: '50px',
  adminBarSizeLarge: '150px',
};

const StyledPage = styled.div`
  background: white;
  color: ${(props) => props.theme.black};
`;
const Inner = styled.div`
  padding: 0 2rem 2rem 2rem;
  margin-left: ${(props) => props.sidebarState === 1 && '130px!important'};
  margin-left: ${(props) => props.sidebarState === 2 && '200px!important'};

  max-width: ${(props) => props.theme.maxWidth};
  margin: 10px 80px auto 80px;
  min-height: calc(100vh - 210px);
  @media (max-width: 1300px) {
    margin-left: ${(props) => props.sidebarState === 1 && '80px!important'};

    margin: 100px auto auto auto;
  }
  &::after {
    content: '';
  }
`;

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'radnika_next';
    src: url('/static/radnikanext-medium-webfont.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: 'radnika_next';
  }
  a {
    text-decoration: none;
    color: ${theme.black};
  }
  button {  font-family: 'radnika_next'; }
`;

const Page = (props) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <StyledPage>
      <Meta />
      <Header />
      <Inner>{props.children}</Inner>
    </StyledPage>
  </ThemeProvider>
);

export default Page;
