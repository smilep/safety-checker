import React from "react";
import "./App.css";
import Home from "./components/Home";

function App() {
  return (
    <div className="container">
      <hr />
      <div className="col-md-7">
        <Home />
      </div>
      <hr />
      <div className="col-md-7">
        <span className="developer-text">
          This is not an official website. Data sourced from{" "}
          <a
            href="https://github.com/CSSEGISandData/COVID-19"
            target="_blank"
            rel="noopener noreferrer"
          >
            Johns Hopkins CSSE
          </a>
          . Source code available at{" "}
          <a
            href="https://github.com/smilep/safety-checker"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>.
        </span>
      </div>
    </div>
  );
}

export default App;
