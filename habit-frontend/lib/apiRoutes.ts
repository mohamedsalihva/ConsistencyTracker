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
    CHECKIN: (id: string) => `/habits/${id}/checkin`,
    STATS: (id: string) => `/habits/${id}/stats`,
    UPDATE: (id: string) => `/habits/${id}`,
    DELETE: (id: string) => `/habits/${id}`,
  },

  AI: {
    CHAT: "/ai/chat",
  },
  WORKSPACE: {
    MY_INVITE: "/workspace/my-invite",
  },
  NOTIFICATION: {
  MY_HISTORY: "/notification/my-history",
},

};

export default API;
