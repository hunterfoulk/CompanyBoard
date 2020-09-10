import React, { useState, useEffect } from "react";
import "./boards.scss";
import useBoards from "../../components/actions/boardactions";
import { useStateValue } from "../../state";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";
import { MdDeveloperBoard } from "react-icons/md";
import { Link, useHistory } from "react-router-dom";

export default function Boards() {
  const [
    { auth, components, createdBoards, joinedBoards },
    dispatch,
  ] = useStateValue();
  const { getMyBoards, getJoinedBoards, filterBoardData } = useBoards();
  const history = useHistory();

  const user_id = auth.user.user_id;

  useEffect(() => {
    getMyBoards(user_id);
    getJoinedBoards(user_id);
  }, []);

  return (
    <div className="boards-main">
      <div className="boards-container">
        <div className="created-boards-container">
          <div className="created-boards-header">
            <MdDeveloperBoard className="board-icon" /> <h3>Created Boards</h3>
          </div>
          <div className="boards-container">
            {createdBoards.boards.map((board) => {
              return (
                <>
                  <div
                    className="board-card"
                    onClick={() => {
                      history.push(`/board/${board.board_id}`);
                    }}
                  >
                    <span className="board-name">{board.board_name}</span>
                    <p className="board-description">{board.description}</p>
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
          </div>
        </div>
        <div className="joined-boards-container">
          <div className="joined-boards-header">
            <MdDeveloperBoard className="board-icon" /> <h3>Joined Boards</h3>
          </div>
          <div className="boards-container">
            {joinedBoards.boards.map((board) => {
              return (
                <>
                  <div
                    className="board-card"
                    onClick={() => {
                      history.push(`/board/${board.board_id}`);
                    }}
                  >
                    <span className="board-name">{board.board_name}</span>
                    <p className="board-description">{board.description}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
