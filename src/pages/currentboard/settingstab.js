import React, { useState } from "react";
import "./board.scss";
import { useStateValue } from "../../state";
import useBoards from "../../components/actions/boardactions";

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
  const { handleUpdateBoardPic } = useBoards();
  const [boardPic, setBoardPic] = useState(currentBoardUsers.board.board_pic);
  const [picPlaceholder, setPicPlaceholder] = useState(null);

  const handleEditProfilePic = async (e) => {
    let reader = new FileReader();
    const file = e.target.files[0];

    if (file) {
      console.log("new pic", file);

      console.log(reader);
      reader.onloadend = () => {
        setPicPlaceholder(reader.result);
        setBoardPic(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let payload = {
      boardPic: boardPic,
      board_id: currentBoardUsers.board.board_id,
    };

    handleUpdateBoardPic(payload);
  };

  return (
    <div className="board-settings-modal-edit-container">
      <div className="edit-container-left">
        <div className="edit-image-container">
          {/* {currentBoardUsers.board.board_pic === null ? (
            <div className="default-board-pic">
              {currentBoardUsers.board.board_name.charAt(0).toUpperCase()}
            </div>
          ) : null} */}
          {(() => {
            if (
              currentBoardUsers.board.board_pic === null &&
              picPlaceholder === null
            ) {
              return (
                <div className="default-board-pic">
                  {currentBoardUsers.board.board_name.charAt(0).toUpperCase()}
                </div>
              );
            } else if (picPlaceholder) {
              return <img className="placeholder-pic" src={picPlaceholder} />;
            } else {
              return (
                <img
                  className="placeholder-pic"
                  src={currentBoardUsers.board.board_pic}
                />
              );
            }
          })()}
        </div>
        <div
          className="edit-input-container"
          style={picPlaceholder ? { marginTop: "40px" } : null}
        >
          <label htmlFor="board-pic-input">Change Image</label>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              id="board-pic-input"
              type="file"
              accept="image/*"
              onChange={handleEditProfilePic}
              style={{ display: "none" }}
            />
            {picPlaceholder && (
              <div className="board-settings-button-container">
                <button type="submit">Save</button>
              </div>
            )}
          </form>
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
