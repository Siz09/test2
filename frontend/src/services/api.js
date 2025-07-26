import axios from "axios";

// Axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

// Add request interceptor to automatically attach jwtToken
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Response Error:", error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem("jwtToken");
      }
    } else if (error.request) {
      console.error("API Request Error:", error.request);
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API services
const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("jwtToken", response.data.token);
}
return response.data;

  },

  signup: async (userData) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },

  // partnerSignup: async (partnerData) => {
  //   const response = await api.post("/auth/partner-signup", partnerData);
  //   return response.data;
  // },

  requestPasswordReset: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("jwtToken");
    
  },

  isAuthenticated: () => !!localStorage.getItem("jwtToken"),
};

// Venue API services
const venueService = {
 addVenue: async (venueData) => {
  const token = localStorage.getItem("jwtToken");
  console.log("Sending token:", token);
  const response = await api.post("/venues/new", venueData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
},

 addVenueA: async (venueData) => {
  const token = localStorage.getItem("jwtToken");
  console.log("Sending token:", token);
  const response = await api.post("/venues/add", venueData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
},

  getVenue: async (id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.get(`/venues/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

listVenue: async () => {
  const token = localStorage.getItem('jwtToken');
  const response = await api.get("/venues", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
},

  deleteVenue: async (id) => {
    const response = await api.delete(`/venues/delete/${id}`);
    return response.data;
  },

  editVenue: async (id, venueData) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.put(`/venues/edit/${id}`, venueData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

};

// User API services
const userService = {
 listUsers: async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  // Add new user
  addUser: async (userData) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.post("/admin/users/new", userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

// Get user details
  getUser: async (id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.get(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  // Update user
  editUser: async (id, userData) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.put(`/admin/users/edit/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

   // Delete user
  deleteUser: async (userId) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
  console.error('No JWT token found — user might need to log in again');
  return;
}
console.log('JWT Token:', token);
    const xsrfToken = getCookie('XSRF-TOKEN');
    const response = await api.delete(`/admin/users/delete/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
},


  changeUserStatus: async (id, status) => {

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.patch(`/admin/users/status/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

const partnerService = {
  
 listPartners: async () => {
    try {
      const response = await api.get("/admin/partners");
      console.log("API response data:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getPartner: async (id) => {
    try {
      const response = await api.get(`/admin/partners/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },



    addPartner: async (partnerData) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.post("/admin/partners/new", partnerData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  editPartner: async (id, partnerData) => {
    try {
      const response = await api.put(`/admin/partners/edit/${id}`, partnerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePartner: async (id) => {
    try {
      const response = await api.delete(`/admin/partners/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updatePartnerStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/partners/status/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export { api, authService, venueService, userService, partnerService,profileService ,imageService};

// Contact API service
const contactService = {
  sendMessage: async (contactData) => {
    try {
      const response = await api.post("/contact", contactData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Notifications API service
const notificationService = {
  getUserNotifications: async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.patch(`/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.patch("/notifications/mark-all-read", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


const bookingService = {

 createBooking: async (payload) => {
  const token = localStorage.getItem("jwtToken");
  const response = await api.post("/bookings/new", payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
},

    listBooking: async () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    console.error('No JWT token found. Please log in.');
    return null; // Or handle as appropriate
  }

  try {
    console.log('JWT Token:', token);
    const response = await api.get("/bookings", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Booking Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error; // Or handle as appropriate
  }
},


  getUserBookings: async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.get("/bookings/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBookingById: async (bookingId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await api.get(`/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  editBooking: async (bookingId,bookingData) => {
    try {
      const response = await api.put(`/bookings/edit/${bookingId}`, bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

const profileService = {
  getProfile: async (userId) => {
    const token = localStorage.getItem('jwtToken');
    const response = await api.get(`/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

const imageService = {
  getImage: async (venue_id) => {
    const token = localStorage.getItem('jwtToken');

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get(`/proxy/image?venue_id=${venue_id}`, {
        headers,
        responseType: 'blob',
      });
      return response.data;  // blob data
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
  },
};





export { contactService, notificationService, bookingService };
// // In your services/api.js file
// const adduserService = {
//   // ... other user service methods
  
//   createUser: async (userData) => {
//     try {
//       const token = localStorage.getItem('jwtToken');
//       const response = await api.post('/admin/users', userData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   updateUserStatus: async (id, status) => {
//     try {
//       const token = localStorage.getItem('jwtToken');
//       const response = await api.patch(`/admin/users/status/${id}`, { status }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };
// export { adduserService }

// Additional user creation service (if needed separately)
// const adduserService = {
//   createUser: async (userData) => {
//     const response = await api.post("/admin/users", userData, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   },
// };

// export { api, authService, venueService, userService, adduserService };