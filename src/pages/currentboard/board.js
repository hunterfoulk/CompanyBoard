import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./board.scss";
import useBoards from "../../components/actions/boardactions";
import { useStateValue } from "../../state";
import { FiPlus } from "react-icons/fi";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import useInput from "../../components/hooks/useInput";
import { MdClose } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaStream } from "react-icons/fa";
import { MdPersonOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdLabelOutline } from "react-icons/md";
import { MdPeopleOutline } from "react-icons/md";
import { AiFillPlusCircle } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FaRegWindowMaximize } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { FiClock } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import { MdFormatAlignLeft } from "react-icons/md";
import { Drawer } from "godspeed";
import { Modal } from "godspeed";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";
import Draggable from "react-draggable";
import { FaAngleDown } from "react-icons/fa";
import { MdPersonAdd } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import SettingsTab from "./settingstab";
import MembersTab from "./memberstab";
import DeleteTab from "./deletetab";
import useClickOutside from "../../components/hooks/useClickOutside";

export default function Board() {
  const {
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
    updateTaskMembers,
    changeBackground,
    getBoardRequests,
    acceptRequest,
    updateTaskStatus,
    submitNewComment,
    deleteStatus,
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
      popupMembers,
      taskMembers,
      checkBoxes,
      membersBox,
      labelsBox,
      dates,
      members,
      labels,
      boardRequests,
    },
    dispatch,
  ] = useStateValue();

  const statusName = useInput("");
  const taskName = useInput("");
  const [editDefault, setEditDefault] = useState("");
  const [dragging, setDragging] = useState(false);
  const dragTask = useRef();
  const dragNode = useRef();
  const statusIdRef = useRef();
  const [statusNameHolder, setStatusNameHolder] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [taskEditModal, setTaskEditModal] = useState(false);
  const [titleEdit, setTitleEdit] = useState("");
  const [editNameClicked, setEditNameClicked] = useState(false);
  const [labelClicked, setLabelClicked] = useState(false);
  const [dueDateClicked, setDueDateClicked] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [membersPopup, setMembersPopup] = useState(false);
  const [tab, setTab] = useState("");
  const [popupOriginalArray, setPopupOriginalArray] = useState([]);
  const [popupFilterArray, setPopupFilterArray] = useState([]);
  const [settingsPopup, setSettingsPopup] = useState(false);
  const [draggingWindow, setDraggingWindow] = useState(false);
  const dragStatus = useRef();
  const dragStatusNode = useRef();
  const [draggingStatus, setDraggingStatus] = useState(false);
  const [boardDropDown, setBoardDropDown] = useState(false);
  const [boardSettingsModal, setBoardSettingsModal] = useState(false);
  const [modalTab, setModalTab] = useState("Board Settings");
  const [bellModal, setBellModal] = useState(false);
  const [createStatus, setCreateStatus] = useState(false);
  const newComment = useInput("");
  const ref = useRef();
  useClickOutside(ref, () => setBellModal(false));

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
  let user_id = auth.user.user_id;
  useEffect(() => {
    getCurrentBoard(board_id, user_id);
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

  const HandleNewTask = async (status_id) => {
    console.log("status id clicked", status_id);

    let payload = {
      status_id: status_id,
      message: taskName.value,
      board_id: board_id,
    };

    await createNewTask(payload);
  };

  const handleEditNameSubmit = async (e) => {
    e.preventDefault();
    let task_id = currentTaskData.task.task_id;

    const payload = {
      task_id: task_id,
      message: editDefault,
      board_id: board_id,
    };
    await updateTaskName(payload);
  };

  console.log("drag node", dragNode.current);

  const handleDragStart = (e, params) => {
    console.log("task index for drag", params.i);
    console.log("handle drag task params", params);
    // console.log("TASK ID FOR DRAG", params.task.task_id);
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", handleDragEnd);
    dragTask.current = params;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  useEffect(() => {
    setDraggingStatus(false);
  }, [dragging]);

  const handleDragEnd = async (e) => {
    console.log("ending drag...");
    setDragging(false);
    dragNode.current.removeEventListener("dragend", handleDragEnd);
    await console.log("AWAITIING!!!!");

    dragTask.current = null;
    dragNode.current = null;
  };

  let taskRef = useRef();
  const handleDragEnter = (e, targetItem) => {
    let newList = [...currentBoardData.statuses];
    taskRef = dragTask.current;
    if (e.target !== dragNode.current) {
      newList[targetItem.index].tasks.map(async (task, i) => {
        if (i === targetItem.i) {
          let payload = {
            status_id: parseInt(targetItem.status.status_id),
            task_id: task.task_id,
            board_id: board_id,
          };

          await updateTaskStatus(payload);

          console.log("THIS IS THE PAYLOAD", payload);
        }
      });

      newList[targetItem.index].tasks.splice(
        targetItem.i,
        0,
        newList[dragTask.current.index].tasks.splice(dragTask.current.i, 1)[0]
      );
      dragTask.current = targetItem;
    }
  };

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

  const closeTaskModal = async () => {
    setDueDateClicked(false);
    setLabelClicked(false);
    setTaskEditModal(false);
    setMembersPopup(false);
    setPopupFilterArray(popupOriginalArray);

    setTab("");
  };

  const currentTaskHandler = async (task_id) => {
    console.log("IDDDD", task_id);
    await currentTask(task_id);

    setTaskEditModal(true);
  };

  const dueDateHandler = async (e) => {
    e.preventDefault();
    let task_id = currentTaskData.task.task_id;

    let payload = {
      task_id: task_id,
      board_id: board_id,
      dueDate: dueDate,
    };

    await updateDueDate(payload);
  };

  const updateLabelHandler = async (label) => {
    console.log("LABEL NAME", label);

    let payload = {
      task_id: currentTaskData.task.task_id,
      label: label,
      board_id: board_id,
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
    if (task.label === "low" && labels.checked == true) {
      return "task-low-label";
    } else if (task.label === "med" && labels.checked == true) {
      return "task-med-label";
    } else if (task.label === "high" && labels.checked == true) {
      return "task-high-label";
    } else if (task.label === null) {
      return;
    }
  };

  const activeTabStyle = {
    backgroundColor: "rgb(73, 151, 216)",
    color: "white",
  };
  const activeModalStyle = {
    backgroundColor: "#373a3b",
    color: "white",
  };

  const activeModalStyleRemove = {
    backgroundColor: "rgb(189, 53, 53)",
    color: "white",
  };

  const closeDate = () => {
    if (dueDateClicked === false) {
      setDueDateClicked(true);

      setTab("DATE");
    } else {
      setDueDateClicked(false);
      setTab("");
    }
  };

  const closeLabel = () => {
    if (labelClicked === false) {
      setLabelClicked(true);
      setTab("LABEL");
    } else {
      setLabelClicked(false);
      setTab("");
    }
  };

  const handleAddMembers = async (user_id, i) => {
    let copy = [...popupFilterArray];
    let task_id = currentTaskData.task.task_id;
    let newCopy = copy.filter((user) => user.user_id !== user_id);
    console.log("copy", newCopy);

    let payload = {
      user_id: user_id,
      task_id: task_id,
    };

    setPopupFilterArray(newCopy);
    await updateTaskMembers(payload);
  };

  useEffect(() => {
    checkMembers();
  }, [currentTaskData.task]);

  const checkMembers = () => {
    currentTaskData.task.hasOwnProperty("members") &&
      currentTaskData.task.members.map((member) => {
        popupFilterArray.map((user) => {
          if (user.user_id === member.user_id) {
            let newMembers = popupFilterArray.filter(
              (item) => item.user_id !== user.user_id
            );
            setPopupFilterArray(newMembers);
          }
        });
      });
  };

  const getCurrentBoardUsers = () => {
    const queryParams = { params: { board_id } };
    axios
      .get(
        `http://localhost:9000/.netlify/functions/server/companyboard/boardusers`,
        queryParams
      )
      .then((res) => {
        console.log("board users data", res.data);
        setPopupOriginalArray(res.data);
        setPopupFilterArray(res.data);
      })
      .catch((error) => console.error("boards not fetched succesfully", error));
  };

  useEffect(() => {
    getCurrentBoardUsers();
    getBoardRequests(board_id);
  }, []);

  const onWheel = (e) => {
    e.preventDefault();
    const container = document.getElementById("main-right");
    const containerScrollPosition = document.getElementById("main-right")
      .scrollLeft;
    container.scrollTo({
      top: 0,
      left: containerScrollPosition + e.deltaY,
      behaviour: "smooth",
    });
  };

  // dates checkbox //
  const handleDatesBox = async (checked) => {
    const copy = { ...dates };
    copy.checked = !copy.checked;
    let newChecked = !checked;

    console.log("check copy", copy);
    dispatch({
      type: "DATES_BOX",
      dates: {
        ...dates,
        checked: newChecked,
      },
    });
    localStorage.setItem("Dates-checkbox", JSON.stringify(copy));
  };

  // members checkbox //
  const handleMembersBox = async (checked) => {
    const copy = { ...members };
    copy.checked = !copy.checked;
    let newChecked = !checked;

    await dispatch({
      type: "MEMBERS_BOX",
      members: {
        ...members,
        checked: newChecked,
      },
    });
    localStorage.setItem("Members-checkbox", JSON.stringify(copy));
  };

  // labels checkbox //
  const handleLabelsBox = async (checked) => {
    const copy = { ...labels };
    copy.checked = !copy.checked;
    let newChecked = !checked;

    console.log("check copy", copy);
    await dispatch({
      type: "LABELS_BOX",
      labels: {
        ...labels,
        checked: newChecked,
      },
    });
    localStorage.setItem("Labels-checkbox", JSON.stringify(copy));
  };

  //////////status drag///////////
  console.log("dragging status", draggingStatus);
  console.log("dragging task", dragging);
  console.log("status node", dragStatusNode.current);

  const handleDragStatusEnter = (e, index) => {
    let newList = { ...currentBoardData };

    if (e.target !== dragNode.current) {
      newList.statuses.splice(
        index,
        0,
        newList.statuses.splice(dragStatus.current.index, 1)[0]
      );
      dragTask.current = index;
    }
  };
  const settingsModalHandler = () => {
    setBoardDropDown(false);
    setBoardSettingsModal(true);
  };

  const closeBoardModal = () => {
    setBoardSettingsModal(false);
    setTimeout(() => {
      setModalTab("Board Settings");
    }, 300);
  };

  const handleBoardAccept = async (user_id) => {
    dispatch({
      type: "FILTER_BOARD_REQUESTS",
      user_id: user_id,
    });
    let payload = {
      user_id: user_id,
      board_id: currentBoardUsers.board.board_id,
    };

    await acceptRequest(payload);
  };

  const createStatusOpen = () => {
    setCreateStatus(true);
    setBoardDropDown(false);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    let task_id = currentTaskData.task.task_id;

    let payload = {
      task_id: task_id,
      comment: newComment.value,
      user_id: auth.user.user_id,
    };

    await submitNewComment(payload);
    newComment.setValue("");
  };

  const handleStatusDelete = async () => {
    let payload = {
      status_id: statusIdRef.current,
      board_id: board_id,
    };

    await deleteStatus(payload);
    setEditModal(false);
  };

  useEffect(() => {
    let newEvent = document.getElementById("task");
    if (newEvent) {
      newEvent.addEventListener(
        "dragstart",
        function (e) {
          var img = document.createElement("img");
          this.style.backgroundColor = "red";
          e.dataTransfer.setDragImage(img, 0, 0);
        },
        false
      );
    }
  }, [dragging]);

  return (
    <>
      <div className="current-board-main">
        <Modal
          className="board-settings-modal"
          onClick={() => closeBoardModal()}
          open={boardSettingsModal}
        >
          <div className="board-settings-modal-bar"></div>

          <div className="board-settings-modal-wrapper">
            <div className="board-settings-sidebar">
              <div
                className="board-sidebar-item"
                style={modalTab === "Board Settings" ? activeModalStyle : {}}
                onClick={() => setModalTab("Board Settings")}
              >
                <span>Board Settings</span>
              </div>
              <div
                className="board-sidebar-item"
                style={modalTab === "Members Settings" ? activeModalStyle : {}}
                onClick={() => setModalTab("Members Settings")}
              >
                <span>Member Settings</span>
              </div>
              <div
                className="board-sidebar-item-remove"
                style={
                  modalTab === "Delete Settings" ? activeModalStyleRemove : {}
                }
                onClick={() => setModalTab("Delete Settings")}
              >
                <span>Delete Board</span>
              </div>
            </div>
            <div className="board-settings-content">
              <div className="board-settings-modal-header">
                <span>{modalTab}</span>
                <span onClick={() => closeBoardModal(false)}>
                  <IoIosCloseCircleOutline
                    style={{
                      fontSize: "35px",
                      color: "grey",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </div>
              {modalTab === "Board Settings" && <SettingsTab />}
              {modalTab === "Members Settings" && <MembersTab />}
              {modalTab === "Delete Settings" && <DeleteTab />}
            </div>
          </div>
        </Modal>
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
                {currentTaskData.task.due_date !== null ? (
                  <div className="due-date-container">
                    <span>
                      <FiClock
                        style={{
                          color: "white",
                          marginRight: "3px",
                          position: "relative",
                          top: "2px",
                        }}
                      />
                      {currentTaskData.task.due_date}
                    </span>
                  </div>
                ) : null}
              </div>

              {editNameClicked ? (
                <form onSubmit={(e) => handleEditNameSubmit(e)}>
                  <textarea
                    autoFocus
                    type="text"
                    value={editDefault}
                    onChange={(e) => setEditDefault(e.target.value)}
                  />
                  <div>
                    <button type="submit">Save</button>
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
              <div className="current-task-members">
                {currentTaskData.task.hasOwnProperty("members") &&
                  currentTaskData.task.members.map((user) => (
                    <img src={user.profilepic} />
                  ))}
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
                    <form onSubmit={(e) => handleComment(e)}>
                      <input
                        type="text"
                        value={newComment.value}
                        onChange={newComment.onChange}
                      />
                      <button type="submit">Submit</button>
                    </form>
                  </div>
                </div>
                <div className="comments-container">
                  <div className="comments-container-header">
                    <span className="comments-icon">
                      <MdFormatAlignLeft />
                    </span>
                    <span className="comments-header">Comments</span>
                  </div>
                  {currentTaskData.task.hasOwnProperty("comments") &&
                    currentTaskData.task.comments.map((comment) => (
                      <div className="comment">
                        <div className="comment-left">
                          <img src={comment.profilepic} />
                        </div>
                        <div className="comment-right">
                          <span className="commenter-name">
                            {comment.username}
                          </span>
                          <div className="comment-container">
                            <span>{comment.comment}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="task-modal-right">
              <span>Add</span>
              <button
                style={tab === "MEMBERS" ? activeTabStyle : {}}
                onClick={() => {
                  setMembersPopup(true);

                  setTab("MEMBERS");
                }}
              >
                <MdPersonOutline
                  style={tab === "MEMBERS" ? activeTabStyle : {}}
                  style={{
                    color: "grey",
                    fontSize: "16px",
                    marginLeft: "5px",
                    marginRight: "5px",
                  }}
                />
                Members
              </button>
              {membersPopup && (
                <div className="members-popup">
                  <div className="members-popup-header">
                    <span>Members</span>
                    <MdClose
                      className="members-exit"
                      onClick={() => {
                        setMembersPopup(false);

                        setTab("");
                      }}
                    />
                  </div>
                  <div className="members-popup-list">
                    {popupFilterArray.map((user, i) => (
                      <div
                        className="members-popup-users"
                        onClick={() => handleAddMembers(user.user_id, i)}
                      >
                        <img src={user.profilepic} />
                        <span>{user.username}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button
                style={tab === "LABEL" ? activeTabStyle : {}}
                onClick={() => {
                  closeLabel();
                }}
              >
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
              <button
                style={tab === "DATE" ? activeTabStyle : {}}
                onClick={() => {
                  closeDate();
                }}
              >
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
                <form
                  className="due-date-input"
                  onSubmit={(e) => dueDateHandler(e)}
                >
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  <button type="submit">Save</button>
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
          onClick={() => {
            setEditModal(false);
          }}
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
            <button
              className="delete-status-button"
              onClick={() => handleStatusDelete()}
            >
              <MdDelete style={{ position: "relative", top: "2px" }} /> Delete
              Status
            </button>
          </div>
        </Modal>

        <div className="board-header">
          {createStatus && (
            <Draggable>
              <div className="create-status-window">
                <div className="create-status-header">
                  <span>Create Status</span>
                  <MdClose
                    className="status-close"
                    onClick={() => setCreateStatus(false)}
                  />
                </div>
                <div className="create-status-input-container">
                  <label>Name</label>
                  <input
                    type="text"
                    value={statusName.value}
                    onChange={statusName.onChange}
                  />
                  <button onClick={(e) => handleSubmit(e)}>Add</button>
                </div>
              </div>
            </Draggable>
          )}
          <div className="board-header-left">
            {boardDropDown && (
              <div className="board-dropdown">
                <div className="dropdown-members-list">
                  <span>Members</span>
                  <div className="dropdown-members-container">
                    {currentBoardUsers.board.hasOwnProperty("users") &&
                      currentBoardUsers.board.users.map((user) => (
                        <img src={user.profilepic} />
                      ))}
                  </div>
                </div>

                {currentBoardUsers.board.creator === auth.user.user_id ? (
                  <>
                    <div
                      className="dropdown-item"
                      onClick={() => createStatusOpen()}
                    >
                      <span>Create status</span>
                      <AiFillPlusCircle style={{ marginRight: "5px" }} />
                    </div>

                    <div
                      className="dropdown-item"
                      onClick={() => settingsModalHandler()}
                    >
                      <span>Board Settings</span>
                      <IoMdSettings
                        style={{
                          marginRight: "5px",
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="dropdown-item" style={{ color: "red" }}>
                      <span>Leave board</span>
                    </div>
                  </>
                )}
              </div>
            )}
            <div
              className="board-name-container"
              onClick={() => setBoardDropDown(!boardDropDown)}
            >
              <span className="board-name">
                {currentBoardUsers.board.board_name}
              </span>

              {boardDropDown ? (
                <span className="header-arrow">
                  <MdClose onClick={() => setBoardDropDown(false)} />
                </span>
              ) : (
                <span className="header-arrow">
                  <FaAngleDown />
                </span>
              )}
            </div>
          </div>

          <div className="board-header-right">
            <div className="board-header-members">
              <span>Members |</span>
              {popupMembers.members.map((user) => (
                <Tooltip
                  trigger="mouseenter"
                  className="tooltip"
                  position="bottom"
                  size="small"
                  title={user.username}
                >
                  <img src={user.profilepic} />
                </Tooltip>
              ))}
            </div>
            {bellModal && (
              <div className="bell-modal" ref={ref}>
                <div className="bell-modal-header">
                  <span>Notifications</span>
                </div>
                <div className="notifications-container">
                  {boardRequests.requests.length < 1 ? (
                    <span style={{ textAlign: "center" }}>
                      No New Notifications
                    </span>
                  ) : null}
                  {boardRequests.requests.map((request) => (
                    <div className="notification-request">
                      <div className="notification-content">
                        <div className="notification-left">
                          <img src={request.profilepic} />
                        </div>
                        <div className="notification-right">
                          <span className="username">{request.username}</span>
                          <span className="email">{request.email}</span>
                        </div>
                      </div>
                      <div className="notification-button-container">
                        <button
                          className="accept-button"
                          onClick={() => handleBoardAccept(request.user_id)}
                        >
                          Accept
                        </button>
                        <button className="decline-button">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentBoardUsers.board.creator === auth.user.user_id ? (
              <span
                className="bell-icon"
                onClick={() => setBellModal(!bellModal)}
              >
                <FaBell />
              </span>
            ) : null}

            <span
              className="settings-icon"
              onClick={() => setSettingsPopup(true)}
            >
              <IoMdSettings
                style={{ marginRight: "5px", marginBottom: "1px" }}
              />
              Settings
            </span>
            {settingsPopup && (
              <Draggable
                onDrag={() => setDraggingWindow(true)}
                onStop={() => setDraggingWindow(false)}
              >
                <div
                  style={draggingWindow ? { cursor: "grabbing" } : null}
                  className="settings-popup"
                >
                  <div className="settings-popup-header">
                    <IoMdSettings
                      style={{
                        position: "relative",
                        top: "5px",
                        right: "2px",
                        color: "black",
                      }}
                    />
                    <span style={{ marginLeft: "3px" }}>Settings</span>
                    <MdClose
                      onClick={() => setSettingsPopup(false)}
                      style={{
                        position: "relative",
                        bottom: "1px",
                        left: "50px",
                        color: "grey",
                        fontSize: "18px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <div className="settings-popup-checkbox-container">
                    <div className="settings-popup-check-containers">
                      <label>{members.label}</label>
                      <input
                        type="checkbox"
                        checked={members.checked}
                        onChange={() => handleMembersBox(members.checked)}
                      />
                    </div>
                    <div className="settings-popup-check-containers">
                      <label>{labels.label}</label>
                      <input
                        type="checkbox"
                        checked={labels.checked}
                        onChange={() => handleLabelsBox(labels.checked)}
                      />
                    </div>
                    <div className="settings-popup-check-containers">
                      <label>{dates.label}</label>
                      <input
                        type="checkbox"
                        onChange={() => handleDatesBox(dates.checked)}
                        checked={dates.checked}
                      />
                    </div>
                  </div>
                </div>
              </Draggable>
            )}
          </div>
        </div>

        <div className="board-bottom">
          <div className="board-main-right" id="main-right" onWheel={onWheel}>
            {currentBoardData.statuses.map((status, index) => (
              <div
                draggable
                // onDragStart={(e) => {
                //   handleStatusDragStart(e, { status, index });
                // }}
                className="status-container"
                onDragEnter={
                  dragging && !status.tasks.length
                    ? (e) => handleDragEnter(e, { status, index, i: 0 })
                    : null
                }
                // onDragEnter={
                //   draggingStatus
                //     ? (e) => handleDragStatusEnter(e, index)
                //     : dragging && !status.tasks.length
                //     ? (e) => handleDragEnter(e, { index, i: 0 })
                //     : null
                // }
                // onDragEnter={() => {
                //   if (dragging === true && !status.tasks.length)
                //     return (e) => handleDragEnter(e, { index, i: 0 });
                //   else if (draggingStatus === true)
                //     return (e) => handleDragStatusEnter(e, index);
                // }}
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
                              style={{
                                marginRight: "3px",
                                cursor: "pointer",
                              }}
                            />
                            <MdDelete
                              className="edit-icons"
                              style={{
                                marginRight: "2px",
                                cursor: "pointer",
                              }}
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
                  {status.tasks.map((task, i) => {
                    return (
                      <>
                        <div
                          draggable
                          onDragStart={(e) => {
                            handleDragStart(e, { index, i, task });
                          }}
                          onDragEnter={
                            dragging
                              ? (e) => {
                                  handleDragEnter(e, {
                                    status,
                                    task,
                                    index,
                                    i,
                                  });
                                }
                              : null
                          }
                          id="task"
                          onClick={async () => {
                            currentTaskHandler(task.task_id);
                          }}
                          className={
                            dragging ? getStyles({ index, i }) : "task"
                          }
                        >
                          <div className={taskLabelStyles(task)}></div>
                          <div className="task-name-container">
                            <span>{task.message} </span>
                          </div>
                          {dates.checked && task.due_date !== null ? (
                            <div className="task-due-date">
                              <span>
                                <FiClock
                                  style={{
                                    position: "relative",
                                    right: "2px",
                                    top: "1.5px",
                                    marginRight: "1px",
                                  }}
                                />
                                {task.due_date.split("2020-0")}
                              </span>
                            </div>
                          ) : null}
                          <div className="task-members-list-container">
                            {members.checked
                              ? task.members.map((member) => (
                                  <div className="task-member">
                                    <img src={member.profilepic} />
                                  </div>
                                ))
                              : null}
                          </div>
                        </div>
                      </>
                    );
                  })}
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
                            style={{ fontSize: "17px" }}
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
