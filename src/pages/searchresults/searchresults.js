import React, { useState, useEffect } from "react";
import useSearch from "../../components/actions/searchactions";
import "./searchresults.scss";
import { useStateValue } from "../../state";

export default function Searchresults() {
  const [{ auth, components, searchResults }, dispatch] = useStateValue();
  const { handleSearch, requestJoin } = useSearch();

  let searchTerm = window.location.pathname.replace("/searchresults/", "");
  let newTerm = decodeURIComponent(searchTerm.toUpperCase());
  useEffect(() => {
    handleSearch(searchTerm);
    console.log("PARSED search term", searchTerm);

    return () => {
      dispatch({
        type: "SEARCH_RESULTS",
        searchResults: {
          results: [],
        },
      });
    };
  }, []);

  const handleBoardJoin = (result) => {
    let board_id = result.board_id;

    let payload = {
      board_id: board_id,
      searchTerm: searchTerm,
      user_id: auth.user.user_id,
    };

    requestJoin(payload);
  };

  console.log("results", searchResults);
  return (
    <div className="search-results-main">
      <div className="results-header">
        <h1>SEARCH RESULTS FOR: {newTerm}</h1>
      </div>
      <div className="search-results-container">
        {searchResults.results.map((result) => {
          let defaultPic = result.board_name.charAt(0).toUpperCase();
          let members = result.users.length;

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
                  {result.description !== "null" ? (
                    <p>{result.description}</p>
                  ) : null}
                </div>
              </div>
              <div className="request-board-container">
                <button onClick={() => handleBoardJoin(result)}>
                  Request To Join
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
