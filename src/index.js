//! default
import React from "react";
import ReactDOM from "react-dom";

//! styles
import "index.css";
import GlobalStyles from "assets/css/GlobalStyles";

//! components
import App from "components/App";

//! easy-peasy
import { StoreProvider } from "easy-peasy";
import store from "store";

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <GlobalStyles />
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
