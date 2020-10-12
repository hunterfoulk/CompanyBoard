import axios from "axios";
import api from "../services/api";
import { useStateValue } from "../../state";
import { Link, useHistory } from "react-router-dom";

const useLogin = () => {
  const [{ auth, components }, dispatch] = useStateValue();
  const history = useHistory();

  //login user
  const loginUser = async (payload, clearForm) => {
    console.log("payload", payload);
    await axios

      .post(
        "http://localhost:9000/.netlify/functions/server/companyboard/login",
        payload
      )
      .then((res) => {
        const user = { ...res.data.user, token: res.data.token };
        localStorage.setItem("user", JSON.stringify(user));

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        clearForm();

        dispatch({
          type: "login",
          auth: {
            isAuthenticated: true,
            user: user,
          },
        });
        history.push("/search");
      })

      .catch((error) => {
        console.error("error", error);
      });
  };
  return loginUser;
};
export default useLogin;
