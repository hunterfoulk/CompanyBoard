import React, { useState } from "react";
import "./navbar.scss";
import { useStateValue } from "../../state";
import { MdHome } from "react-icons/md";
import { MdDeveloperBoard } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
import { BsPlusSquareFill } from "react-icons/bs";
import { Drawer } from "godspeed";
import Camera from "../../images/camera.jpg";
import useUpdate from "../actions/update";
import { Link, useHistory } from "react-router-dom";

export default function Navbar() {
  const [{ auth, components }, dispatch] = useStateValue();
  const date = new Date(auth.user.join_date).toLocaleDateString();
  const [cameraHover, setCameraHover] = useState(false);
  const [pic, setPic] = useState(null);
  const [picFile, setPicFile] = useState(auth.user.profilpic);
  const handleUpdatePic = useUpdate();
  const history = useHistory();

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

  return (
    <div className="navbar">
      <Drawer
        className="main-drawer"
        onClick={() => {
          dispatch({
            type: "manage",
            components: {
              profileDrawer: false,
            },
          });
        }}
        open={components.profileDrawer}
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
          <button>Log out</button>
        </div>
      </Drawer>
      <div className="nav-left">
        <button style={{ cursor: "pointer" }}>
          <MdHome
            style={{ fontSize: "20px" }}
            onClick={() => {
              history.push("/home");
            }}
          />
        </button>
        <button
          style={{ fontSize: "17px" }}
          onClick={() => {
            history.push("/boards");
          }}
        >
          <MdDeveloperBoard
            className="board-button"
            style={{
              position: "relative",
              top: "3px",
              marginRight: "2px",
            }}
          />
          Boards
        </button>
        <input type="text" />
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
          src={auth.user.profilepic}
          onClick={() => {
            dispatch({
              type: "manage",
              components: {
                profileDrawer: true,
              },
            });
          }}
        />
      </div>
    </div>
  );
}
