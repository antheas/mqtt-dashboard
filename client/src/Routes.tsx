import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Overview from "./pages/Overview";

const Routes: React.FunctionComponent = () => {
  return (
    <Router>
      <div className="container">
        <nav>
          <ul className="header">
            <li className="header__item">
              <Link to="/">Home</Link>
            </li>
            <li className="header__item">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="header__item">
              <Link to="/builder">Builder</Link>
            </li>
          </ul>
        </nav>

        <div className="content">
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/builder">
              <Builder />
            </Route>
            <Route path="/">
              <Overview />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default Routes;
