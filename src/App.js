import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import { FiPlus } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { IoIosCamera } from "react-icons/io";
import { AiFillPlusCircle } from "react-icons/ai";
import Navbar from "./components/navbar/navbar";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Home from "./pages/home/home";
import Boards from "./pages/boards/boards";
import CreateBoard from "./components/createboard/createboard";
import { useStateValue } from "./state";
import Board from "./pages/currentboard/board";
import Searchresults from "./pages/searchresults/searchresults";
import Sidebar from "./components/sidebar/sidebar";
import useBoards from "./components/actions/boardactions";
import { Modal } from "godspeed";
import SearchPage from "./pages/search/searchpage";
import useUpdate from "./components/actions/update";
import { Link, useHistory } from "react-router-dom";

const App = () => {
  const [
    { auth, components, joinedBoards, currentBoardUsers, currentBoardData },
    dispatch,
  ] = useStateValue();
  const { updateProfile } = useUpdate();
  const { createBoard } = useBoards();
  const { getMyBoards, getJoinedBoards, filterBoardData } = useBoards();
  const [createModal, setCreateModal] = useState(false);
  const [placeholderPic, setPlaceHolder] = useState(null);
  const [picFile, setPicFile] = useState(null);
  const [category, setCategory] = useState("Software");
  const [boardName, setBoardName] = useState("");
  const [profileModal, setProfileModal] = useState(false);
  const [username, setUsername] = useState(auth.user.username);
  const [email, setEmail] = useState(auth.user.email);
  const [password, setPassword] = useState(auth.user.password);
  const history = useHistory();

  // useEffect(() => {
  //   getJoinedBoards(user_id);
  // }, []);

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
      boardName: username,
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
    <>
      <Router>
        <div className="app-container">
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
                      src={
                        placeholderPic ? placeholderPic : auth.user.profilepic
                      }
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
                <button
                  className="cancel-button"
                  onClick={() => closeProfile()}
                >
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
                Give your new board a board picture and a board name. You can
                change them at any time.
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
          <div className="components-container">
            <div className="components-container-left">
              <Sidebar />
              <div className="profile-pic-container">
                <div
                  className="new-board-button"
                  onClick={() => setCreateModal(true)}
                >
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
            <div className="components-container-right">
              <Route
                exact
                path="/home"
                render={() => (
                  <>
                    <Home />
                  </>
                )}
              ></Route>

              <Route
                exact
                path="/board/:board_id"
                render={() => (
                  <>
                    <Board />
                  </>
                )}
              ></Route>

              <Route
                exact
                path="/search"
                render={() => (
                  <>
                    <SearchPage />
                  </>
                )}
              ></Route>

              <Route
                exact
                path="/searchresults/:searchterm"
                render={() => (
                  <>
                    <Searchresults />
                  </>
                )}
              ></Route>
            </div>

            {/* <Route
              exact
              path="/home"
              render={() => (
                <>
                  <Home />
                </>
              )}
            ></Route> */}

            <Route
              exact
              path="/createboard"
              render={() => (
                <>
                  <CreateBoard />
                </>
              )}
            ></Route>

            {/* <Route
              exact
              path="/boards"
              render={() => (
                <>
                  <Boards />
                </>
              )}
            ></Route> */}

            {/* <Route
              exact
              path="/board/:board_id"
              render={() => (
                <>
                  <Board />
                </>
              )}
            ></Route>

            <Route
              exact
              path="/searchresults/:searchterm"
              render={() => (
                <>
                  <Searchresults />
                </>
              )}
            ></Route> */}
          </div>
        </div>
      </Router>
    </>
  );
};

export default App;
