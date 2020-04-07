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
          Source code available at{" "}
          <a
            href="https://github.com/smilep/safety-checker"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </span>
      </div>
    </div>
  );
}

export default App;
