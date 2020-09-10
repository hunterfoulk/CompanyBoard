import axios from "axios";
import api from "../services/api";

export const signupUser = async (payload, clearForm) => {
  console.log("payload", payload);

  await axios
    .post(
      "http://localhost:9000/.netlify/functions/server/companyboard/signup",
      payload
    )
    .then((res) => {
      console.log("response", res);
      console.log("account created");
      clearForm();
    })

    .catch((error) => {
      console.error("error", error);
    });
};

export const createBoard = async (payload, clearForm) => {
  await axios
    .post(
      "http://localhost:9000/.netlify/functions/server/companyboard/newboard",
      payload
    )
    .then((res) => {
      console.log("response", res);
      console.log("board created");
      clearForm();
    })

    .catch((error) => {
      console.error("error", error);
    });
};
