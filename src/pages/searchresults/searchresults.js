import React, { useState, useEffect } from "react";
import useSearch from "../../components/actions/searchactions";
import "./searchresults.scss";
import { useStateValue } from "../../state";

export default function Searchresults() {
  const [{ auth, components, searchResults }, dispatch] = useStateValue();
  const { handleSearch } = useSearch();

  let searchTerm = window.location.pathname.replace("/searchresults/", "");

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

  console.log("results", searchResults);
  return (
    <div className="search-results-main">
      <div></div>
    </div>
  );
}
