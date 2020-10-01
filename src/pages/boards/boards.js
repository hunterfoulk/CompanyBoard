import React, { useState, useEffect } from "react";
// import "./boards.scss";
import "./newboards.scss";
import useBoards from "../../components/actions/boardactions";
import { useStateValue } from "../../../src/state";
import { MdHome } from "react-icons/md";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";
import { MdDeveloperBoard } from "react-icons/md";
import { Link, useHistory } from "react-router-dom";
import NoBoards from "./noboards";
import Board from "../currentboard/board";

export default function Boards() {
  const [
    { auth, components, createdBoards, joinedBoards },
    dispatch,
  ] = useStateValue();
  const { getMyBoards, getJoinedBoards, filterBoardData } = useBoards();
  const history = useHistory();
  const [tab, setTab] = useState("CREATED");

  const user_id = auth.user.user_id;

  const activeTabStyle = {
    borderBottom: "2px solid rgb(52, 150, 241)",
    color: "rgb(52, 150, 241)",
  };

  // useEffect(() => {
  //   getMyBoards(user_id);
  //   getJoinedBoards(user_id);
  // }, []);

  // if (joinedBoards.boards.length === 0 && createdBoards.boards.length === 0) {
  //   return <NoBoards />;
  // }

  return (
    <div className="boards-main">
      <div className="boards-main-right">
        <Board />
      </div>
      {/* <div className="boards-content-container">
        <div className="boards-header">
          <span
            style={tab === "CREATED" ? activeTabStyle : {}}
            onClick={() => setTab("CREATED")}
          >
            Created
          </span>
          <span
            style={tab === "JOINED" ? activeTabStyle : {}}
            onClick={() => setTab("JOINED")}
          >
            Joined
          </span>
          <span
            style={tab === "STARRED" ? activeTabStyle : {}}
            onClick={() => setTab("STARRED")}
          >
            Starred
          </span>
        </div>
        <div className="boards-container">
          {createdBoards.boards.map((board, i) => {
            let boardNumber = i + 1;

            return (
              <>
                <div
                  className="board-card"
                  onClick={() => {
                    history.push(`/board/${board.board_id}`);
                  }}
                >
                  <div
                    className="board-header-color"
                    style={{
                      backgroundColor: `${board.color}`,
                    }}
                  ></div>
                  <div className="boards-name-container">
                    <span className="board-number">#{boardNumber}</span>

                    <span className="board-name">{board.board_name}</span>
                  </div>
                  <div className="board-users">
                    <Tooltip
                      title={board.username}
                      trigger="mouseenter"
                      className="tooltip"
                      position="bottom"
                      size="small"
                      style={{ padding: "0px" }}
                    >
                      <img src={board.profilepic} />
                    </Tooltip>
                  </div>
                </div>
              </>
            );
          })}
        </div> */}
      {/* </div> */}
    </div>
  );
}
