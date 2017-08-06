import axios from 'axios';

export default {
  fetchCourses: function (query) {
    return axios({
      method: 'post',
      url: 'http://localhost:3002/v1/courses',
      params: query,
      headers: { 'Access-Control-Allow-Origin': 'http://www.coursesdb.com' }
    });
  }
};
