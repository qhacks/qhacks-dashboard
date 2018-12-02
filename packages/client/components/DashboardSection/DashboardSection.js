import React, { Component } from "react";

class DashboardSection extends Component {
  render() {
    return (
      <div
        css={`
          border: 1px solid #a4b3bf;
          border-radius: 8px;
          overflow: hidden;
          max-width: 900px;
          margin: 0 auto;
        `}
      >
        <div
          css={`
            padding: 16px 24px;
            height: 56px;
            background-color: #f8f8f8;
            border-bottom: 1px solid #a4b3bf;
            border-radius-top: 8px;
            overflow: hidden;
          `}
        >
          <h3>{this.props.title}</h3>
        </div>
        <div
          css={`
            border-radius: 8px;
            padding: 40px 32px;
            overflow: hidden;
            background-color: white;
          `}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default DashboardSection;