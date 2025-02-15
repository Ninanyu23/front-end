import axios from "axios";

const api = axios.create({
  baseURL: "https://storyteller-backend.site/api", // ✅ 백엔드 URL
  withCredentials: true,  // ✅ 쿠키 인증 포함
});

// ✅ 항상 최신 토큰을 가져와 요청 헤더에 추가
api.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// ✅ 토큰 만료 시 자동 리프레시
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      console.warn("🔄 토큰 만료됨, 새 토큰 요청 중...");

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error("❌ 리프레시 토큰 없음. 로그인 필요!");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // 새 accessToken 요청
        const res = await axios.post("https://storyteller-backend.site/api/auth/refresh", {
          refreshToken
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;

        // 원래 요청 다시 시도
        return api(error.config);
      } catch (refreshError) {
        console.error("❌ 리프레시 토큰도 만료됨. 로그아웃 진행!");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
