// React hooks for data management
import { useState, useEffect, useCallback } from "react";
import {
  Patient,
  TherapySession,
  Feedback,
  Notification,
  ProgressMilestone,
} from "@/lib/data";
import {
  initializeData,
  patientService,
  sessionService,
  feedbackService,
  notificationService,
  progressService,
  authService,
  practitionerService,
  therapyTypeService,
} from "@/lib/storage";

// Initialize data when hooks are first used
let dataInitialized = false;

const ensureDataInitialized = () => {
  if (!dataInitialized) {
    initializeData();
    dataInitialized = true;
  }
};

// Current user hook
export const useAuth = () => {
  ensureDataInitialized();
  const [user, setUser] = useState(authService.getCurrentUser());

  const login = useCallback(
    (
      email: string,
      password: string,
      userType: "patient" | "practitioner" | "admin"
    ) => {
      const loggedInUser = authService.login(email, password, userType);
      setUser(loggedInUser);
      return loggedInUser;
    },
    []
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return { user, login, logout };
};

// Patients hook
export const usePatients = () => {
  ensureDataInitialized();
  const [patients, setPatients] = useState<Patient[]>(() =>
    patientService.getAll()
  );

  const addPatient = useCallback((patientData: Omit<Patient, "id">) => {
    const newPatient = patientService.create(patientData);
    setPatients(patientService.getAll());
    return newPatient;
  }, []);

  const updatePatient = useCallback((id: string, updates: Partial<Patient>) => {
    const updatedPatient = patientService.update(id, updates);
    if (updatedPatient) {
      setPatients(patientService.getAll());
    }
    return updatedPatient;
  }, []);

  const deletePatient = useCallback((id: string) => {
    const success = patientService.delete(id);
    if (success) {
      setPatients(patientService.getAll());
    }
    return success;
  }, []);

  const getPatientById = useCallback((id: string) => {
    return patientService.getById(id);
  }, []);

  return {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
  };
};

// Sessions hook
export const useSessions = (patientId?: string, practitionerId?: string) => {
  ensureDataInitialized();
  const [sessions, setSessions] = useState<TherapySession[]>(() => {
    if (patientId) return sessionService.getByPatient(patientId);
    if (practitionerId) return sessionService.getByPractitioner(practitionerId);
    return sessionService.getAll();
  });

  const refreshSessions = useCallback(() => {
    if (patientId) {
      setSessions(sessionService.getByPatient(patientId));
    } else if (practitionerId) {
      setSessions(sessionService.getByPractitioner(practitionerId));
    } else {
      setSessions(sessionService.getAll());
    }
  }, [patientId, practitionerId]);

  const addSession = useCallback(
    (sessionData: Omit<TherapySession, "id">) => {
      const newSession = sessionService.create(sessionData);
      refreshSessions();
      return newSession;
    },
    [refreshSessions]
  );

  const updateSession = useCallback(
    (id: string, updates: Partial<TherapySession>) => {
      const updatedSession = sessionService.update(id, updates);
      if (updatedSession) {
        refreshSessions();
      }
      return updatedSession;
    },
    [refreshSessions]
  );

  const deleteSession = useCallback(
    (id: string) => {
      const success = sessionService.delete(id);
      if (success) {
        refreshSessions();
      }
      return success;
    },
    [refreshSessions]
  );

  const getUpcomingSessions = useCallback((limit?: number) => {
    return sessionService.getUpcoming(limit);
  }, []);

  const getSessionsByDateRange = useCallback(
    (startDate: string, endDate: string) => {
      return sessionService.getByDateRange(startDate, endDate);
    },
    []
  );

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  return {
    sessions,
    addSession,
    updateSession,
    deleteSession,
    getUpcomingSessions,
    getSessionsByDateRange,
    refreshSessions,
  };
};

// Feedback hook
export const useFeedback = (patientId?: string) => {
  ensureDataInitialized();
  const [feedback, setFeedback] = useState<Feedback[]>(() => {
    return patientId
      ? feedbackService.getByPatient(patientId)
      : feedbackService.getAll();
  });

  const refreshFeedback = useCallback(() => {
    if (patientId) {
      setFeedback(feedbackService.getByPatient(patientId));
    } else {
      setFeedback(feedbackService.getAll());
    }
  }, [patientId]);

  const addFeedback = useCallback(
    (feedbackData: Omit<Feedback, "id" | "timestamp">) => {
      const newFeedback = feedbackService.create(feedbackData);
      refreshFeedback();
      return newFeedback;
    },
    [refreshFeedback]
  );

  const updateFeedback = useCallback(
    (id: string, updates: Partial<Feedback>) => {
      const updatedFeedback = feedbackService.update(id, updates);
      if (updatedFeedback) {
        refreshFeedback();
      }
      return updatedFeedback;
    },
    [refreshFeedback]
  );

  const getAverageRating = useCallback(() => {
    return feedbackService.getAverageRating(patientId);
  }, [patientId]);

  const getFeedbackBySession = useCallback((sessionId: string) => {
    return feedbackService.getBySession(sessionId);
  }, []);

  useEffect(() => {
    refreshFeedback();
  }, [refreshFeedback]);

  return {
    feedback,
    addFeedback,
    updateFeedback,
    getAverageRating,
    getFeedbackBySession,
  };
};

// Notifications hook
export const useNotifications = (patientId?: string) => {
  ensureDataInitialized();
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    return patientId
      ? notificationService.getByPatient(patientId)
      : notificationService.getAll();
  });

  const refreshNotifications = useCallback(() => {
    if (patientId) {
      setNotifications(notificationService.getByPatient(patientId));
    } else {
      setNotifications(notificationService.getAll());
    }
  }, [patientId]);

  const addNotification = useCallback(
    (notificationData: Omit<Notification, "id" | "timestamp">) => {
      const newNotification = notificationService.create(notificationData);
      refreshNotifications();
      return newNotification;
    },
    [refreshNotifications]
  );

  const markAsRead = useCallback(
    (id: string) => {
      const success = notificationService.markAsRead(id);
      if (success) {
        refreshNotifications();
      }
      return success;
    },
    [refreshNotifications]
  );

  const markAllAsRead = useCallback(() => {
    const count = notificationService.markAllAsRead();
    refreshNotifications();
    return count;
  }, [refreshNotifications]);

  const getUnreadNotifications = useCallback(() => {
    return notificationService.getUnread();
  }, []);

  const getUnreadCount = useCallback(() => {
    return notificationService.getUnread().length;
  }, []);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    getUnreadNotifications,
    getUnreadCount,
  };
};

