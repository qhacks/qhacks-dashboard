import React, { Component } from "react";
import * as colors from "../../assets/colors";
import ActionButton from "../ActionButton/ActionButton";
import crown from "../../assets/img/qhacks-tricolor-logo.svg";
import ContentWrapper from "../ContentWrapper/ContentWrapper";

class MenuBar extends Component {
  render() {
    return (
      <header
        css={`
          width: 100%;
          height: 84px;
          line-height: 44px;
          padding: 20px 0;
          position: absolute;
          top: 0;
          left: 0;
        `}
      >
        <ContentWrapper wide={this.props.wide}>
          <div
            css={`
              display: inline-block;
            `}
          >
            <img src={crown} alt="QHacks logo" />
          </div>
          <ul
            css={`
              font-size: 14px;
              display: ${this.props.hideItems ? "none" : "float"};
              float: right;
              width: 490px;
              justify-content: space-between;
              line-height: 44px;
              text-transform: uppercase;
              list-style-type: none;
              a:not(.actionButton) {
                color: ${colors.blue};
                font-weight: 600;
                padding-bottom: 2px;
                padding-top: 2px;
                :hover {
                  text-decoration: none;
                  border-bottom: 2px solid ${colors.blue};
                }
              }
              a.actionButton {
                font-size: 14px;
              }
              li {
                display: block;
              }
            `}
          >
            <li>
              <a
                href="https://qhacks.io"
                rel="external noopener"
                target="_blank"
              >
                QHacks 2019
              </a>
            </li>
            <li>
              <a href="#">Past Events</a>
            </li>
            <li>
              <a href="https://medium.com/qhacks">Blog</a>
            </li>
            <li>
              <a href="https://github.com/qhacks">Code</a>
            </li>
            <li>
              <ActionButton
                style={`font-size: 16px;`}
                type="rounded"
                internal
                inline
                link="/qhacks-2019/apply"
              >
                Apply
              </ActionButton>
            </li>
          </ul>
        </ContentWrapper>
      </header>
    );
  }
}

export default MenuBar;
