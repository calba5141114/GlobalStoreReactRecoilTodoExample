import * as React from "react";
import { render } from "react-dom";
import { Grommet, grommet } from "grommet";
import { RecoilRoot } from "recoil";

import App from "./App";

const rootElement = document.getElementById("root");
render(
  <React.StrictMode>
    <RecoilRoot>
      <Grommet theme={grommet}>
        <App />
      </Grommet>
    </RecoilRoot>
  </React.StrictMode>,
  rootElement
);
