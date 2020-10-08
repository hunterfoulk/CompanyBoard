import { useStateValue } from "../../state";
import axios from "axios";

const useUpdate = () => {
  const [{ auth, components }, dispatch] = useStateValue();

  const updateProfile = async (payload) => {
    if (payload.picFile) {
      let user_id = payload.user_id;
      let picFile = payload.picFile;
      let username = payload.username;
      let email = payload.email;
      let password = payload.password;

      let formData = new FormData();

      formData.append("picFile", picFile);
      formData.append("user_id", user_id);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      let headers = {
        "Content-Type": "multipart/form-data",
      };

      await axios
        .post(
          "http://localhost:9000/.netlify/functions/server/companyboard/updateprofilepic",
          formData,
          {
            headers: headers,
            withCredentials: true,
          }
        )
        .then((res) => {
          const user = res.data.user;
          console.log("response", res);
          console.log("user", user);
          setTimeout(() => {
            localStorage.setItem("user", JSON.stringify(user));

            dispatch({
              type: "update",
              auth: {
                user: user,
              },
            });
          }, 350);
        })

        .catch((error) => {
          console.error("error", error);
        });
    } else {
      let user_id = payload.user_id;
      let username = payload.username;
      let email = payload.email;
      let password = payload.password;

      let formData = new FormData();

      formData.append("user_id", user_id);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      let headers = {
        "Content-Type": "multipart/form-data",
      };

      await axios
        .post(
          "http://localhost:9000/.netlify/functions/server/companyboard/updateprofilemisc",
          formData,
          {
            headers: headers,
            withCredentials: true,
          }
        )
        .then((res) => {
          const user = res.data.user;
          console.log("response", res);
          console.log("user", user);
          console.log("new profile pic sent");
          setTimeout(() => {
            localStorage.setItem("user", JSON.stringify(user));

            dispatch({
              type: "update",
              auth: {
                user: user,
              },
            });
          }, 350);
        })

        .catch((error) => {
          console.error("error", error);
        });
    }
  };
  return { updateProfile };
};

export default useUpdate;
