import React, { useRef } from "react";
import "./board.scss";
import { useStateValue } from "../../state";
import { FaEllipsisV } from "react-icons/fa";
import useClickOutside from "../../components/hooks/useClickOutside";

export default function Memberstab() {
  const [{ currentBoardUsers }, dispatch] = useStateValue();
  const ref = useRef();

  const handleModalHover = (member, i) => {
    console.log(i);
    console.log("member id", member);

    dispatch({ type: "HOVER_MEMBER", memberId: member, memberIndex: i });
  };

  const handleUnModalHover = (member, i) => {
    dispatch({ type: "UNHOVER_MEMBER", memberId: member, memberIndex: i });
  };

  const handleModalMemberClick = (member, i) => {
    dispatch({ type: "CLICKED_MEMBER", memberId: member, memberIndex: i });
  };

  const handleModalUnClickMember = (member, i) => {
    console.log("REF HANDLER");
    dispatch({ type: "UNCLICK_MEMBER", memberId: member, memberIndex: i });
  };

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

          {member.hovering && (
            <FaEllipsisV
              className="user-dots"
              onClick={() => handleModalMemberClick(member.user_id, i)}
            />
          )}

          {member.clicked && (
            <div className="member-clicked-popup">
              <div className="members-popup-item-remove">
                <span>Remove member</span>
              </div>
              <div
                className="members-popup-item"
                onClick={() => handleModalUnClickMember(member.user_id, i)}
              >
                <span>Close</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
