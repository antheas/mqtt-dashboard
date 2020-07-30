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
              <Link to="/settings">Settings</Link>
            </li>
            <Switch>
              <Route
                path="/dashboard/:id"
                component={({
                  match: {
                    params: { id },
                  },
                }: {
                  match: { params: { id: string } };
                }) => (
                  <li className="header__item">
                    <Link to={`/builder/${id}`}>Edit</Link>
                  </li>
                )}
              />
            </Switch>
          </ul>
        </nav>

        <Switch>
          <Route
            path="/dashboard/:id"
            component={({
              match: {
                params: { id },
              },
            }: {
              match: { params: { id: string } };
            }) => <Dashboard id={id} />}
          />
          <Route
            path="/builder/:id"
            component={({
              match: {
                params: { id },
              },
            }: {
              match: { params: { id: string } };
            }) => <Builder id={id} />}
          />
          <Route path="/builder">
            <Builder />
          </Route>
          <Route path="/">
            <Overview />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default Routes;
