import API from './apiInstance';

// Existing function to get all courses
export const getCourseList = () => API.get('/courses/');

// Add the missing function to get course details by ID
export const getCourseDetailsById = (id) => API.get(`/courses/${id}/`);