import { createStore, applyMiddleware, Middleware, compose } from "redux";

import rootReducer from "./reducers";

const middleware: Middleware[] = [];

// Add redux dev tool
let composeEnhancers = compose;
if (process.env.NODE_ENV !== "production") {
  /* eslint-disable no-underscore-dangle, @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  /* eslint-enable */
}

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
