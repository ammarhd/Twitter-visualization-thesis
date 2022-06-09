import "./App.css";
import TimeV from "./components/TimeV";

import Header from "./components/header/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//import Graph from "./components/Graph";

function App() {
  return (
    <div className="bg-gray-700 min-h-screen  min-w-screen">
      <div className="bg-indigo-900 bg-opacity-50 min-h-screen  min-w-screen">
        <div className="flex flex-col space-y-5 pt-36">
          <TimeV />
        </div>
      </div>
    </div>
  );
}

export default App;
