import React, { useEffect } from "react";
import "./categories.scss";
import useSearch from "../../components/actions/searchactions";
import { useStateValue } from "../../state";

export default function Categorysearch() {
  const [{ auth, components, searchResults }, dispatch] = useStateValue();
  const { handleSearch, requestJoin, handleFilteredSearch } = useSearch();

  let category = window.location.pathname.replace("/categories/", "");

  console.log("categoryyy", category);
  useEffect(() => {
    handleFilteredSearch(category);

    return () => {
      dispatch({
        type: "SEARCH_RESULTS",
        searchResults: {
          results: [],
          isFetching: true,
        },
      });
    };
  }, []);

  const handleBoardJoin = (result) => {
    let board_id = result.board_id;

    let payload = {
      board_id: board_id,
      user_id: auth.user.user_id,
    };

    requestJoin(payload);
  };

  return (
    <div className="category-main">
      <div className="category-header">
        <span className="first-span">Company Boards</span>
        <span className="second-span">{category}</span>
        <span className="third-span">
          Company boards categorized by{" "}
          <span className="fourth-span">{category}</span>
        </span>
      </div>

      <div className="search-results-container">
        {searchResults.results.map((result) => {
          let defaultPic = result.board_name.charAt(0).toUpperCase();
          let members = result.users.length;
          let string = result.description;
          let length = 450;
          var trimmedString =
            string.length > length
              ? string.substring(0, length - 3) + "..."
              : string;

          result.requests.forEach((request) => {
            console.log(request);
            if (request.user_id === auth.user.user_id) {
              result.requested = true;
            } else {
              result.requested = false;
            }
          });

          result.users.forEach((user) => {
            if (user.user_id === auth.user.user_id) {
              result.inBoard = true;
            } else {
              // result.inBoard = false;
            }
          });
          return (
            <div className="search-result">
              <div className="result-users-header">
                <div className="left"></div>
                <div className="right">
                  <div className="members-container">
                    <span className="members">{members}</span>
                    {result.users.length !== 1 ? (
                      <span className="online">Members</span>
                    ) : (
                      <span className="online">Member</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="search-result-header">
                <div className="result-header-left">
                  {result.board_pic === null ? (
                    <div className="null-header-pic">
                      <span>{defaultPic}</span>
                    </div>
                  ) : (
                    <img src={result.board_pic} />
                  )}
                </div>
                <div className="result-header-right">
                  <span>{result.board_name}</span>
                </div>
              </div>
              <div className="board-description-container">
                <div className="label-container">
                  <span>{result.category}</span>
                </div>
                <div className="board-description">
                  {trimmedString !== "null" ? <p>{trimmedString}</p> : null}
                </div>
              </div>
              <div className="request-board-container">
                {(() => {
                  if (result.requested === true) {
                    return (
                      <div className="already-member-container">
                        <span style={{ color: "green", marginBottom: "5px" }}>
                          Awaiting to be accepted.
                        </span>
                      </div>
                    );
                  }
                  if (result.inBoard === true) {
                    return (
                      <div
                        className="already-member-container"
                        style={{ color: "green", marginBottom: "5px" }}
                      >
                        <span>You are a member of this board.</span>
                      </div>
                    );
                  }
                  if (result.requests.length <= 0) {
                    return (
                      <button onClick={() => handleBoardJoin(result)}>
                        Request To Join
                      </button>
                    );
                  }
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
