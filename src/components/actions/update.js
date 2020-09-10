import { useStateValue } from "../../state";
import axios from "axios";

const useUpdate = () => {
  const [{ auth, components }, dispatch] = useStateValue();

  const handleUpdatePic = async (user_id, picFile) => {
    let formData = new FormData();

    formData.append("user_id", user_id);
    formData.append("picFile", picFile);

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
        console.log("new profile pic sent");
        localStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: "update",
          auth: {
            user: user,
          },
        });
      })

      .catch((error) => {
        console.error("error", error);
      });
  };
  return handleUpdatePic;
};

export default useUpdate;
