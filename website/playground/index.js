import "codemirror-graphql/mode";

import React from "react";
import ReactDOM from "react-dom";

import Playground from "./Playground";
import VersionLink from "./VersionLink";
import WorkerApi from "./WorkerApi";
import { fixPrettierVersion } from "./util";

class App extends React.Component {
  constructor() {
    super();
    this.state = { loaded: false };
    this.worker = new WorkerApi("/worker.js");
  }

  componentDidMount() {
    this.worker.getMetadata().then(({ supportInfo, version }) => {
      this.setState({
        loaded: true,
        availableOptions: supportInfo.options.map(augmentOption),
        version: fixPrettierVersion(version)
      });
    });
  }

  render() {
    const { loaded, availableOptions, version } = this.state;

    if (!loaded) {
      return "Loading...";
    }

    return (
      <React.Fragment>
        <VersionLink version={version} />
        <Playground
          worker={this.worker}
          availableOptions={availableOptions}
          version={version}
        />
      </React.Fragment>
    );
  }
}

function augmentOption(option) {
  option.cliName =
    "--" +
    (option.inverted ? "no-" : "") +
    option.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  if (option.type === "boolean" && option.default === true) {
    option.inverted = true;
  }

  return option;
}

ReactDOM.render(<App />, document.getElementById("root"));
