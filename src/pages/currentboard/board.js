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
import { FaArrowsAlt } from "react-icons/fa";
import { FaStream } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import { MdPersonOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdLabelOutline } from "react-icons/md";
import { MdPeopleOutline } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { FaRegWindowMaximize } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { Drawer } from "godspeed";
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
    updateStatusName,
    deleteTask,
    updateDueDate,
    currentTask,
    updateLabel,
  } = useBoards();
  const [
    {
      auth,
      components,
      createdBoards,
      joinedBoards,
      currentBoardUsers,
      currentBoardData,
      currentTaskData,
    },
    dispatch,
  ] = useStateValue();
  const [createClicked, setCreateClicked] = useState(false);
  const [fixed, setFixed] = useState(false);
  const statusName = useInput("");
  const taskName = useInput("");
  const [editDefault, setEditDefault] = useState("");
  const [dragging, setDragging] = useState(false);
  const dragTask = useRef();
  const dragNode = useRef();
  const statusIdRef = useRef();
  const [statusNameHolder, setStatusNameHolder] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [taskEditModal, setTaskEditModal] = useState(false);
  const [titleEdit, setTitleEdit] = useState("");
  const [editNameClicked, setEditNameClicked] = useState(false);
  const [labelClicked, setLabelClicked] = useState(false);
  const [dueDateClicked, setDueDateClicked] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [editTaskState, setEditTaskState] = useState({});

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

      dispatch({
        type: "CURRENT_TASK",
        currentTaskData: {
          task: {},
        },
      });
    };
  }, [fullPath]);

  const handleStatusEditClose = (status, index) => {
    let copy = [...currentBoardData.statuses];

    copy[index].editer = false;
    copy[index].editingName = false;

    dispatch({
      type: "CURRENT_BOARD_STATUSES",
      currentBoardData: {
        ...currentBoardData,
        statuses: copy,
      },
    });
  };

  const handleDeleteTask = async (task_id) => {
    const payload = {
      task_id: task_id,
      board_id: board_id,
    };
    console.log("task getting deleted", task_id);

    await deleteTask(payload);

    setTaskEditModal(false);
  };

  const handleEditStatusName = (status, index) => {
    console.log("status edit index", index);

    let copy = [...currentBoardData.statuses];

    copy[index].editingName = true;
    setStatusNameHolder(status.name);
    dispatch({
      type: "CURRENT_BOARD_STATUSES",
      currentBoardData: {
        ...currentBoardData,
        statuses: copy,
      },
    });
  };

  const handleEditStatusNameSubmit = async (e) => {
    e.preventDefault();

    let status_id = statusIdRef.current;
    console.log("Status id submit", status_id);
    const payload = {
      status_id: status_id,
      name: titleEdit,
      board_id: board_id,
    };
    await updateStatusName(payload);
    setEditModal(false);
  };

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
            console.log("tasks", task);
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
    if (taskName.value.length > 0) {
      createNewTask(payload, clearForm);
    } else {
      return;
    }
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
      console.log("HEEELLOOO");
      return "dragging-task";
    } else {
      return "task";
    }
  };

  if (dragging) {
    console.log("i am dragging");
  }
  const modalDate = new Date(
    currentTaskData.task.task_date
  ).toLocaleDateString();

  const closeTaskModal = () => {
    setDueDateClicked(false);
    setLabelClicked(false);
    setTaskEditModal(false);
  };

  const currentTaskHandler = async (task_id) => {
    console.log("IDDDD", task_id);
    await currentTask(task_id);

    setTaskEditModal(true);
  };

  const dueDateHandler = () => {
    let task_id = editTaskState.task_id;

    let payload = {
      task_id: task_id,
      board_id: board_id,
      dueDate: dueDate,
    };

    updateDueDate(payload);
  };

  const updateLabelHandler = async (label) => {
    console.log("LABEL NAME", label);

    let payload = {
      task_id: currentTaskData.task.task_id,
      label: label,
    };

    await updateLabel(payload);
  };

  const labelStyles = (index, i) => {
    if (currentTaskData.task.label === "low") {
      return "low-label";
    } else if (currentTaskData.task.label === "med") {
      console.log("MED LABEL");
      return "med-label";
    } else if (currentTaskData.task.label === "high") {
      return "high-label";
    } else if (currentTaskData.task.label === null) {
      return;
    }
  };

  const taskLabelStyles = (task) => {
    if (task.label === "low") {
      return "task-low-label";
    } else if (task.label === "med") {
      return "task-med-label";
    } else if (task.label === "high") {
      return "task-high-label";
    } else if (task.label === null) {
      return;
    }
  };

  // let users = Object.values(currentBoardUsers.board);
  // console.log("users", users);

  // users.forEach((user) => console.log("for each user", user.user_id));
  // let check = currentBoardUsers.board.hasOwnProperty("users");
  // console.log("check", check);

  return (
    <>
      <div className="current-board-main">
        <Modal
          className="edit-task-modal"
          onClick={() => closeTaskModal()}
          open={taskEditModal}
        >
          <div className="task-edit-header">
            <MdClose
              className="task-modal-close"
              onClick={() => closeTaskModal()}
            />
          </div>
          <div className="task-modal-content-container">
            <div className="task-modal-left">
              <div className={labelStyles()}></div>
              <div className="task-modal-task-name">
                <FaRegWindowMaximize
                  style={{ color: "grey", marginRight: "5px" }}
                />
                <h3 className="modal-task-name">
                  {currentTaskData.task.message}
                </h3>
              </div>

              {editNameClicked ? (
                <form>
                  <textarea type="text" />
                  <div>
                    <button>Save</button>
                    <button
                      className="modal-edit-name-close"
                      onClick={() => {
                        setEditNameClicked(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </form>
              ) : (
                <span
                  onClick={() => {
                    setEditNameClicked(true);
                  }}
                  style={{
                    color: "grey",
                    textDecoration: "underline",
                    marginLeft: "25px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </span>
              )}
              <div
                className="modal-date-container"
                style={{ marginTop: "10px" }}
              >
                <span>Date created: {modalDate}</span>
              </div>
              <div className="current-task-workers-container">
                <MdPeopleOutline
                  style={{
                    color: "grey",
                    marginRight: "5px",
                    fontSize: "22px",
                    position: "relative",
                    right: "3px",
                  }}
                />
                <span style={{ fontSize: "22px" }}>Members:</span>
              </div>
              <div className="modal-comment-container">
                <div className="comment-header">
                  <FaRegComment
                    style={{
                      color: "grey",
                      fontSize: "18px",
                      position: "relative",
                      right: "2px",
                    }}
                  />
                  <span>Add Comment</span>
                </div>
                <div className="comment-input-main">
                  <div className="comment-auth-pic-container">
                    <img src={auth.user.profilepic} />
                  </div>
                  <div className="comment-input-container">
                    <input />
                    <button>Save</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="task-modal-right">
              <span>Add</span>
              <button>
                <MdPersonOutline
                  style={{
                    color: "grey",
                    fontSize: "16px",
                    marginLeft: "5px",
                    marginRight: "5px",
                  }}
                />
                Members
              </button>
              <button onClick={() => setLabelClicked(!labelClicked)}>
                <MdLabelOutline
                  style={{
                    color: "grey",
                    fontSize: "16px",
                    marginLeft: "5px",
                    marginRight: "5px",
                  }}
                />
                Label
              </button>
              {labelClicked ? (
                <div className="prio-buttons-container">
                  <button
                    onClick={(e) => updateLabelHandler(e.target.name)}
                    name="low"
                    className="low-prio-button"
                  >
                    Low priority
                  </button>
                  <button
                    onClick={(e) => updateLabelHandler(e.target.name)}
                    name="med"
                    className="med-prio-button"
                  >
                    Medium priority
                  </button>
                  <button
                    onClick={(e) => updateLabelHandler(e.target.name)}
                    name="high"
                    className="high-prio-button"
                  >
                    High priority
                  </button>
                </div>
              ) : null}
              <button onClick={() => setDueDateClicked(!dueDateClicked)}>
                <FiClock
                  style={{
                    color: "grey",
                    fontSize: "16px",
                    marginLeft: "5px",
                    marginRight: "5px",
                  }}
                />
                Due Date
              </button>
              {dueDateClicked ? (
                <form className="due-date-input">
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  <button>Save</button>
                </form>
              ) : null}
              <button
                onClick={() => handleDeleteTask(currentTaskData.task.task_id)}
              >
                <MdDelete
                  style={{
                    color: "grey",
                    fontSize: "16px",
                    marginLeft: "5px",
                    marginRight: "5px",
                  }}
                />
                Delete Task
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          className="edit-modal"
          onClick={() => setEditModal(false)}
          open={editModal}
        >
          <div className="edit-modal-header">
            <span>Edit Status</span>
            <MdClose
              className="modal-close-button"
              onClick={() => setEditModal(false)}
            />
          </div>
          <form onSubmit={(e) => handleEditStatusNameSubmit(e)}>
            <label>Title</label>
            <input
              autoFocus
              type="text"
              value={titleEdit}
              onChange={(e) => setTitleEdit(e.target.value)}
            />
            <button type="submit">Save</button>
          </form>
          <div className="delete-status-container">
            <button className="delete-status-button">
              <MdDelete style={{ position: "relative", top: "2px" }} /> Delete
              Status
            </button>
          </div>
        </Modal>

        <Drawer
          onClick={() => {
            setMenuOpen(false);
          }}
          className="menu-drawer"
          open={menuOpen}
          padding="0px 0px"
        >
          <div className="menu-drawer-header"></div>
          <div className="menu-members-list">
            <div className="menu-members-container">
              <span>Team Members</span>
              <div>
                {currentBoardUsers.board.hasOwnProperty("users") &&
                  currentBoardUsers.board.users.map((user) => (
                    <img src={user.profilepic} />
                  ))}
              </div>
            </div>
          </div>
          <div className="menu-actions-container">
            <div className="bg-container">
              <div className="bg-color"></div>
              <span>Change Background</span>
            </div>
          </div>
          <div className="menu-description">
            <div className="menu-description-header">
              <FaStream className="description-icon" />
              <span>Description</span>
            </div>
            {currentBoardUsers.board.creator === auth.user.user_id ? (
              <div className="description-edit-container">
                <span className="description-edit-button">Edit</span>
              </div>
            ) : null}

            <p>{currentBoardUsers.board.description}</p>
          </div>
        </Drawer>
        <div className="board-header">
          <div className="board-header-left">
            <span className="board-name">
              {currentBoardUsers.board.board_name}
            </span>
          </div>
          <div className="board-header-right">
            <span className="menu-span" onClick={() => setMenuOpen(true)}>
              Show Menu
            </span>
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
                {status.editer ? (
                  <>
                    <div className="status-header">
                      {status.editingName ? (
                        <form
                          onSubmit={(e) =>
                            handleEditStatusNameSubmit(e, status, index)
                          }
                        >
                          <input
                            autoFocus
                            type="text"
                            value={statusNameHolder}
                            onChange={(e) =>
                              setStatusNameHolder(e.target.value)
                            }
                          />
                          <button type="submit" className="status-edit-button">
                            Save
                          </button>
                          <button
                            onClick={() => handleStatusEditClose(status, index)}
                            className="status-close-button"
                          >
                            Exit
                          </button>
                        </form>
                      ) : (
                        <>
                          <span className="status-name">{status.name}</span>
                          <div className="status-header-icons">
                            <MdEdit
                              onClick={() => {
                                handleEditStatusName(status, index);
                              }}
                              className="edit-icons"
                              style={{ marginRight: "3px", cursor: "pointer" }}
                            />
                            <MdDelete
                              className="edit-icons"
                              style={{ marginRight: "2px", cursor: "pointer" }}
                            />
                            <span className="status-dots">
                              <FiMoreHorizontal
                                onClick={() => {
                                  statusIdRef.current = status.status_id;
                                  setEditModal(true);
                                }}
                              />
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="status-header">
                      <span className="status-name">{status.name}</span>

                      <span className="status-dots">
                        <FiMoreHorizontal
                          onClick={() => {
                            setTitleEdit(status.name);
                            statusIdRef.current = status.status_id;
                            setEditModal(true);
                          }}
                        />
                      </span>
                    </div>
                  </>
                )}

                <div className="tasks-container">
                  {status.tasks.map((task, i) => (
                    <>
                      <>
                        <div
                          draggable
                          onDragStart={(e) => {
                            handleDragStart(e, { index, i });
                          }}
                          onDragEnter={
                            dragging
                              ? (e) => {
                                  handleDragEnter(e, { index, i });
                                }
                              : null
                          }
                          className={
                            dragging ? getStyles({ index, i }) : "task"
                          }
                          onMouseEnter={() =>
                            toggleHoveringOn(task.task_id, index)
                          }
                          onMouseLeave={() =>
                            toggleHoveringOff(task.task_id, index)
                          }
                        >
                          <div className={taskLabelStyles(task)}></div>
                          <div className="task-name-container">
                            {task.hovering ? (
                              <>
                                <span>{task.message} </span>
                                <MdEdit
                                  className="task-edit-pen"
                                  onClick={async () => {
                                    currentTaskHandler(task.task_id);
                                  }}
                                />
                                <FaArrowsAlt className="task-drag-icon" />
                              </>
                            ) : (
                              <span>{task.message} </span>
                            )}
                          </div>
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
                            autoFocus
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
