import API from './apiInstance';

export const getCourseDetailsById = (id) => API.get(`/courses/${id}/`);