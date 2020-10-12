import React from "react";
import "./board.scss";
import useBoards from "../../components/actions/boardactions";
import { useStateValue } from "../../state";
import { Link, useHistory } from "react-router-dom";

export default function Deletetab({ board_id, setBoardSettingsModal }) {
  const { deleteBoard } = useBoards();
  const [{ auth }, dispatch] = useStateValue();
  const history = useHistory();

  const handleDeleteBoard = async () => {
    let payload = {
      user_id: auth.user.user_id,
      board_id: board_id,
    };
    console.log("THIS IS DELETE BOARD ID", board_id);
    await deleteBoard(payload);
    setTimeout(() => {
      setBoardSettingsModal(false);
    }, 200);
    history.push("/search");
  };
  return (
    <div className="delete-board-container">
      <div className="delete-content-container">
        <span>Are You Sure You Want To Delete This Board?</span>
      </div>
      <div className="delete-button-container">
        <button onClick={() => handleDeleteBoard()}>Delete Board</button>
      </div>
    </div>
  );
}
