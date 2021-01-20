import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 3000
});

axiosInstance.interceptors.request.use(
  async function (config) {
    if (!config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
  return response;
  },
  function (error) {
    const originalRequest = error.config;
    const { data: {
      data: {
        message
      }
    }} = error.response;

    switch(message) {
      case 'jwt expired': {
        // 토큰 만료 => 리프레시 토큰으로 재발급 요청
        const refresh_token = localStorage.getItem('refresh_token');
        return axios.post(`${originalRequest.baseURL}/auth/refresh_token`, null, {
          headers: {
            refresh_token: `Bearer ${refresh_token}`
          }
        }).then(async ({ data }) => {
          console.log(data);
          const {data: {
            access_token, expires_in
          }} = data;

          localStorage.setItem('access_token', access_token);
          localStorage.setItem('expires_in', expires_in);

          return await axiosInstance({
            method: originalRequest.method,
            url: originalRequest.url,
            data: originalRequest.data,
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          });
        }).catch(error => {
          if( error.response.status === 400 ) {
            // 리프레시 토큰 만료
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('expires_in');
            alert('토큰이 만료되었습니다. 다시 로그인해 주세요.');
            window.location.href='/';
          }
        });
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
