import React from "react";
import { render } from "react-dom";
import "./styles/style.scss";
import Routes from "./Routes";

interface IProp {
  apple: string;
}

const App: React.FunctionComponent<IProp> = (props) => {
  return <Routes />;
};

render(<App apple="green" />, document.getElementById("root"));
