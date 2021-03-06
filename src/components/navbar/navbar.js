import React, { useState, useEffect } from "react";
import "./navbar.scss";
import { useStateValue } from "../../state";
import { MdHome } from "react-icons/md";
import { MdDeveloperBoard } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
import { BsPlusSquareFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { Drawer } from "godspeed";
import Camera from "../../images/camera.jpg";
import useUpdate from "../actions/update";
import { Link, useHistory } from "react-router-dom";
import useSearch from "../../components/actions/searchactions";

export default function Navbar() {
  const [
    { auth, components, searchResults, currentBoardUsers },
    dispatch,
  ] = useStateValue();
  const date = new Date(auth.user.join_date).toLocaleDateString();
  const [cameraHover, setCameraHover] = useState(false);
  const [pic, setPic] = useState(null);
  const [picFile, setPicFile] = useState(auth.user.profilpic);
  const handleUpdatePic = useUpdate();
  const history = useHistory();
  const [profileDrawer, setProfileDrawer] = useState(false);
  const [searchDrawer, setSearhDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { handleSearch, joinBoard } = useSearch();

  const handleEditProfilePic = async (e) => {
    let reader = new FileReader();
    const file = e.target.files[0];

    if (file) {
      console.log("new pic", file);

      console.log(reader);
      reader.onloadend = () => {
        setPic(reader.result);
        setPicFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let user_id = auth.user.user_id;

    handleUpdatePic(user_id, picFile);
  };

  const handleLogout = () => {
    localStorage.clear();

    dispatch({
      type: "logout",
    });
    setProfileDrawer(false);
    history.push("/");
  };

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchTerm.length <= 0) {
      return;
    } else {
      handleSearch(searchTerm);
    }
  };

  const handleBoardJoin = (board_id, index) => {
    console.log(board_id);

    let payload = {
      board_id: board_id,
      user_id: auth.user.user_id,
      searchTerm: searchTerm,
    };
    joinBoard(payload);
  };

  // searchResults.results.map((result, index) => {
  //   console.log("RESULTS!", result.users);

  //   result.users.map((users, i) => {
  //     if (users.user_id === auth.user.user_id) {
  //       result.joined = true;
  //     }
  //   });
  // });

  // useEffect(() => {
  //   return () => {
  //     setSearchTerm("");
  //     dispatch({
  //       type: "SEARCH_RESULTS",
  //       searchResults: {
  //         results: [],
  //         isFetching: true,
  //       },
  //     });
  //   };
  // }, []);

  return (
    <>
      <div className="navbar">
        <Drawer
          className="main-drawer"
          onClick={() => setProfileDrawer(false)}
          open={profileDrawer}
          padding="0px 0px"
        >
          <div className="drawer-header">
            <h1>Profile</h1>
          </div>
          <div className="image-container">
            <div
              className="image-holder"
              onMouseLeave={() => setCameraHover(false)}
            >
              <label htmlFor="pic-upload">
                {cameraHover ? <FaCamera className="camera-hover" /> : null}
              </label>
              <label htmlFor="pic-upload">
                <img
                  onMouseEnter={() => setCameraHover(true)}
                  src={pic ? pic : auth.user.profilepic}
                  alt="banner"
                />
              </label>
              <input
                id="pic-upload"
                type="file"
                accept="image/*"
                onChange={handleEditProfilePic}
                style={{ display: "none" }}
              />
            </div>
          </div>
          {pic ? (
            <button onClick={(e) => handleSubmit(e)} className="save-button">
              save
            </button>
          ) : null}
          <div className="name-container">
            <span>{auth.user.username}</span>
          </div>
          <div className="email-container" style={{ marginTop: "15px" }}>
            <span>{auth.user.email}</span>
          </div>
          <div className="date-container">
            <span>Join date: {date}</span>
          </div>
          <div className="boards-header">
            <h1>Boards</h1>
          </div>
          <div className="drawer-footer">
            <button onClick={() => handleLogout()}>Log out</button>
          </div>
        </Drawer>
        <div className="nav-left">
          {/* <FaSearch
            onClick={() => setSearhDrawer(true)}
            className="search-icon"
            style={{
              fontSize: "18px",
              marginLeft: "50px",
              cursor: "pointer",
              backgroundColor: "#7289da",
            }}
          /> */}
          {/* <form
          onSubmit={() => {
            history.push(`/searchresults/${decodeURIComponent(searchTerm)}`);
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form> */}
        </div>
        <div className="nav-middle">
          <span>CompanyBoard</span>
        </div>
        <div className="nav-right">
          <BsPlusSquareFill
            className="create-board-icon"
            onClick={() => {
              history.push("/createboard");
            }}
          />
          <img
            onClick={() => setProfileDrawer(true)}
            src={auth.user.profilepic}
          />
        </div>
      </div>
    </>
  );
}
