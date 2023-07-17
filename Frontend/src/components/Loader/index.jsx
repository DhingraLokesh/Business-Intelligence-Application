import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = ({ message = "" }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "9999",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Spinner animation="border" variant="dark" />
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default Loader;
