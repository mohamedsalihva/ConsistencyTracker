const API = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },

  HABITS: {
    CREATE: "/habits",
    GET_ALL: "/habits",
    COMPLETE: (id: string) => `/habits/${id}/complete`,
    STATS: (id: string) => `/habits/${id}/stats`,
  },
};

export default API;