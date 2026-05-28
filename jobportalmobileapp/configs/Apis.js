import axios from "axios";

export const endpoints = {
    'login': '/o/token/', 
    'register': '/users/register/',
    "change-password": '/users/change-password/',
    'current-user': '/users/current-user/', 
    'categories': '/categories/',
    'category-jobs': (id) => `/categories/${id}/jobs/`,
    'jobs': '/jobs/', 
    'job-details': (id) => `/jobs/${id}/`, 
    'my-jobs': '/jobs/my-jobs/',
    'applications': '/applications/', 
    'application-status': (id) => `/applications/${id}/review/`, 
    'saved-jobs': '/saved-jobs/', 
    'saved-job-delete': (id) => `/saved-jobs/${id}/`, 
    'current-employer': '/employers/current-employer/',
    'dashboard-stats': '/employers/stats/',
}   

export const authApis = (token) => {
    return axios.create({
        baseURL: "http://192.168.1.47:8000/",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export default axios.create({
    baseURL: "http://192.168.1.47:8000/"
})