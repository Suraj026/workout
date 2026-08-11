import axios from "axios";

const api = axios.create({ baseURL = "http://localhost:5000" });

// request interceptor for the token to read fresh on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config
});