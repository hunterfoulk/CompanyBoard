import React, { useEffect, useState, useRef } from "react";
import "./board.scss";
import useBoards from "../../components/actions/boardactions";
import { useStateValue } from "../../state";
import { FiPlus } from "react-icons/fi";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import useInput from "../../components/hooks/useInput";
import { MdClose } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import { Modal } from "godspeed";

export default function Board() {
  const {
    getMyBoards,
    getJoinedBoards,
    getCurrentBoard,
    createNewStatus,
    getCurrentBoardStatuses,
    createNewTask,
    updateTaskName,
  } = useBoards();
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
  const [createClicked, setCreateClicked] = useState(false);
  const [fixed, setFixed] = useState(false);
  const statusName = useInput("");
  const taskName = useInput("");
  const [editDefault, setEditDefault] = useState("");
  const dragTask = useRef();
  const dragNode = useRef();
  const [dragging, setDragging] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      name: statusName.value,
      board_id: currentBoardUsers.board.board_id,
    };

    let clearForm = () => {
      statusName.setValue("");
    };

    createNewStatus(payload, clearForm);
  };

  const fullPath = window.location.pathname;
  let board_id = window.location.pathname.replace("/board/", "");

  useEffect(() => {
    getCurrentBoard(board_id);
    getCurrentBoardStatuses(board_id);

    return () => {
      dispatch({
        type: "RESET_BOARDS",
      });
    };
  }, [fullPath]);

  const toggle = (status, index) => {
    setFixed(true);
    let copy = [...currentBoardData.statuses];

    copy[index].open = true;

    dispatch({
      type: "CURRENT_BOARD_STATUSES",
      currentBoardData: {
        ...currentBoardData,
        statuses: copy,
      },
    });
  };

  const toggleHoveringOn = (task_id, index) => {
    let copy = [...currentBoardData.statuses];
    copy.map((status, i) => {
      if (i === index) {
        status.tasks.map((task, i) => {
          if (task.task_id === task_id) {
            // console.log("tasks", task);
            task.hovering = true;
          }
        });
      }
    });
    dispatch({
      type: "CURRENT_BOARD_STATUSES",
      currentBoardData: {
        ...currentBoardData,
        statuses: copy,
      },
    });
  };

  const toggleHoveringOff = (task_id, index) => {
    let copy = [...currentBoardData.statuses];
    copy.map((status, i) => {
      if (i === index) {
        status.tasks.map((task, i) => {
          if (task.task_id === task_id) {
            task.hovering = false;
          }
        });
      }
    });
    dispatch({
      type: "CURRENT_BOARD_STATUSES",
      currentBoardData: {
        ...currentBoardData,
        statuses: copy,
      },
    });
  };

  const closeToggle = (status_id, index) => {
    console.log("status id for close", status_id);

    let copy = [...currentBoardData.statuses];
    console.log("copy index", copy[index]);
    copy[index].open = false;

    dispatch({
      type: "CURRENT_BOARD_STATUSES",
      currentBoardData: {
        ...currentBoardData,
        statuses: copy,
      },
    });
  };

  const HandleNewTask = (status_id) => {
    console.log("status id clicked", status_id);
    let user_id = auth.user.user_id;

    let payload = {
      user_id: user_id,
      status_id: status_id,
      message: taskName.value,
      board_id: board_id,
    };

    let clearForm = () => {
      taskName.setValue("");
    };
    taskName.setValue("");
    createNewTask(payload, clearForm);
  };

  const [editId, setEditId] = useState({});
  const handleEdit = (task_id, index) => {
    let copy = [...currentBoardData.statuses];

    copy.map((status, i) => {
      if (i === index) {
        status.tasks.map((task, i) => {
          if (task.task_id === task_id) {
            console.log("this is task", task);
            setEditId(task);

            task.editing = true;
          }
        });
      }
    });
    console.log("edit id", editId);

    dispatch({
      type: "CURRENT_BOARD_STATUSES",
      currentBoardData: {
        ...currentBoardData,
        statuses: copy,
      },
    });
  };

  const handleEditClose = (task_id, index) => {
    console.log("FIRED");
    let copy = [...currentBoardData.statuses];
    console.log(task_id);
    copy.map((status, i) => {
      if (i === index) {
        status.tasks.map((task, i) => {
          console.log("task id for close", task_id);
          console.log(task);
          setEditId({});
          task.editing = false;
          task.hovering = false;
          task.editingName = false;
        });
      }
    });

    dispatch({
      type: "CURRENT_BOARD_STATUSES",
      currentBoardData: {
        ...currentBoardData,
        statuses: copy,
      },
    });
  };

  const editNameHandler = (task_id, index) => {
    console.log(task_id);

    let copy = [...currentBoardData.statuses];
    console.log(task_id);
    copy.map((status, i) => {
      if (i === index) {
        status.tasks.map((task, i) => {
          console.log("task id for close", task_id);
          console.log(task);
          setEditId(task);
          task.editingName = true;
          setEditDefault(task.message);
        });
      }
    });

    dispatch({
      type: "CURRENT_BOARD_STATUSES",
      currentBoardData: {
        ...currentBoardData,
        statuses: copy,
      },
    });
  };

  const handleEditNameSubmit = async (e, task_id, index) => {
    e.preventDefault();
    console.log("name", editDefault);
    console.log("task_id", editId.task_id);
    console.log("this is the task_id", task_id);

    const payload = {
      task_id: editId.task_id,
      message: editDefault,
      board_id: board_id,
    };
    await updateTaskName(payload);

    let copy = [...currentBoardData.statuses];
    console.log(task_id);
    copy.map((status, i) => {
      if (i === index) {
        status.tasks.map((task, i) => {
          task.editingName = false;
          task.hovering = false;
          task.editing = false;
          setEditDefault("");
        });
      }
    });

    dispatch({
      type: "CURRENT_BOARD_STATUSES",
      currentBoardData: {
        ...currentBoardData,
        statuses: copy,
      },
    });
  };

  console.log("drag node", dragNode);

  const handleDragStart = (e, params) => {
    console.log("task id for drag", params.i);

    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    dragTask.current = params;
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnd = (e) => {
    console.log("ending drag...");
    setDragging(false);
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    dragTask.current = null;
    dragNode.current = null;
  };

  const handleDragEnter = (e, targetItem) => {
    let newList = [...currentBoardData.statuses];

    if (e.target !== dragNode.current) {
      console.log("TARGET IS NOT THE SAME");
      newList[targetItem.index].tasks.splice(
        targetItem.i,
        0,
        newList[dragTask.current.index].tasks.splice(dragTask.current.i, 1)[0]
      );
      dragTask.current = targetItem;
    }
  };

  console.log("CURRENTTT", dragTask.current);

  const getStyles = (params) => {
    const taskBeingDragged = dragTask.current;
    if (
      taskBeingDragged.index === params.index &&
      dragTask.current.i === params.i
    ) {
      return "dragging-task";
    } else {
      return "task";
    }
  };

  if (dragging) {
    console.log("i am dragging");
  }

  return (
    <>
      <div className="current-board-main">
        {components.backdrop && <div className="backdrop"></div>}
        <div className="board-header">
          <div className="board-header-left">
            <span className="board-name">
              {currentBoardUsers.board.board_name}
            </span>
          </div>
          <div className="board-header-right">
            <span>Members: </span>
            <img src={currentBoardUsers.board.profilepic} />
          </div>
        </div>
        <div className="board-bottom">
          <div className="board-main-left">
            {createClicked ? (
              <div className="create-input-container">
                <label>Create new status</label>
                <form onSubmit={(e) => handleSubmit(e)}>
                  <input
                    type="text"
                    value={statusName.value}
                    onChange={statusName.onChange}
                  />
                  <div className="create-buttons-container">
                    <button
                      className="create-button"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Create New
                    </button>
                    <span>
                      <MdClose
                        className="exit"
                        onClick={() => setCreateClicked(false)}
                      />
                    </span>
                  </div>
                </form>
              </div>
            ) : (
              <button onClick={() => setCreateClicked(true)}>
                <FiPlus className="plus" /> Create status list
              </button>
            )}
          </div>
          <div className="board-main-right">
            {currentBoardData.statuses.map((status, index) => (
              <div
                className="status-container"
                onDragEnter={
                  dragging && !status.tasks.length
                    ? (e) => handleDragEnter(e, { index, i: 0 })
                    : null
                }
              >
                <div className="status-header">
                  <span className="status-name">{status.name}</span>

                  <span className="status-dots">
                    <FiMoreHorizontal />
                  </span>
                </div>
                <div className="tasks-container">
                  {status.tasks.map((task, i) => (
                    <>
                      <>
                        <div
                          draggable="true"
                          className={
                            dragging ? getStyles({ index, i }) : "task"
                          }
                          onDragEnter={
                            dragging
                              ? (e) => {
                                  handleDragEnter(e, { index, i });
                                }
                              : null
                          }
                          onDragStart={(e) => {
                            handleDragStart(e, { index, i });
                          }}
                          onMouseEnter={() =>
                            toggleHoveringOn(task.task_id, index)
                          }
                          onMouseLeave={() =>
                            toggleHoveringOff(task.task_id, index)
                          }
                        >
                          <span>{task.message}</span>
                          {task.hovering ? (
                            <MdEdit
                              className="task-edit-pen"
                              onClick={() => handleEdit(task.task_id, index)}
                            />
                          ) : null}
                        </div>
                      </>
                    </>
                  ))}
                </div>

                <div className="status-footer">
                  {status.open ? (
                    <div className="status-footer">
                      <div className="new-task-window">
                        <form
                          className="new-task-form"
                          onSubmit={() => HandleNewTask(status.status_id)}
                        >
                          <textarea
                            placeholder=""
                            value={taskName.value}
                            onChange={taskName.onChange}
                          />
                        </form>
                        <div className="new-task-button-container">
                          <button
                            className="add-button"
                            onClick={() => HandleNewTask(status.status_id)}
                          >
                            Add
                          </button>
                          <MdClose
                            className="close-task-popup"
                            onClick={() => closeToggle(status.status_id, index)}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <IoMdAdd
                        style={{ marginRight: "5px", cursor: "pointer" }}
                      />

                      <span
                        onClick={() => toggle(status.status_id, index)}
                        style={{ cursor: "pointer" }}
                      >
                        Add task
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
