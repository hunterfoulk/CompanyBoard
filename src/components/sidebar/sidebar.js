import React, { useEffect } from "react";
import "./sidebar.scss";
import useBoards from "../actions/boardactions";
import { useStateValue } from "../../state";
import { Tooltip } from "react-tippy";
import { MdDeveloperBoard } from "react-icons/md";
import { Link, useHistory } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { FaSearch } from "react-icons/fa";

export default function Sidebar() {
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
    <div className="boards-main-left">
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
    </div>
  );
}
