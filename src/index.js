import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { StateProvider } from "./state";

const initialState = {
  auth: {
    isAuthenticated: false,
    token: "",
    user: {},
  },
  components: {
    profileDrawer: false,
    backdrop: false,
  },
  createdBoards: {
    isFetching: true,
    boards: [],
  },

  joinedBoards: {
    isFetching: true,
    boards: [],
  },
  currentBoardUsers: {
    isFetching: true,
    board: {},
    statuses: [],
  },
  currentBoardData: {
    isFetching: true,
    statuses: [],
  },
};

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");

if (user) {
  initialState.auth.isAuthenticated = true;
  initialState.auth.user = JSON.parse(user);
  initialState.auth.token = JSON.stringify(token);
}

console.log("this is index", initialState.auth.user);

const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        auth: action.auth,
      };
    case "logout":
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: {},
        },
      };
    case "update":
      return {
        ...state,
        auth: action.auth,
      };
    case "manage":
      return {
        ...state,
        components: action.components,
      };
    case "MY_BOARDS":
      return {
        ...state,
        createdBoards: action.createdBoards,
      };
    case "JOINED_BOARDS":
      return {
        ...state,
        joinedBoards: action.joinedBoards,
      };
    case "CURRENT_BOARD_USERS":
      return {
        ...state,
        currentBoardUsers: action.currentBoardUsers,
      };
    case "CURRENT_BOARD_STATUSES":
      return {
        ...state,
        currentBoardData: action.currentBoardData,
      };
    case "DELETE_TASK":
      return {
        ...state,
        currentBoardData: {
          statuses: state.currentBoardData.statuses.map((status, idx) =>
            idx === action.statusIdx
              ? {
                  ...status,
                  tasks: status.tasks.filter((task, i) => i !== action.taskIdx),
                }
              : status
          ),
        },
      };
    case "RESET_BOARDS":
      return {
        ...state,
        currentBoardUsers: {
          isFetching: true,
          board: {},
          statuses: [],
        },
        currentBoardData: {
          isFetching: true,
          statuses: [],
        },
      };

    default:
      return state;
  }
};

ReactDOM.render(
  <StateProvider initialState={initialState} reducer={reducer}>
    <App />
  </StateProvider>,
  document.getElementById("root")
);
