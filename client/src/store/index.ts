import { createStore, applyMiddleware, Middleware, compose } from "redux";

import rootReducer from "./reducers";
import fillTestData from "./test";

const middleware: Middleware[] = [];

// Add redux dev tool
let composeEnhancers = compose;
if (process.env.NODE_ENV !== "production") {
  /* eslint-disable no-underscore-dangle, @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  /* eslint-enable */
}

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

fillTestData(store.dispatch);

export default store;
