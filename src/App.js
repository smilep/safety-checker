import React from "react";
import "./App.css";
import Home from "./components/Home";

function App() {
  return (
    <div className="container">
      <Home />
      <hr />
      <span className='developer-text'>
        Developed with <span role='img' aria-label='heart emoji'>❤️</span> by Smile. Source code available at{" "}
        <a href="https://github.com/smilep/safety-checker" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </span>
    </div>
  );
}

export default App;
