import c from "classnames";

import React from "react";

import Header from "./Header";
import BadBrowser from "./BadBrowser";
import ToolBar from "./ToolBar";
import Chart from "./Chart";
import Link from "../common/Link";
import { Helmet } from "react-helmet";

import Export from "./sections/Export";
import { Info } from "./sections/Info";
import Polyphasic from "./sections/Polyphasic";
import Controls from "./sections/Controls";

import Cookies from "js-cookie";
import NotificationSystem from "react-notification-system";

import { ServerImpl } from "../../server/server_impl";
import { Server } from "../../server/server";
import { Grommet, Box, Button, Image, Text, Layer } from "grommet";
import { NapChart } from "./napchart";
import { worker } from "cluster";
const myTheme = {
  global: {
    colors: {
      brand: "#EA4335",
    },
  },
};

type AppProps = {
  server: Server;
  chartid: any;
};

type AppState = {
  napchart: NapChart | null;
  loading: boolean;
  url: string;
  chartid: any;
  title: string;
  description: string;
  currentSection: any;
  ampm: any;
  showPopup: boolean;
  slideSidebarMobile: any;
};
export default class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    console.log("7.nov 2019");
    let chartid: any = false;
    if (window.location.pathname.length == 6) {
      chartid = window.location.pathname.substring(1);
    }
    this.state = {
      napchart: null, // until it is initialized
      loading: false,
      url: window.location.origin + "/",
      chartid: chartid,
      title: "",
      description: "",
      currentSection: this.getInitialSection(),
      ampm: this.getAmpm(),
      showPopup: false,
      slideSidebarMobile: null,
    };
  }
  _notify: any = null;

  render() {
    var sections = [
      {
        element: (
          <Controls
            napchart={this.state.napchart}
            description={this.state.description}
            changeDescription={this.changeDescription}
          />
        ),
        text: "My Charts",
        title: "Chart controls",
      },
      {
        element: <Export url={this.state.url} chartid={this.state.chartid} />,
        text: "Share",
        title: "Share and export",
      },
      {
        element: <Polyphasic napchart={this.state.napchart} />,
        text: "Sleep",
        title: "Polyphasic Sleep",
      },
      {
        element: <Info ampm={this.state.ampm} setAmpm={this.setAmpm} />,
        text: "About",
        title: "About",
      },
    ];

    return (
      <Grommet theme={myTheme}>
        <div className="Editor">
          <BadBrowser name={null} />
          <NotificationSystem
            ref={(notificationSystem) => (this._notify = notificationSystem)}
          />
          <Helmet>
            {this.state.description.length && (
              <meta name="description" content={this.state.description} />
            )}
            <meta
              name="twitter:image"
              content={`http://thumb.napchart.com:1771/api/getImage?chartid=${this.state.chartid}&width=600&height=600&shape=circle`}
            />
            <meta
              property="og:image"
              content={`http://thumb.napchart.com:1771/api/getImage?chartid=${this.state.chartid}&width=600&height=600&shape=circle`}
            />
            <meta property="og:image:width" content="600" />
            <meta property="og:image:height" content="600" />
            {this.state.title.length && (
              <title>{`${this.state.title} - Napchart`}</title>
            )}
          </Helmet>
          <div
            className={c("grid", {
              slideSidebarMobile: this.state.slideSidebarMobile,
            })}
          >
            <div className="sidebar">
              <Header
                title={this.state.title}
                changeTitle={this.changeTitle}
                chartid={this.state.chartid}
                save={this.save}
                loading={this.state.loading}
              />

              <div className="sidebarContent">
                <div className="sideLane">
                  <div className="up">
                    {sections.map((section, i) => (
                      <button
                        onClick={this.changeSection.bind(null, i)}
                        key={i}
                        className={c("squareBtn", {
                          active: i == this.state.currentSection,
                        })}
                      >
                        {section.text}
                      </button>
                    ))}
                  </div>
                  <div className="down"></div>
                </div>

                <div className="otherLane">
                  <ToolBar
                    napchart={this.state.napchart}
                    title={sections[this.state.currentSection].title}
                  />
                  <div className="currentInfo">
                    {sections[this.state.currentSection].element}
                    <div
                      className="dz"
                      style={{
                        marginTop: 10,
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                        }}
                      >
                        <h2>
                          Neurotechnology for reduced nighttime awakenings.
                        </h2>
                        <p>
                          <a href="https://drowzee.com/">Drowzee</a> is
                          developing a neural interface to train your brain go
                          deeper into sleep and be less interruptive.
                        </p>
                        <p>
                          <a
                            target="_blank"
                            href="https://drowzee.com/waking-up-middle-of-night/"
                          >
                            <strong>
                              Waking up in the middle of the night?
                            </strong>
                          </a>
                        </p>
                      </div>
                      <div
                        style={{
                          width: "50%",
                        }}
                      >
                        <img src="/dz.png" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="main">
              <Chart
                napchart={this.state.napchart}
                onUpdate={this.somethingUpdate}
                setMetaInfo={this.setMetaInfo}
                setGlobalNapchart={this.setGlobalNapchart}
                onLoading={this.loading}
                onLoadingFinish={this.loadingFinish}
                ampm={this.state.ampm}
              />
            </div>
          </div>

          {this.state.slideSidebarMobile && (
            <button
              className="button is-light is-large slider left"
              onClick={this.slideSidebarMobile}
            >
              →
            </button>
          )}
          {!this.state.slideSidebarMobile && (
            <button
              className="button is-light is-large slider right"
              onClick={this.slideSidebarMobile}
            >
              ←
            </button>
          )}
        </div>
      </Grommet>
    );
  }

  slideSidebarMobile = () => {
    this.setState({
      slideSidebarMobile: !this.state.slideSidebarMobile,
    });
  };

  changeSection = (i) => {
    this.setState({
      currentSection: i,
    });
  };

  setGlobalNapchart = (napchart) => {
    this.setState({
      napchart: napchart,
    });
  };

  setMetaInfo = (title, description) => {
    console.log("title, description: ", title, description);
    this.setState({
      title,
      description,
    });
  };

  somethingUpdate = (napchart) => {
    this.forceUpdate();
  };

  loadingFinish = () => {
    this.setState({
      loading: false,
    });
  };

  loading = () => {
    this.setState({
      loading: true,
    });
  };

  save = () => {
    this.loading();
    var firstTimeSave = !this.props.chartid;
    this.props.server
      .save(this.state.napchart!.data, this.state.title, this.state.description)
      .then((chartid) => {
        console.error(chartid);
        // this.loadingFinish();
        // this.onSave(chartid);
      })
      .catch((err) => {
        console.error("things didn't work... " + err);
        this._notify.addNotification({
          message: err,
          level: "error",
        });
      });
  };

  onSave = (chartid) => {
    // refresh (feels better for the user)
    window.location.href = "/" + chartid + "?s=1";
  };

  changeTitle = (event) => {
    this.setState({
      title: event.target.value,
    });
  };

  changeDescription = (event) => {
    this.setState({
      description: event.target.value,
    });
  };

  setNumberOfLanes = (lanes) => {
    this.state.napchart!.setNumberOfLanes(lanes);
  };

  getAmpm = () => {
    const cookiePref = Cookies.get("preferAmpm");
    if (cookiePref) {
      return eval(cookiePref);
    }

    var date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0));
    var dateString = date.toLocaleTimeString();

    //apparently toLocaleTimeString() has a bug in Chrome. toString() however returns 12/24 hour formats. If one of two contains AM/PM execute 12 hour coding.
    if (dateString.match(/am|pm/i) || date.toString().match(/am|pm/i)) {
      return true;
    } else {
      return false;
    }
  };

  setAmpm = (ampm) => {
    Cookies.set("preferAmpm", ampm);

    this.setState({
      ampm: ampm,
    });
  };

  getInitialSection = () => {
    // should always return 0 except when s=1 found in url, because
    // then the user just saved chart and we will show share section instead

    if (window.location.toString().includes("s=1")) {
      // this.maybeVote()
      return 1;
    }

    return 0;
  };
}
