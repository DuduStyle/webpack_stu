"use strict";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import logo from "../../images/logo.png";
import "./search.less";

export default class Search extends Component {
  render() {
    return (
      <div className="dangerous-text">
        search Te
        <img src={logo} />
      </div>
    );
  }
}

ReactDOM.render(<Search />, document.getElementById("root"));
