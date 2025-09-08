import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://web-cvky3lyo9zj0.up-de-fra1-k8s-1.apps.run-on-seenode.com/api",
    withCredentials: true,
});  
