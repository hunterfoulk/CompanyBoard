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

const App = () => {
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
  const { createBoard } = useBoards();
  const { getMyBoards, getJoinedBoards, filterBoardData } = useBoards();
  const [createModal, setCreateModal] = useState(false);
  const [placeholderPic, setPlaceHolder] = useState(null);
  const [picFile, setPicFile] = useState(null);
  const [category, setCategory] = useState("Software");
  const [boardName, setBoardName] = useState("");

  useEffect(() => {
    // getMyBoards(user_id);
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

  return (
    <>
      <Router>
        <div className="app-container">
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
                <img className="profile-pic" src={auth.user.profilepic} />
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
