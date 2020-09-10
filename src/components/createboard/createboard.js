import React from "react";
import "./createboard.scss";
import useInput from "../hooks/useInput";
import { useStateValue } from "../../state";
import { createBoard } from "../actions/actions";

const Createboard = () => {
  const [{ auth, components }, dispatch] = useStateValue();

  const boardName = useInput("");
  const boardDescription = useInput("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let user_id = auth.user.user_id;

    const payload = {
      boardName: boardName.value,
      boardDescription: boardDescription.value,
      user_id: user_id,
    };

    const clearForm = () => {
      boardName.setValue("");
      boardDescription.setValue("");
    };

    createBoard(payload, clearForm);
  };

  return (
    <div className="create-board-main">
      <div className="create-board-container">
        <div className="create-board-header">
          <h1>Create Board</h1>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label>Board Name</label>
          <input
            type="text"
            value={boardName.value}
            onChange={boardName.onChange}
          />
          <label>Board Description</label>
          <textarea
            type="text"
            value={boardDescription.value}
            onChange={boardDescription.onChange}
          />
          <button type="submit">Create Board</button>
        </form>
      </div>
    </div>
  );
};

export default Createboard;
