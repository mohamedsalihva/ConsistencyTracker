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
    COMPLETE: (id: string) => `/habits/complete/${id}`,
    STATS: (id: string) => `/habits/${id}/stats`,
    UPDATE: (id:string) => `/habits/${id}`,
    DELETE: (id:string) => `/habits/${id}`
  },
};

export default API;