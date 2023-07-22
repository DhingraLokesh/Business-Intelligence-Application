import React from "react";
import { Spinner } from "react-bootstrap";

const ButtonLoader = () => {
  return (
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
      style={{
        marginLeft: "20px",
        paddingTop: "5px",
      }}
    />
  );
};

export default ButtonLoader;
