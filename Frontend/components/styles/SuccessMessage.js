import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';

const ErrorStyles = styled.div`
  padding: 2rem;
  background: white;
  margin: 2rem 0;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-left: 5px solid #71d612;
  p {
    margin: 0;
    font-weight: 100;
  }
  strong {
    margin-right: 1rem;
  }
`;

const DisplayError = ({ message }) => {
  if (!message) return null;
  return (
    <ErrorStyles>
      <p data-test="graphql-error">
        <strong>Success!</strong>
        {message}
      </p>
    </ErrorStyles>
  );
};

DisplayError.propTypes = {
  message: PropTypes.string,
};

export default DisplayError;
