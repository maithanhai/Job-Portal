import axios from "axios";

export const endpoints = {
    'categories': '/categories/',
    'courses': '/courses/'
}

export default axios.create({
    baseURL: "http://192.168.1.7:8000/"
})