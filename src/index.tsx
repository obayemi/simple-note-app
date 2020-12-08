import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
//import { configureStore } from '@reduxjs/toolkit'
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import setupAxios from "./axios";
import "bootstrap/dist/css/bootstrap.min.css";

import reducer from "./reducers";

import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

setupAxios(store);
//export type AppDispatch = typeof store.dispatch
//export function useAppDispatch = () => useAppDispatch<AppDispatch>()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
