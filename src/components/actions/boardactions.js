import axios from "axios";
import api from "../services/api";
import { useStateValue } from "../../state";
import { Link, useHistory } from "react-router-dom";

const useBoards = () => {
  const [
    {
      auth,
      components,
      currentBoardUsers,
      joinedBoards,
      currentBoardData,
      popupMembers,
      boardRequests,
    },
    dispatch,
  ] = useStateValue();

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

  const getCurrentBoard = async (board_id, user_id) => {
    // let user_id = auth.user.user_id;
    const queryParams = { params: { board_id, user_id } };
    axios
      .get(
        `http://localhost:9000/.netlify/functions/server/companyboard/currentboard`,
        queryParams
      )
      .then(async (res) => {
        console.log("current board 555", res.data);
        let response = res.data;
        let responseMembers = response.members;
        console.log("THIS IS RESPONSE MEMBERS", response.members);
        await dispatch({
          type: "POPUP_MEMBERS",
          popupMembers: {
            members: responseMembers,
          },
        });
        response.members.forEach((member) => {
          member.hovering = false;
          member.clicked = false;
        });

        dispatch({
          type: "CURRENT_BOARD_USERS",
          currentBoardUsers: {
            isFetching: false,
            board: response,
          },
        });
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const getBoardRequests = async (board_id) => {
    // let user_id = auth.user.user_id;
    const queryParams = { params: { board_id } };
    axios
      .get(
        `http://localhost:9000/.netlify/functions/server/companyboard/boardrequests`,
        queryParams
      )
      .then(async (res) => {
        console.log("current board 555", res.data);
        let response = res.data;

        dispatch({
          type: "BOARD_REQUESTS",
          boardRequests: {
            isFetching: false,
            requests: response,
          },
        });
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const createBoard = async (payload) => {
    let formData = new FormData();
    let user_id = payload.user_id;
    formData.append("user_id", payload.user_id);
    formData.append("picFile", payload.picFile);
    formData.append("category", payload.category);
    formData.append("boardName", payload.boardName);

    let headers = {
      "Content-Type": "multipart/form-data",
    };

    await axios
      .post(
        "http://localhost:9000/.netlify/functions/server/companyboard/newboard",
        formData,
        {
          headers: headers,
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        getJoinedBoards(user_id);
      })

      .catch((error) => {
        console.error("error", error);
      });
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

        dispatch({
          type: "CURRENT_BOARD_STATUSES",
          currentBoardData: {
            ...currentBoardData,
            statuses: response,
          },
        });
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
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
    console.log("PAYLOAD FOR NEW TASK", payload);

    let board_id = payload.board_id;
    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/newtask`,
        payload
      )
      .then(async (res) => {
        console.log("NEW TASK DATA", res.data);
        await getCurrentBoardStatuses(board_id);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const updateTaskName = async (payload, clearForm) => {
    console.log("payload", payload);
    console.log("payload board id", payload.board_id);
    let board_id = payload.board_id;
    let task_id = payload.task_id;
    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/updatetaskname`,
        payload
      )
      .then(async (res) => {
        console.log("new task name ", res.data);
        await getCurrentBoardStatuses(board_id);
        await currentTask(task_id);
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
      .then(async (res) => {
        console.log("CURRENT TASK", res.data);
        let response = res.data;
        await attachTaskMembers(response);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const attachTaskMembers = (response) => {
    let count = 0;
    let task_id = response.task_id;
    const queryParams = { params: { task_id } };
    console.log("FETCH TASK ID", task_id);
    axios
      .get(
        `http://localhost:9000/.netlify/functions/server/companyboard/currenttaskmembers`,
        queryParams
      )
      .then((res) => {
        count++;
        response.members = res.data;
        console.log("board users data", res.data);

        console.log("NEW RESPONSE", response);
        if (count > 0) {
          dispatch({
            type: "CURRENT_TASK",
            currentTaskData: {
              task: response,
            },
          });
        }
        console.log("current board data", response);
      })
      .catch((error) => console.error("boards not fetched succesfully", error));
  };

  const updateDueDate = async (payload, clearForm) => {
    console.log("payload", payload);
    let task_id = payload.task_id;

    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/updateduedate`,
        payload
      )
      .then(async (res) => {
        console.log("task deleted succesfully ", res.data);
        await currentTask(task_id);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const updateLabel = async (payload, clearForm) => {
    console.log("payload", payload);
    let task_id = payload.task_id;
    let board_id = payload.board_id;
    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/updatelabel`,
        payload
      )
      .then(async (res) => {
        console.log("label data ", res.data);
        await currentTask(task_id);
        getCurrentBoardStatuses(board_id);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const updateTaskMembers = async (payload, clearForm) => {
    console.log("payload", payload);
    let task_id = payload.task_id;

    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/updatetaskmembers`,
        payload
      )
      .then(async (res) => {
        console.log("label data ", res.data);
        await currentTask(task_id);
        // getCurrentBoardStatuses(board_id);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const handleUpdateBoardPic = async (payload, clearForm) => {
    let user_id = auth.user.user_id;
    if (payload.boardPic) {
      let board_id = payload.board_id;
      let boardPic = payload.boardPic;
      let boardName = payload.boardName;
      let boardDescription = payload.boardDescription;
      let formData = new FormData();

      formData.append("boardPic", boardPic);
      formData.append("board_id", board_id);
      formData.append("boardName", boardName);
      formData.append("boardDescription", boardDescription);
      let headers = {
        "Content-Type": "multipart/form-data",
      };

      axios
        .post(
          `http://localhost:9000/.netlify/functions/server/companyboard/updateboardpic`,
          formData,
          {
            headers: headers,
            withCredentials: true,
          }
        )
        .then(async (res) => {
          console.log("new task name ", res.data);
          // await getCurrentBoardStatuses(board_id);
          await getCurrentBoard(board_id);
          getJoinedBoards(user_id);
        })
        .catch((error) =>
          console.error("videos not fetched succesfully", error)
        );
    } else {
      let board_id = payload.board_id;
      let boardName = payload.boardName;
      let boardDescription = payload.boardDescription;
      let formData = new FormData();

      formData.append("board_id", board_id);
      formData.append("boardName", boardName);
      formData.append("boardDescription", boardDescription);
      let headers = {
        "Content-Type": "multipart/form-data",
      };

      axios
        .post(
          `http://localhost:9000/.netlify/functions/server/companyboard/updateboardmisc`,
          formData,
          {
            headers: headers,
            withCredentials: true,
          }
        )
        .then(async (res) => {
          console.log("new board misc ", res.data);
          await getCurrentBoard(board_id);
          getJoinedBoards(user_id);
        })
        .catch((error) =>
          console.error("videos not fetched succesfully", error)
        );
    }
  };

  const acceptRequest = async (payload) => {
    console.log("payload", payload);
    let board_id = payload.board_id;

    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/acceptrequest`,
        payload
      )
      .then(async (res) => {
        console.log("label data ", res.data);
        getCurrentBoard(board_id);
        getCurrentBoardStatuses(board_id);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  const updateTaskStatus = async (payload) => {
    console.log("payload", payload);
    let board_id = payload.board_id;
    console.log(payload);

    axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/updatetaskstatus`,
        payload
      )
      .then(async (res) => {
        console.log("task status changed data ", res.data);
        // getCurrentBoard(board_id);
        // getCurrentBoardStatuses(board_id);
      })
      .catch((error) => console.error("videos not fetched succesfully", error));
  };

  return {
    getJoinedBoards,
    updateTaskStatus,
    getCurrentBoard,
    createNewStatus,
    getCurrentBoardStatuses,
    createNewTask,
    updateTaskName,
    updateStatusName,
    deleteTask,
    currentTask,
    updateLabel,
    updateTaskMembers,
    updateDueDate,
    handleUpdateBoardPic,
    createBoard,
    getBoardRequests,
    acceptRequest,
  };
};

export default useBoards;
