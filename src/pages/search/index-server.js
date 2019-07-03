// import React, { PureComponent } from "react";
// import ReactDOM from "react-dom";
// import logo from "../../images/logo.png";
const React = require("react");
const logo = require("../../images/logo.png");

const style = require("./search.less");

class Search extends React.Component {
  render() {
    return (
      <div className={style["dangerous-text"]}>
        search Te
        <img src={logo} alt="22" />
      </div>
    );
  }
}

module.exports = <Search />;
