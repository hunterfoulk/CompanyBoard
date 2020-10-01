import React from "react";
import "./board.scss";
import { useStateValue } from "../../state";
import { FaEllipsisV } from "react-icons/fa";

export default function Memberstab() {
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

  const handleModalHover = (member, i) => {
    console.log(i);
    console.log("member id", member);

    dispatch({ type: "HOVER_MEMBER", memberId: member, memberIndex: i });
  };

  const handleUnModalHover = (member, i) => {
    dispatch({ type: "UNHOVER_MEMBER", memberId: member, memberIndex: i });
  };

  const handleModalMemberClick = (member, i) => {};

  return (
    <div className="board-members-tab-container">
      {currentBoardUsers.board.members.map((member, i) => (
        <div
          className="board-members-container"
          onMouseEnter={() => handleModalHover(member.user_id, i)}
          onMouseLeave={() => handleUnModalHover(member.user_id, i)}
        >
          <img src={member.profilepic} />
          <div className="users-contact">
            <span>{member.username}</span>
            <span className="user-email">{member.email}</span>
          </div>

          {member.hovering && <FaEllipsisV className="user-dots" />}
        </div>
      ))}
    </div>
  );
}
