import React, { Component } from "react";
import MenuBar from "../Dashboard/DashboardMenu";
class AdminWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <MenuBar />
        <div
          css={`
            padding-top: 84px;
            height: 100vh;
            color: #252525;
            h1,
            h2,
            h3 {
              color: #252525 !important;
            }
          `}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default AdminWrapper;
