import React, { useEffect, useState } from "react";
import "./sidebar.scss";
import useBoards from "../actions/boardactions";
import { useStateValue } from "../../state";
import { Tooltip } from "react-tippy";
import { MdDeveloperBoard } from "react-icons/md";
import { Link, useHistory } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { Modal } from "godspeed";
import { MdClose } from "react-icons/md";
import { IoIosCamera } from "react-icons/io";
import { AiFillPlusCircle } from "react-icons/ai";
import useUpdate from "../actions/update";

export default function Sidebar() {
  const { updateProfile } = useUpdate();
  const [createModal, setCreateModal] = useState(false);
  const [placeholderPic, setPlaceHolder] = useState(null);
  const [picFile, setPicFile] = useState(null);
  const [category, setCategory] = useState("Software");
  const [boardName, setBoardName] = useState("");
  const [profileModal, setProfileModal] = useState(false);

  const [
    { auth, components, createdBoards, joinedBoards },
    dispatch,
  ] = useStateValue();
  const {
    getMyBoards,
    getJoinedBoards,
    filterBoardData,
    createBoard,
  } = useBoards();
  const history = useHistory();
  const [username, setUsername] = useState(auth.user.username);
  const [email, setEmail] = useState(auth.user.email);
  const [password, setPassword] = useState(auth.user.password);
  useEffect(() => {
    getJoinedBoards(user_id);
  }, []);

  const user_id = auth.user.user_id;

  const handleEditProfilePic = async (e) => {
    let reader = new FileReader();
    const file = e.target.files[0];

    if (file) {
      console.log("new pic", file);

      console.log(reader);
      reader.onloadend = () => {
        setPlaceHolder(reader.result);
        setPicFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setCreateModal(false);
    setTimeout(() => {
      setPlaceHolder(false);
    }, 300);
  };

  const handleSubmitBoard = async (e) => {
    e.preventDefault();
    let payload = {
      user_id: auth.user.user_id,
      category: category,
      boardName: boardName,
      picFile: picFile,
    };

    await createBoard(payload);
    setCategory("Software");
    setPlaceHolder(false);
    setBoardName("");
    setCreateModal(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    let payload = {
      user_id: auth.user.user_id,
      username: username,
      email: email,
      picFile: picFile,
      password: password,
    };

    await updateProfile(payload);
  };

  const closeProfile = () => {
    setProfileModal(false);
    setTimeout(() => {
      setPlaceHolder(false);
    }, 300);
  };

  const handleLogout = () => {
    localStorage.clear();

    dispatch({
      type: "logout",
    });
    window.location.href = "/";
  };

  return (
    <div className="sidebar">
      <Modal
        className="profile-modal"
        onClick={() => closeProfile()}
        open={profileModal}
        padding="0px"
      >
        <div className="profile-modal-header">
          <span>My Account</span>
        </div>
        <div className="profile-modal-wrapper">
          <div className="wrapper-left">
            <div className="image-holder">
              <label htmlFor="profile-pic-change">
                <AiFillPlusCircle className="create-plus" />
                <img
                  src={placeholderPic ? placeholderPic : auth.user.profilepic}
                />
              </label>
              <input
                id="profile-pic-change"
                type="file"
                accept="image/*"
                onChange={handleEditProfilePic}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <div className="wrapper-right">
            <form>
              <label>Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </form>
          </div>
        </div>
        <div className="profile-modal-footer">
          <div className="delete-account-container">
            <button onClick={handleLogout} className="logout-button">
              Log out
            </button>
            <button>Delete Account</button>
          </div>
          <div className="save-container">
            <button className="cancel-button" onClick={() => closeProfile()}>
              Cancel
            </button>
            <button
              onClick={(e) => handleUpdateProfile(e)}
              className="save-button"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        className="create-modal"
        onClick={() => handleClose()}
        open={createModal}
      >
        <div className="create-close-container">
          <MdClose
            className="create-close-icon"
            onClick={() => handleClose()}
          />
        </div>
        <div className="create-modal-header">
          <span>Create Your Board</span>
        </div>
        <div className="create-modal-p">
          <p>
            Give your new board a board picture and a board name. You can change
            them at any time.
          </p>
        </div>
        <div className="create-board-pic-container">
          <label
            htmlFor="pic-upload"
            style={placeholderPic ? { border: "none" } : null}
          >
            {placeholderPic ? (
              <img src={placeholderPic ? placeholderPic : null} alt="" />
            ) : (
              <>
                <AiFillPlusCircle className="create-plus" />
                <span className="first-span">
                  <IoIosCamera />
                </span>
                <span className="second-span">upload</span>
              </>
            )}
          </label>
          <input
            id="pic-upload"
            type="file"
            accept="image/*"
            onChange={handleEditProfilePic}
            style={{ display: "none" }}
          />
        </div>
        <div className="board-name-container">
          <form onSubmit={(e) => handleSubmitBoard(e)}>
            <label>Board Name</label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
            />
            <div className="custom-select">
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="Software">Software</option>
                <option value="IT">IT</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="create-button-container">
              <button type="submit">Create</button>
            </div>
          </form>
        </div>
      </Modal>
      <div className="boards-container">
        <span
          className="boards-home-button"
          style={{ marginTop: "10px" }}
          onClick={() => {
            history.push(`/search`);
          }}
        >
          <FaSearch style={{ fontSize: "22px" }} />
        </span>
        <span className="boards-home-button">
          <MdHome />
        </span>
        {joinedBoards.boards.map((board) => {
          let defaultPic = board.board_name.charAt(0).toUpperCase();
          return (
            <>
              <Tooltip
                title={board.board_name}
                trigger="mouseenter"
                className="tooltip"
                position="right"
                size="md"
                style={{ padding: "5px" }}
              >
                {board.board_pic !== null ? (
                  <img
                    src={board.board_pic}
                    onClick={() => {
                      history.push(`/board/${board.board_id}`);
                    }}
                  />
                ) : (
                  <div
                    className="default-board-div"
                    onClick={() => {
                      history.push(`/board/${board.board_id}`);
                    }}
                  >
                    <span className="default-board-pic">{defaultPic}</span>
                  </div>
                )}
              </Tooltip>
            </>
          );
        })}
      </div>
      <div className="profile-pic-container">
        <div className="new-board-button" onClick={() => setCreateModal(true)}>
          <span>
            <FiPlus />
          </span>
        </div>
        <img
          className="profile-pic"
          src={auth.user.profilepic}
          onClick={() => setProfileModal(true)}
        />
      </div>
    </div>
  );
}
