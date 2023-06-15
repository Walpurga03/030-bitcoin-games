import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Memory from "./pages/memory/memory";
import Quiz from "./pages/quiz/quiz";
import BtcMan from "./pages/btcman/btcman";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/memory" component={Memory} />
        <Route path="/Btc-man" component={BtcMan} />
        <Route path="/quiz" component={Quiz} />
      </Switch>
    </Router>
  );
}

export default App;
