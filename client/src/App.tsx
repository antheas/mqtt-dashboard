import React from "react";
import { render } from "react-dom";
import Routes from "./Routes";
import store from "./store";
import "./styles/style.scss";
import { Provider } from "react-redux";

const App = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

render(<App />, document.getElementById("root"));
