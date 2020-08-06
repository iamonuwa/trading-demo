import { createStore } from "redux";
import { combineReducers } from "redux";

import AggregationReducer from "./reducer";

const rootReducer = combineReducers({
  AggregationReducer,
});

const store = createStore(rootReducer);

export type AppState = ReturnType<typeof rootReducer>;

export default store;
