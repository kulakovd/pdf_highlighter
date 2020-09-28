// @flow

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

function init(props, phrases, root) {
  if (typeof root === 'string') root = document.querySelector(root);
  ReactDOM.render(
    <App {...props}/>,
    root
  )
}

export { init };
