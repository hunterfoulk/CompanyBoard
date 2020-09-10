import axios from "axios";

let token;
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  token = user.token;
}
const BACKEND_URL =
  "http://localhost:9000/.netlify/functions/server/companyboard/";
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default api;
