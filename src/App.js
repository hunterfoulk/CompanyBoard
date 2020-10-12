import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import "./App.scss";

import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Home from "./pages/home/home";
import Boards from "./pages/boards/boards";
import { useStateValue } from "./state";
import Board from "./pages/currentboard/board";
import Searchresults from "./pages/searchresults/searchresults";
import Sidebar from "./components/sidebar/sidebar";
import useBoards from "./components/actions/boardactions";
import { Modal } from "godspeed";
import SearchPage from "./pages/search/searchpage";
import useUpdate from "./components/actions/update";
import { Link, useHistory } from "react-router-dom";
import Categorysearch from "./pages/search/categorysearch";

const App = () => {
  const [
    { auth, components, joinedBoards, currentBoardUsers, currentBoardData },
    dispatch,
  ] = useStateValue();

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

          {/* <Navbar /> */}

          <Route
            exact
            path="/home"
            render={() => (
              <>
                <Sidebar />
                <Home />
              </>
            )}
          ></Route>

          <Route
            exact
            path="/board/:board_id"
            render={() => (
              <>
                <Sidebar />
                <Board />
              </>
            )}
          ></Route>

          <Route
            exact
            path="/search"
            render={() => (
              <>
                <Sidebar />
                <SearchPage />
              </>
            )}
          ></Route>

          <Route
            exact
            path="/searchresults/:searchterm"
            render={() => (
              <>
                <Sidebar />
                <Searchresults />
              </>
            )}
          ></Route>

          <Route
            exact
            path="/categories/:category"
            render={() => (
              <>
                <Sidebar />
                <Categorysearch />
              </>
            )}
          ></Route>
        </div>
      </Router>
    </>
  );
};

export default App;
