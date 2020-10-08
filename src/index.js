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
  currentBoardData: {
    isFetching: true,
    statuses: [],
  },
  background: {
    color: "#FFFFFF",
  },
  searchResults: {
    results: [],
    isFetching: true,
  },
  currentBoardUsers: {
    isFetching: true,
    board: {},
  },
  currentTaskData: {
    task: {},
  },

  popupMembers: {
    members: [],
  },

  boardRequests: {
    isFetching: true,
    requests: [],
  },

  members: {
    name: "Members",
    label: "Members",
    checked: false,
  },

  labels: {
    name: "Labels",
    label: "Labels",
    checked: false,
  },

  dates: {
    name: "Dates",
    label: "Due dates",
    checked: false,
  },
};

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");
let dateSettings = localStorage.getItem("Dates-checkbox");
let membersSettings = localStorage.getItem("Members-checkbox");
let labelsSettings = localStorage.getItem("Labels-checkbox");

if (dateSettings) {
  initialState.dates = JSON.parse(dateSettings);
}
if (membersSettings) {
  initialState.members = JSON.parse(membersSettings);
}
if (labelsSettings) {
  initialState.labels = JSON.parse(labelsSettings);
}
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

    case "POPUP_MEMBERS":
      return {
        ...state,
        popupMembers: action.popupMembers,
      };

    case "FILTERED_POPUP_MEMBERS":
      return {
        ...state,
        popupMembers: {},
      };

    case "BOARD_REQUESTS":
      return {
        ...state,
        boardRequests: action.boardRequests,
      };

    case "CURRENT_BOARD_STATUSES":
      return {
        ...state,
        currentBoardData: action.currentBoardData,
      };

    case "CURRENT_TASK":
      return {
        ...state,
        currentTaskData: action.currentTaskData,
      };
    case "FILTER_BOARD_REQUESTS":
      return {
        ...state,
        boardRequests: {
          requests: state.boardRequests.requests.filter(
            (request) => request.user_id !== action.user_id
          ),
        },
      };
    case "DELETE_TASK":
      return {
        ...state,
        currentBoardData: {
          statuses: state.currentBoardData.statuses.map((status, idx) =>
            idx === action.statusId
              ? {
                  ...status,
                  tasks: status.tasks.filter((task, i) => i !== action.taskIdx),
                }
              : status
          ),
        },
      };
    case "HOVER_MEMBER":
      return {
        ...state,
        currentBoardUsers: {
          ...state.currentBoardUsers,
          board: {
            ...state.currentBoardUsers.board,
            members: state.currentBoardUsers.board.members.map((member, idx) =>
              member.user_id === action.memberId
                ? { ...member, hovering: true }
                : member
            ),
          },
        },
      };
    case "UNHOVER_MEMBER":
      return {
        ...state,
        currentBoardUsers: {
          ...state.currentBoardUsers,
          board: {
            ...state.currentBoardUsers.board,
            members: state.currentBoardUsers.board.members.map((member, idx) =>
              member.user_id === action.memberId
                ? { ...member, hovering: false }
                : member
            ),
          },
        },
      };

    case "CLICKED_MEMBER":
      return {
        ...state,
        currentBoardUsers: {
          ...state.currentBoardUsers,
          board: {
            ...state.currentBoardUsers.board,
            members: state.currentBoardUsers.board.members.map((member, idx) =>
              member.user_id === action.memberId
                ? { ...member, clicked: true }
                : member
            ),
          },
        },
      };
    case "UNCLICK_MEMBER":
      return {
        ...state,
        currentBoardUsers: {
          ...state.currentBoardUsers,
          board: {
            ...state.currentBoardUsers.board,
            members: state.currentBoardUsers.board.members.map((member, idx) =>
              member.user_id === action.memberId
                ? { ...member, clicked: false }
                : member
            ),
          },
        },
      };
    case "CHANGE_BACKGROUND":
      return {
        ...state,
        background: action.background,
      };

    case "MEMBERS_BOX":
      return {
        ...state,
        members: action.members,
      };
    case "LABELS_BOX":
      return {
        ...state,
        labels: action.labels,
      };
    case "DATES_BOX":
      return {
        ...state,
        dates: action.dates,
      };
    case "SEARCH_RESULTS":
      return {
        ...state,
        searchResults: action.searchResults,
      };
    case "CHECKBOXES":
      return {
        ...state,
        checkBoxes: action.checkBoxes,
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
