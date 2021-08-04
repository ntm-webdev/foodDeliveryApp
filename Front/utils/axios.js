import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REACT_APP_API_URL
});

axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
