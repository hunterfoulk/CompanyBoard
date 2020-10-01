import React, { useState, useEffect } from "react";
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
import Searchresults from "./pages/searchresults/searchresults";
import Sidebar from "./components/sidebar/sidebar";
import useBoards from "./components/actions/boardactions";

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
  const { getMyBoards, getJoinedBoards, filterBoardData } = useBoards();
  useEffect(() => {
    getMyBoards(user_id);
    getJoinedBoards(user_id);
  }, []);

  const user_id = auth.user.user_id;

  return (
    <>
      <Router>
        <div className="app-container">
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
          <Navbar />
          <div className="components-container">
            <div className="components-container-left">
              <Sidebar />
            </div>
            <div className="components-container-right">
              <Route
                exact
                path="/home"
                render={() => (
                  <>
                    <Home />
                  </>
                )}
              ></Route>

              <Route
                exact
                path="/board/:board_id"
                render={() => (
                  <>
                    <Board />
                  </>
                )}
              ></Route>

              <Route
                exact
                path="/searchresults/:searchterm"
                render={() => (
                  <>
                    <Searchresults />
                  </>
                )}
              ></Route>
            </div>

            {/* <Route
              exact
              path="/home"
              render={() => (
                <>
                  <Home />
                </>
              )}
            ></Route> */}

            <Route
              exact
              path="/createboard"
              render={() => (
                <>
                  <CreateBoard />
                </>
              )}
            ></Route>

            {/* <Route
              exact
              path="/boards"
              render={() => (
                <>
                  <Boards />
                </>
              )}
            ></Route> */}

            {/* <Route
              exact
              path="/board/:board_id"
              render={() => (
                <>
                  <Board />
                </>
              )}
            ></Route>

            <Route
              exact
              path="/searchresults/:searchterm"
              render={() => (
                <>
                  <Searchresults />
                </>
              )}
            ></Route> */}
          </div>
        </div>
      </Router>
    </>
  );
};

export default App;
