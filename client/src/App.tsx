import React from "react";
import { render } from "react-dom";
import "./style.css";

interface IProp {
  apple: string;
}

const App: React.FunctionComponent<IProp> = (props) => {
  return (
    <div>
      <h1>Hello World!</h1>
      <picture>
        <img src={require("./img/meme.jpg").default} alt="Very good meme" />
      </picture>
    </div>
  );
};

render(<App apple="green" />, document.getElementById("root"));
