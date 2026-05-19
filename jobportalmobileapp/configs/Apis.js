import axios from "axios";

export const endpoints = {
    'login': '/o/token/', 
    'register': '/users/register/',
    'current-user': '/users/current-user/', 
    //Category
    'categories': '/categories/',
    'category-jobs': (id) => `/categories/${id}/jobs/`,
    'category-skills': (id) => `/categories/${id}/skills/`,

    //Jobs
    'jobs': '/jobs/', // Candidate lấy list ở Home, Employer gọi POST để tạo job mới
    'job-details': (id) => `/jobs/${id}/`, // Xem chi tiết (GET), Cập nhật (PUT/PATCH), Xóa bài đăng (DELETE)
    
    //Applications
    'applications': '/applications/', // Candidate xem danh sách đã nộp (GET) hoặc Nộp đơn mới (POST)
    'application-status': (id) => `/applications/${id}/status/`, // Employer duyệt/từ chối hồ sơ (PATCH)

    //Saved jobs
    'saved-jobs': '/saved-jobs/', // Xem danh sách việc đã lưu (GET), Lưu việc (POST)
    'saved-job-delete': (id) => `/saved-jobs/${id}/`, // Bỏ lưu việc (DELETE)

    //Skills
    'skills': '/skills/', // Lấy toàn bộ danh sách kỹ năng hệ thống (GET)
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