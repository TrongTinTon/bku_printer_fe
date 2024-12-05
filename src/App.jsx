/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Router from "./routes/index.jsx";
import { App as AntdApp } from "antd";
import FontAwesomeLibrary from "./components/FontAwesome/index.jsx";

function App() {
  return (
    <AntdApp>
      <FontAwesomeLibrary />
      <Router />
    </AntdApp>
  );
}

export default App;
