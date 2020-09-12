import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import Navbar from "./components/navbar/navbar";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Home from "./pages/home/home";
import Boards from "./pages/boards/boards";
import CreateBoard from "./components/createboard/createboard";
import { useStateValue } from "./state";
import Board from "./pages/currentboard/board";

const App = () => {
  const [
    {
      auth,
      components,
      createdBoards,
      joinedBoards,
      currentBoardUsers,
      currentBoardData,
    },
    dispatch,
  ] = useStateValue();

  return (
    <>
      <Router>
        <div className="app-container">
          {components.backdrop && <div className="backdrop"></div>}
          <Route
            exact
            path="/"
            render={() => (
              <>
                <Login />
              </>
            )}
          ></Route>

          <Route
            exact
            path="/signup"
            render={() => (
              <>
                <Signup />
              </>
            )}
          ></Route>

          <Route
            exact
            path="/home"
            render={() => (
              <>
                <Navbar />
                <Home />
              </>
            )}
          ></Route>

          <Route
            exact
            path="/createboard"
            render={() => (
              <>
                <Navbar />
                <CreateBoard />
              </>
            )}
          ></Route>

          <Route
            exact
            path="/boards"
            render={() => (
              <>
                <Navbar />
                <Boards />
              </>
            )}
          ></Route>

          <Route
            exact
            path="/board/:board_id"
            render={() => (
              <>
                <Navbar />
                <Board />
              </>
            )}
          ></Route>
        </div>
      </Router>
    </>
  );
};

export default App;
