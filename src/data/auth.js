// Mock data for user profiles and authentication
// This data simulates user management that would typically use a real auth system

export const mockUsers = [
  {
    id: "user1",
    email: "sarah.johnson@email.com",
    name: "Sarah Johnson",
    role: "patient",
    avatar: "/placeholder.svg",
    phone: "+1-555-0123",
    dateOfBirth: "1985-03-15",
    address: {
      street: "123 Wellness St",
      city: "Harmony City",
      state: "HC",
      zipCode: "12345",
      country: "USA",
    },
    emergencyContact: {
      name: "John Johnson",
      phone: "+1-555-0124",
      relationship: "Spouse",
    },
    constitution: "Vata",
    joinDate: "2024-09-01",
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      language: "English",
      theme: "light",
      timezone: "America/New_York",
    },
    medicalHistory: ["Hypertension", "Anxiety", "Digestive issues"],
    allergies: ["Nuts", "Shellfish"],
    currentConditions: ["Chronic stress", "Digestive disorders"],
    goals: ["Stress reduction", "Better sleep", "Improved digestion"],
  },
  {
    id: "admin1",
    email: "admin@zentherapy.com",
    name: "Admin User",
    role: "admin",
    avatar: "/placeholder.svg",
    phone: "+1-555-0001",
    joinDate: "2024-01-01",
    permissions: [
      "manage_users",
      "view_analytics",
      "manage_appointments",
      "manage_content",
    ],
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      language: "English",
      theme: "dark",
      timezone: "America/Los_Angeles",
    },
  },
  {
    id: "practitioner1",
    email: "meera.sharma@zentherapy.com",
    name: "Dr. Meera Sharma",
    role: "practitioner",
    avatar: "/placeholder.svg",
    phone: "+1-555-0200",
    practitionerId: "t1", // Links to therapists.js
    joinDate: "2024-01-15",
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      language: "English",
      theme: "light",
      timezone: "America/New_York",
    },
  },
];

// Mock authentication state
export const authState = {
  isAuthenticated: false,
  currentUser: null,
  token: null,
};

/**
 * Simulated authentication functions
 * In a real app, these would interact with a backend API
 */

export const authService = {
  /**
   * Simulate user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Login result
   */
  login: async (email, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = mockUsers.find((u) => u.email === email);

    if (user && password === "password123") {
      // Mock password check
      const token = btoa(
        JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 })
      ); // 24 hours

      authState.isAuthenticated = true;
      authState.currentUser = user;
      authState.token = token;

      // Store in localStorage
      localStorage.setItem("zen_auth_token", token);
      localStorage.setItem("zen_current_user", JSON.stringify(user));

      return { success: true, user, token };
    }

    return { success: false, error: "Invalid credentials" };
  },

  /**
   * Simulate user logout
   */
  logout: () => {
    authState.isAuthenticated = false;
    authState.currentUser = null;
    authState.token = null;

    localStorage.removeItem("zen_auth_token");
    localStorage.removeItem("zen_current_user");
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated: () => {
    const token = localStorage.getItem("zen_auth_token");
    if (!token) return false;

    try {
      const decoded = JSON.parse(atob(token));
      return decoded.exp > Date.now();
    } catch {
      return false;
    }
  },

  /**
   * Get current user from localStorage
   * @returns {object|null} - Current user or null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem("zen_current_user");
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Update user profile
   * @param {object} updates - Profile updates
   * @returns {Promise} - Update result
   */
  updateProfile: async (updates) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentUser = authService.getCurrentUser();
    if (!currentUser) return { success: false, error: "Not authenticated" };

    const updatedUser = { ...currentUser, ...updates };

    // Update in mockUsers array
    const userIndex = mockUsers.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = updatedUser;
    }

    // Update localStorage
    localStorage.setItem("zen_current_user", JSON.stringify(updatedUser));
    authState.currentUser = updatedUser;

    return { success: true, user: updatedUser };
  },
};

// Demo credentials for testing
export const demoCredentials = {
  patient: {
    email: "sarah.johnson@email.com",
    password: "password123",
    role: "patient",
  },
  admin: {
    email: "admin@zentherapy.com",
    password: "password123",
    role: "admin",
  },
  practitioner: {
    email: "meera.sharma@zentherapy.com",
    password: "password123",
    role: "practitioner",
  },
};
