import axios from "axios";

export const endpoints = {
    'categories': '/api/categories/',
    'jobs': '/api/jobs/',
}

export default axios.create({
    baseURL: "http://192.168.1.5:8000/"
})