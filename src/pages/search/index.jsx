import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import logo from "../../images/logo.png";
import "./search.less";

export default class Search extends PureComponent {
  render() {
    return (
      <div className="dangerous-text">
        search Te
        <img src={logo} alt="22" />
      </div>
    );
  }
}

ReactDOM.render(<Search />, document.getElementById("root"));
