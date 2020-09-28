import React from "react";

const Title = ({ type }) => {
  return (
    <div className="header">
      <h1 className="title">React Sample Project: {type}</h1>
    </div>
  );
};

export default Title;
