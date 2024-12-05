import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import GlobalStyle from "./global/GlobalStyle/index.jsx";
import { persistor, store } from "./store/index.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter basename="/bku-printers">
        <GlobalStyle>
          <App />
        </GlobalStyle>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
