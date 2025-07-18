import React from "react";

const FullPageSpinner = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ height: "100vh" }}
  >
    <div
      className="spinner-border text-primary"
      role="status"
      style={{ width: "4rem", height: "4rem" }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default FullPageSpinner;
