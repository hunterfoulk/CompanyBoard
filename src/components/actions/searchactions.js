import axios from "axios";
import { useStateValue } from "../../state";

const useSearch = () => {
  const [
    { auth, components, currentBoardUsers, joinedBoards, currentBoardData },
    dispatch,
  ] = useStateValue();

  const handleSearch = async (searchTerm) => {
    const queryParams = { params: { searchTerm } };
    console.log("search term", queryParams);

    await axios
      .get(
        `http://localhost:9000/.netlify/functions/server/companyboard/searchboards`,
        queryParams
      )
      .then(async (res) => {
        console.log("search response", res.data);
        const response = res.data;
        await attachUsers(response);
      })
      .catch((error) => {
        console.log(error, "search term error");
      });
  };

  const attachUsers = (response) => {
    console.log("fired");
    console.log("attach response", response);
    let count = 0;
    response.forEach((board, i) => {
      let board_id = board.board_id;
      const queryParams = { params: { board_id } };

      axios
        .get(
          `http://localhost:9000/.netlify/functions/server/companyboard/boardusers`,
          queryParams
        )
        .then((res) => {
          count++;
          response[i].users = res.data;
          console.log("attach users data", res.data);

          if (count === response.length) {
            dispatch({
              type: "SEARCH_RESULTS",
              searchResults: {
                results: response,
                isFetching: false,
              },
            });
            console.log("current board data", response);
          }
        })
        .catch((error) =>
          console.error("boards not fetched succesfully", error)
        );
    });
  };

  const joinBoard = async (payload) => {
    let searchTerm = payload.searchTerm;

    await axios
      .post(
        `http://localhost:9000/.netlify/functions/server/companyboard/joinboard`,
        payload
      )
      .then((res) => {
        console.log("search response", res.data);
        handleSearch(searchTerm);
      })
      .catch((error) => {
        console.log(error, "search term error");
      });
  };

  return { handleSearch, joinBoard };
};
export default useSearch;