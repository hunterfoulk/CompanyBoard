import React from "react";
import "./board.scss";
export default function Deletetab() {
  return (
    <div className="delete-board-container">
      <div className="delete-content-container">
        <span>Are You Sure You Want To Delete This Board?</span>
      </div>
      <div className="delete-button-container">
        <button>Delete Board</button>
      </div>
    </div>
  );
}
