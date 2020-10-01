import React from "react";
import "./board.scss";
import { useStateValue } from "../../state";

export default function Settingstab() {
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
    },
    dispatch,
  ] = useStateValue();
  return (
    <div className="board-settings-modal-edit-container">
      <div className="edit-container-left">
        <div className="edit-image-container">
          {currentBoardUsers.board.board_pic === null ? (
            <div className="default-board-pic">
              {currentBoardUsers.board.board_name.charAt(0).toUpperCase()}
            </div>
          ) : null}
        </div>
        <div className="edit-input-container">
          <label htmlFor="board-pic-input">Change Image</label>
          <input
            id="board-pic-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div className="edit-container-right">
        <div className="edit-container">
          <label>Board Name</label>
          <input type="text" value={currentBoardUsers.board.board_name} />
        </div>
      </div>
    </div>
  );
}
