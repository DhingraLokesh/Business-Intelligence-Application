import axios from "axios";

const axiosInstance = (isJSON = true) => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": isJSON ? "application/json" : "multipart/form-data",
    },
  });

  return instance;
};

export default axiosInstance;
