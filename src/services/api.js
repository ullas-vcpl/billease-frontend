import axios from "axios";

const api = axios.create({
    baseURL: "https://billease-backend-pmbd.onrender.com/api",
    withCredentials: true
});

export default api;