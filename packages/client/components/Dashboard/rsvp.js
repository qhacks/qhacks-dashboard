import React, { Component } from "react";
import DashboardMenu from "./DashboardMenu";
import { Link } from "react-router-dom";
import { mobileMaxWidth } from "../../assets/constants";
import Checkbox from "react-simple-checkbox";
import { checkboxOptions } from "../../assets/constants";
import ActionButton from "../ActionButton/ActionButton";
import Select from "react-select";

class Rsvp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shirtSize: "",
      pronoun: "",
      dietaryRestrictions: [],
      areasOfInterest: [],
      travelOrigin: "",
      qhacksBus: null
    };
  }
  toOptions(str) {
    return {
      label: str,
      value: str
    };
  }
  setSelectAnswer(field) {
    return (answer) =>
      this.setState((state) => {
        state[field] = answer;
        return state;
      });
  }

  // getSelectAnswer(field) {
  //   const val = this.state[field];
  //   return {
  //     label: val,
  //     value: val
  //   };
  // }
  render() {
    const shirtSizeOptions = ["XS", "S", "M", "L", "XL"].map((x) =>
      this.toOptions(x)
    );
    const qhacksBusOptions = ["yes", "no"].map((x) => this.toOptions(x));

    const inputRowStyle = `
      width: 100%;
      display: flex;
      flex-direction: row;
      @media (max-width: ${mobileMaxWidth}) {
        flex-direction: column;
      }
      margin-top:12px;
      align-items: stretch;
      label, input {
          display: block;
      }
      >div{
          flex-grow: 1;
          @media (max-width: ${mobileMaxWidth}) {
            min-width: 100%;
          }
          min-width: 50%;
          padding: 4px;
      }
    `;

    return (
      <div
        css={`
          color: #252525;
          div h1,
          div h2,
          div h3 {
            color: #252525 !important;
          }
          h1 {
            font-size: 28px;
          }
          h2 {
            font-size: 24px;
          }
          p {
            margin: 12px 0;
          }
        `}
      >
        <DashboardMenu />
        <div
          css={`
            margin-top: 84px;
            padding: 28px 48px;
            background-color: white;
            box-shadow: 0 2px 16px 0 rgba(212, 217, 225, 0.4);
          `}
        >
          <Link to="/profile">Back to my dashboard</Link>
          <h1>RSVP to QHacks 2019</h1>
        </div>
        <div
          css={`
            padding: 56px 0;
            text-align: center;
            margin: 0 auto;
            max-width: 784px;
          `}
        >
          <h2
            css={`
              margin-bottom: 8px;
            `}
          >
            We are so excited you are coming to QHacks 2019!
          </h2>
          <p
            css={`
              font-size: 15px;
            `}
          >
            Please fill out this form so we can prepare for your stay.
          </p>
          <div
            css={`
              margin-top: 70px;
            `}
          >
            <section css={inputRowStyle}>
              <div>
                <label htmlFor="pronoun">Pronoun (optional)</label>
                <input
                  id="pronoun"
                  onChange={(e) => this.setState({ pronoun: e.target.value })}
                  value={this.state.pronoun}
                  type="text"
                />
              </div>
              <div>
                <label htmlFor="shirtSize">Shirt size</label>
                <Select
                  options={shirtSizeOptions}
                  id="shirtSize"
                  key="shirtSize"
                  className="select"
                  value={this.state.shirtSize}
                  onChange={this.setSelectAnswer("shirtSize")}
                />
              </div>
            </section>
            <section css={inputRowStyle}>
              <div>
                <label htmlFor="dietaryRestrictions">
                  Dietary restrictions
                </label>
                <input
                  id="dietaryRestrictions"
                  type="text"
                  onChange={(e) =>
                    this.setState({ dietaryRestrictions: e.target.value })
                  }
                  value={this.state.dietaryRestrictions}
                />
              </div>
            </section>
            <section
              css={`
                margin-top: 32px;
              `}
            >
              <div>
                <label>Areas of interest</label>
                <div
                  css={`
                    display: flex;
                    width: 100%;
                    padding: 16px 24px 32px;
                    > div {
                      width: 50%;
                      height: 100%;
                      display: flex;
                      flex-direction: column;
                      text-align: left;
                      label {
                        color: #252525 !important;
                        margin-left: 4px;
                        font-weight: regular;
                      }
                    }
                  `}
                >
                  <div>
                    <div>
                      <Checkbox
                        id="interest-aiMl"
                        {...checkboxOptions}
                        checked={this.state["interest-aiMl"]}
                        onChange={(bool) =>
                          this.setState({ "interest-aiMl": bool })
                        }
                      />
                      <label htmlFor="interest-aiMl">AI/ML</label>
                    </div>
                    <div>
                      <Checkbox
                        id="interest-blockchain"
                        {...checkboxOptions}
                        checked={this.state["interest-blockchain"]}
                        onChange={(bool) =>
                          this.setState({ "interest-blockchain": bool })
                        }
                      />
                      <label htmlFor="interest-blockchain">Blockchain</label>
                    </div>
                    <div>
                      <Checkbox
                        id="interest-arVr"
                        {...checkboxOptions}
                        checked={this.state["interest-arVr"]}
                        onChange={(bool) =>
                          this.setState({ "interest-arVr": bool })
                        }
                      />
                      <label htmlFor="interest-arVr">AR/VR</label>
                    </div>
                    <div>
                      <Checkbox
                        id="interest-mobile"
                        {...checkboxOptions}
                        checked={this.state["interest-mobile"]}
                        onChange={(bool) =>
                          this.setState({ "interest-mobile": bool })
                        }
                      />
                      <label htmlFor="interest-mobile">Mobile</label>
                    </div>
                    <div>
                      <Checkbox
                        id="interest-webDevelopment"
                        {...checkboxOptions}
                        checked={this.state["interest-webDevelopment"]}
                        onChange={(bool) =>
                          this.setState({ "interest-webDevelopment": bool })
                        }
                      />
                      <label htmlFor="interest-webDevelopment">
                        Web Development
                      </label>
                    </div>
                  </div>
                  <div>
                    <div>
                      <Checkbox
                        id="interest-productManagement"
                        {...checkboxOptions}
                        checked={this.state["interest-productManagement"]}
                        onChange={(bool) =>
                          this.setState({ "interest-productManagement": bool })
                        }
                      />
                      <label htmlFor="interest-productManagement">
                        Product Management
                      </label>
                    </div>
                    <div>
                      <Checkbox
                        id="interest-entrepreneurship"
                        {...checkboxOptions}
                        checked={this.state["interest-entrepreneurship"]}
                        onChange={(bool) =>
                          this.setState({ "interest-entrepreneurship": bool })
                        }
                      />
                      <label htmlFor="interest-entrepreneurship">
                        Entrepreneurship
                      </label>
                    </div>
                    <div>
                      <Checkbox
                        id="interest-openSource"
                        {...checkboxOptions}
                        checked={this.state["interest-openSource"]}
                        onChange={(bool) =>
                          this.setState({ "interest-openSource": bool })
                        }
                      />
                      <label htmlFor="interest-openSource">Open Source</label>
                    </div>
                    <div>
                      <Checkbox
                        id="interest-interviewPrep"
                        {...checkboxOptions}
                        checked={this.state["interest-interviewPrep"]}
                        onChange={(bool) =>
                          this.setState({ "interest-interviewPrep": bool })
                        }
                      />
                      <label htmlFor="interest-interviewPrep">
                        Interview Prep
                      </label>
                    </div>
                    <div>
                      <Checkbox
                        id="interest-diversityInclusion"
                        {...checkboxOptions}
                        checked={this.state["interest-diversityInclusion"]}
                        onChange={(bool) =>
                          this.setState({ "interest-diversityInclusion": bool })
                        }
                      />
                      <label htmlFor="interest-diversityInclusion">
                        Diversity & Inclusion
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section css={inputRowStyle}>
              <div>
                <label htmlFor="travelOrigin">
                  Where are you travelling from?
                </label>
                <input
                  type="text"
                  id="travelOrigin"
                  placeholder="Location"
                  onChange={(e) =>
                    this.setState({ travelOrigin: e.target.value })
                  }
                  value={this.state.travelOrigin}
                />
              </div>
            </section>
            <section css={inputRowStyle}>
              <div>
                <label htmlFor="qhacksBus">
                  Will you be travelling using a QHacks bus?
                </label>
                <Select
                  options={qhacksBusOptions}
                  id="qhacksBus"
                  key="qhacksBus"
                  className="select"
                  value={this.state.qhacksBus}
                  onChange={this.setSelectAnswer("qhacksBus")}
                />
              </div>
            </section>
          </div>
          <p
            css={`
              color: #5b5b5b;
              font-size: 16px;
              padding-bottom: 56px;
            `}
          >
            Busses will be travelling to Kingston, ON, from the following
            locations: Toronto, Waterloo, and London
          </p>
          <ActionButton color="blue">RSVP</ActionButton>
          <br />
          <button
            css={`
              cursor: pointer;
              margin-top: 16px;
              background-color: white;
              border: none;
              color: #646464;
            `}
          >
            Withdraw Application
          </button>
        </div>
      </div>
    );
  }
}

export default Rsvp;
