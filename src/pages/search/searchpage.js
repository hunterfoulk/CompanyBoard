import React, { useState } from "react";
import "./searchpage.scss";
import useSearch from "../../components/actions/searchactions";
import { useStateValue } from "../../state";
import { Link, useHistory } from "react-router-dom";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { handleSearch, joinBoard } = useSearch();
  const history = useHistory();

  const [filters] = useState([
    {
      label: "Business",
    },
    {
      label: "Marketing",
    },
    {
      label: "Software",
    },
    {
      label: "IT",
    },
    {
      label: "Health",
    },
    {
      label: "Other",
    },
  ]);

  return (
    <div className="search-page-main">
      <div className="search-header-container">
        <h2>SEARCH BOARDS</h2>
      </div>
      <div className="search-input-container">
        <form
          onSubmit={() => {
            history.push(`/searchresults/${decodeURIComponent(searchTerm)}`);
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>Search</button>
        </form>
      </div>
      <div className="filters-container">
        {filters.map((filter) => (
          <div className="filter">
            <span>{filter.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}