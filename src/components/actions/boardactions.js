import axios from "axios";
import api from "../services/api";
import { useStateValue } from "../../state";
import { Link, useHistory } from "react-router-dom";

const useBoards = () => {
  const [
    { auth, components, currentBoardUsers, joinedBoards, currentBoardData },
    dispatch,
  ] = useStateValue();

  const getMyBoards = async (user_id) => {
    const queryParams = { params: { user_id } };

    axios
      .get(
        "http://localhost:9000/.netlify/functions/server/companyboard/mycreatedboards",
        queryParams
      )
      .then((res) => {
        console.log("created boards", res.data);

        dispatch({
          type: "MY_BOARDS",
          createdBoards: {
            isAuthenticated: false,
            boards: res.data,
          },
        });
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const getJoinedBoards = async (user_id) => {
    const queryParams = { params: { user_id } };

    axios
      .get(
        "http://localhost:9000/.netlify/functions/server/companyboard/joinedboards",
        queryParams
      )
      .then((res) => {
        console.log("joined boards", res.data);

        dispatch({
          type: "JOINED_BOARDS",
          joinedBoards: {
            isAuthenticated: false,
            boards: res.data,
          },
        });
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const getCurrentBoard = async (board_id) => {
    const queryParams = { params: { board_id } };
    axios
      .get(
        `http://localhost:9000/.netlify/functions/server/companyboard/board/${board_id}`,
        queryParams
      )
      .then((res) => {
        console.log("current board", res.data);

        dispatch({
          type: "CURRENT_BOARD_USERS",
          currentBoardUsers: {
            isAuthenticated: false,
            board: res.data,
          },
        });
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const getCurrentBoardStatuses = async (board_id) => {
    const queryParams = { params: { board_id } };

    axios
      .get(
        `http://localhost:9000/.netlify/functions/server/companyboard/board/${board_id}/statuses`,
        queryParams
      )
      .then(async (res) => {
        console.log("current board 83", res.data);
        let response = res.data;
        response.forEach((response) => {
          response.open = false;
          response.editer = false;
          response.editingName = false;
        });
        await attachTasks(response);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const attachTasks = (response) => {
    console.log("fired");
    console.log("attach response", response);
    let count = 0;
    response.forEach((status, i) => {
      let status_id = status.status_id;
      const queryParams = { params: { status_id } };
      console.log("for each log", status_id);
      axios
        .get(
          `http://localhost:9000/.netlify/functions/server/companyboard/tasks`,
          queryParams
        )
        .then((res) => {
          count++;
          response[i].tasks = res.data;
          res.data.forEach((res) => {
            res.hovering = false;
            res.editing = false;
            res.editingName = false;
          });

          if (count === response.length) {
            dispatch({
              type: "CURRENT_BOARD_STATUSES",
              currentBoardData: {
                ...currentBoardData,
                statuses: response,
              },
            });
            console.log("current status data", response);
          }
        })
        .catch((error) =>
          console.error("statuses not fetched succesfully", error)
        );
    });
  };

  const createNewStatus = async (payload, clearForm) => {
    console.log("payload", payload);
    console.log("payload board id", payload.board_id);
    let board_id = payload.board_id;
    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/createstatus`,
        payload
      )
      .then((res) => {
        console.log("new board status", res.data);
        getCurrentBoardStatuses(board_id);
        clearForm();
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const createNewTask = async (payload, clearForm) => {
    console.log("payload", payload);
    console.log("payload board id", payload.board_id);
    let board_id = payload.board_id;
    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/newtask`,
        payload
      )
      .then((res) => {
        console.log("new new task", res.data);
        getCurrentBoardStatuses(board_id);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const updateTaskName = async (payload, clearForm) => {
    console.log("payload", payload);
    console.log("payload board id", payload.board_id);
    let board_id = payload.board_id;
    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/updatetaskname`,
        payload
      )
      .then(async (res) => {
        console.log("new task name ", res.data);
        await getCurrentBoardStatuses(board_id);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const updateStatusName = async (payload, clearForm) => {
    console.log("payload", payload);
    console.log("payload board id", payload.board_id);
    let board_id = payload.board_id;
    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/updatestatusname`,
        payload
      )
      .then(async (res) => {
        console.log("new status name ", res.data);
        await getCurrentBoardStatuses(board_id);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const deleteTask = async (payload, clearForm) => {
    console.log("payload", payload);
    console.log("payload board id", payload.board_id);
    let board_id = payload.board_id;
    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/deletetask`,
        payload
      )
      .then(async (res) => {
        console.log("task deleted succesfully ", res.data);
        await getCurrentBoardStatuses(board_id);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  return {
    getMyBoards,
    getJoinedBoards,
    getCurrentBoard,
    createNewStatus,
    getCurrentBoardStatuses,
    createNewTask,
    updateTaskName,
    updateStatusName,
    deleteTask,
  };
};

export default useBoards;
