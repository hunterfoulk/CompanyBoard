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
      .then(async (res) => {
        console.log("created boards", res.data);
        let response = res.data;
        await attachCreatedUsers(response);
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
      .then(async (res) => {
        console.log("joined boards", res.data);
        const response = res.data;
        await attachJoinedUsers(response);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const attachCreatedUsers = (response) => {
    let count = 0;
    response.forEach((board, i) => {
      let board_id = board.board_id;
      const queryParams = { params: { board_id } };

      axios
        .get(
          `http://localhost:9000/.netlify/functions/server/companyboard/boardusers`,
          queryParams
        )
        .then((res) => {
          count++;
          response[i].users = res.data;
          console.log("attach users data", res.data);

          if (count === response.length) {
            dispatch({
              type: "MY_BOARDS",
              createdBoards: {
                isAuthenticated: false,
                boards: response,
              },
            });
            console.log("current board data", response);
          }
        })
        .catch((error) =>
          console.error("boards not fetched succesfully", error)
        );
    });
  };

  const attachJoinedUsers = (response) => {
    let count = 0;
    response.forEach((board, i) => {
      let board_id = board.board_id;
      const queryParams = { params: { board_id } };

      axios
        .get(
          `http://localhost:9000/.netlify/functions/server/companyboard/boardusers`,
          queryParams
        )
        .then((res) => {
          count++;
          response[i].users = res.data;
          console.log("attach users data", res.data);

          if (count === response.length) {
            dispatch({
              type: "JOINED_BOARDS",
              joinedBoards: {
                isAuthenticated: false,
                boards: response,
              },
            });
            console.log("current board data", response);
          }
        })
        .catch((error) =>
          console.error("boards not fetched succesfully", error)
        );
    });
  };

  const getCurrentBoard = async (board_id) => {
    const queryParams = { params: { board_id } };
    axios
      .get(
        `http://localhost:9000/.netlify/functions/server/companyboard/currentboard`,
        queryParams
      )
      .then(async (res) => {
        console.log("current board 555", res.data);
        let response = res.data;
        await attachCurrentBoardUsers(response);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const attachCurrentBoardUsers = (response) => {
    let count = 0;
    let board_id = response.board_id;
    const queryParams = { params: { board_id } };
    console.log("FETCH BOARD ID", board_id);
    axios
      .get(
        `http://localhost:9000/.netlify/functions/server/companyboard/boardusers`,
        queryParams
      )
      .then((res) => {
        count++;
        response.users = res.data;

        console.log("NEW RESPONSE", response);
        if (count > 0) {
          dispatch({
            type: "CURRENT_BOARD_USERS",
            currentBoardUsers: {
              isAuthenticated: false,
              board: response,
            },
          });
        }
        console.log("current board data", response);
      })
      .catch((error) => console.error("boards not fetched succesfully", error));
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

  const currentTask = async (task_id, clearForm) => {
    const queryParams = { params: { task_id } };
    axios
      .get(
        `http://localhost:9000/.netlify/functions/server/companyboard/currentTask`,
        queryParams
      )
      .then((res) => {
        console.log("CURRENT TASK", res.data);

        dispatch({
          type: "CURRENT_TASK",
          currentTaskData: {
            task: res.data,
          },
        });
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const updateDueDate = async (payload, clearForm) => {
    console.log("payload", payload);

    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/updateduedate`,
        payload
      )
      .then((res) => {
        console.log("task deleted succesfully ", res.data);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const updateLabel = async (payload, clearForm) => {
    console.log("payload", payload);
    let task_id = payload.task_id;
    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/updatelabel`,
        payload
      )
      .then(async (res) => {
        console.log("label data ", res.data);
        await currentTask(task_id);
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
    currentTask,
    updateLabel,
  };
};

export default useBoards;