// Progress hook
export const useProgress = (patientId?: string) => {
  ensureDataInitialized();
  const [milestones, setMilestones] = useState<ProgressMilestone[]>(() => {
    return progressService.getMilestones(patientId);
  });

  const refreshMilestones = useCallback(() => {
    setMilestones(progressService.getMilestones(patientId));
  }, [patientId]);

  const updateMilestone = useCallback(
    (id: string, updates: Partial<ProgressMilestone>) => {
      const updatedMilestone = progressService.updateMilestone(id, updates);
      if (updatedMilestone) {
        refreshMilestones();
      }
      return updatedMilestone;
    },
    [refreshMilestones]
  );

  const getProgressStats = useCallback(() => {
    return patientId ? progressService.getProgressStats(patientId) : null;
  }, [patientId]);

  useEffect(() => {
    refreshMilestones();
  }, [refreshMilestones]);

  return {
    milestones,
    updateMilestone,
    getProgressStats,
  };
};

// Practitioners hook
export const usePractitioners = () => {
  ensureDataInitialized();
  const [practitioners] = useState(() => practitionerService.getAll());

  const getPractitionerById = useCallback((id: string) => {
    return practitionerService.getById(id);
  }, []);

  const getAvailablePractitioners = useCallback(
    (date: string, time: string) => {
      return practitionerService.getAvailable(date, time);
    },
    []
  );

  return {
    practitioners,
    getPractitionerById,
    getAvailablePractitioners,
  };
};

// Therapy types hook
export const useTherapyTypes = () => {
  ensureDataInitialized();
  const [therapyTypes] = useState(() => therapyTypeService.getAll());

  const getTherapyTypeById = useCallback((id: string) => {
    return therapyTypeService.getById(id);
  }, []);

  const getTherapyTypesByCategory = useCallback((category: string) => {
    return therapyTypeService.getByCategory(category);
  }, []);

  return {
    therapyTypes,
    getTherapyTypeById,
    getTherapyTypesByCategory,
  };
};

// Dashboard data hook
export const useDashboard = (
  userType: "patient" | "practitioner" | "admin",
  userId?: string
) => {
  const { sessions } = useSessions(
    userType === "patient" ? userId : undefined,
    userType === "practitioner" ? userId : undefined
  );
  const { notifications } = useNotifications(
    userType === "patient" ? userId : undefined
  );
  const { feedback } = useFeedback(userType === "patient" ? userId : undefined);
  const progressData = useProgress(userType === "patient" ? userId : undefined);

  const dashboardStats = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekStart = thisWeek.toISOString().split("T")[0];

    const todaySessions = sessions.filter((s) => s.date === today);
    const weekSessions = sessions.filter((s) => s.date >= weekStart);
    const completedSessions = sessions.filter((s) => s.status === "Completed");
    const unreadNotifications = notifications.filter((n) => !n.read);

    return {
      todaySessions: todaySessions.length,
      weekSessions: weekSessions.length,
      completedSessions: completedSessions.length,
      totalSessions: sessions.length,
      unreadNotifications: unreadNotifications.length,
      averageRating:
        feedback.length > 0
          ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
          : 0,
      progressStats: progressData.getProgressStats
        ? progressData.getProgressStats()
        : null,
    };
  }, [sessions, notifications, feedback, progressData]);

  return {
    dashboardStats,
    recentSessions: sessions.slice(-5),
    recentNotifications: notifications.slice(0, 5),
    recentFeedback: feedback.slice(-3),
  };
};
