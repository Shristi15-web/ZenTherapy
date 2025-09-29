// localStorage service for Panchakarma Management System
import {
  Patient,
  TherapyType,
  TherapySession,
  Practitioner,
  Feedback,
  Notification,
  ProgressMilestone,
  mockPatients,
  mockTherapyTypes,
  mockPractitioners,
  generateMockSessions,
  generateMockFeedback,
  generateMockNotifications,
  generateMockMilestones,
} from "./data";

const STORAGE_KEYS = {
  PATIENTS: "panchakarma_patients",
  THERAPY_TYPES: "panchakarma_therapy_types",
  PRACTITIONERS: "panchakarma_practitioners",
  SESSIONS: "panchakarma_sessions",
  FEEDBACK: "panchakarma_feedback",
  NOTIFICATIONS: "panchakarma_notifications",
  MILESTONES: "panchakarma_milestones",
  CURRENT_USER: "panchakarma_current_user",
  SETTINGS: "panchakarma_settings",
};

// Initialize data if not exists
export const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(mockPatients));
  }

  if (!localStorage.getItem(STORAGE_KEYS.THERAPY_TYPES)) {
    localStorage.setItem(
      STORAGE_KEYS.THERAPY_TYPES,
      JSON.stringify(mockTherapyTypes)
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.PRACTITIONERS)) {
    localStorage.setItem(
      STORAGE_KEYS.PRACTITIONERS,
      JSON.stringify(mockPractitioners)
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    const sessions = generateMockSessions();
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }

  if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
    const sessions = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.SESSIONS) || "[]"
    );
    const feedback = generateMockFeedback(sessions);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedback));
  }

  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    const notifications = generateMockNotifications();
    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(notifications)
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.MILESTONES)) {
    const milestones = generateMockMilestones();
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
  }
};

// Patient Management
export const patientService = {
  getAll: (): Patient[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || "[]");
  },

  getById: (id: string): Patient | undefined => {
    const patients = patientService.getAll();
    return patients.find((p) => p.id === id);
  },

  create: (patient: Omit<Patient, "id">): Patient => {
    const patients = patientService.getAll();
    const newPatient: Patient = {
      ...patient,
      id: `p${Date.now()}`,
    };
    patients.push(newPatient);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    return newPatient;
  },

  update: (id: string, updates: Partial<Patient>): Patient | null => {
    const patients = patientService.getAll();
    const index = patients.findIndex((p) => p.id === id);
    if (index === -1) return null;

    patients[index] = { ...patients[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    return patients[index];
  },

  delete: (id: string): boolean => {
    const patients = patientService.getAll();
    const filtered = patients.filter((p) => p.id !== id);
    if (filtered.length === patients.length) return false;

    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(filtered));
    return true;
  },
};

// Session Management
export const sessionService = {
  getAll: (): TherapySession[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || "[]");
  },

  getById: (id: string): TherapySession | undefined => {
    const sessions = sessionService.getAll();
    return sessions.find((s) => s.id === id);
  },

  getByPatient: (patientId: string): TherapySession[] => {
    const sessions = sessionService.getAll();
    return sessions.filter((s) => s.patientId === patientId);
  },

  getByPractitioner: (practitionerId: string): TherapySession[] => {
    const sessions = sessionService.getAll();
    return sessions.filter((s) => s.practitionerId === practitionerId);
  },

  getByDateRange: (startDate: string, endDate: string): TherapySession[] => {
    const sessions = sessionService.getAll();
    return sessions.filter((s) => s.date >= startDate && s.date <= endDate);
  },

  create: (session: Omit<TherapySession, "id">): TherapySession => {
    const sessions = sessionService.getAll();
    const newSession: TherapySession = {
      ...session,
      id: `s${Date.now()}`,
    };
    sessions.push(newSession);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

    // Create automatic notifications
    notificationService.createSessionReminder(newSession);

    return newSession;
  },

  update: (
    id: string,
    updates: Partial<TherapySession>
  ): TherapySession | null => {
    const sessions = sessionService.getAll();
    const index = sessions.findIndex((s) => s.id === id);
    if (index === -1) return null;

    sessions[index] = { ...sessions[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    return sessions[index];
  },

  delete: (id: string): boolean => {
    const sessions = sessionService.getAll();
    const filtered = sessions.filter((s) => s.id !== id);
    if (filtered.length === sessions.length) return false;

    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(filtered));
    return true;
  },

  getUpcoming: (limit: number = 10): TherapySession[] => {
    const sessions = sessionService.getAll();
    const today = new Date().toISOString().split("T")[0];
    return sessions
      .filter((s) => s.date >= today && s.status === "Scheduled")
      .sort(
        (a, b) =>
          new Date(a.date + " " + a.time).getTime() -
          new Date(b.date + " " + b.time).getTime()
      )
      .slice(0, limit);
  },
};

// Feedback Management
export const feedbackService = {
  getAll: (): Feedback[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK) || "[]");
  },

  getById: (id: string): Feedback | undefined => {
    const feedback = feedbackService.getAll();
    return feedback.find((f) => f.id === id);
  },

  getBySession: (sessionId: string): Feedback | undefined => {
    const feedback = feedbackService.getAll();
    return feedback.find((f) => f.sessionId === sessionId);
  },

  getByPatient: (patientId: string): Feedback[] => {
    const feedback = feedbackService.getAll();
    return feedback.filter((f) => f.patientId === patientId);
  },

  create: (feedback: Omit<Feedback, "id" | "timestamp">): Feedback => {
    const allFeedback = feedbackService.getAll();
    const newFeedback: Feedback = {
      ...feedback,
      id: `f${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    allFeedback.push(newFeedback);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(allFeedback));

    // Update progress based on feedback
    progressService.updateProgressFromFeedback(newFeedback);

    return newFeedback;
  },

  update: (id: string, updates: Partial<Feedback>): Feedback | null => {
    const feedback = feedbackService.getAll();
    const index = feedback.findIndex((f) => f.id === id);
    if (index === -1) return null;

    feedback[index] = { ...feedback[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedback));
    return feedback[index];
  },

  getAverageRating: (patientId?: string): number => {
    const feedback = patientId
      ? feedbackService.getByPatient(patientId)
      : feedbackService.getAll();

    if (feedback.length === 0) return 0;

    const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
    return totalRating / feedback.length;
  },
};

// Notification Management
export const notificationService = {
  getAll: (): Notification[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "[]");
  },

  getUnread: (): Notification[] => {
    return notificationService.getAll().filter((n) => !n.read);
  },

  getByPatient: (patientId: string): Notification[] => {
    return notificationService
      .getAll()
      .filter((n) => n.patientId === patientId);
  },

  create: (
    notification: Omit<Notification, "id" | "timestamp">
  ): Notification => {
    const notifications = notificationService.getAll();
    const newNotification: Notification = {
      ...notification,
      id: `n${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    notifications.unshift(newNotification); // Add to beginning
    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(notifications)
    );
    return newNotification;
  },

  markAsRead: (id: string): boolean => {
    const notifications = notificationService.getAll();
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return false;

    notifications[index].read = true;
    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(notifications)
    );
    return true;
  },

  markAllAsRead: (): number => {
    const notifications = notificationService.getAll();
    let updatedCount = 0;

    notifications.forEach((notification) => {
      if (!notification.read) {
        notification.read = true;
        updatedCount++;
      }
    });

    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(notifications)
    );
    return updatedCount;
  },

  createSessionReminder: (session: TherapySession): void => {
    const patient = patientService.getById(session.patientId);
    if (!patient) return;

    // Pre-session reminder
    notificationService.create({
      type: "Reminder",
      title: "Upcoming Therapy Session",
      message: `Your ${session.therapyTypeId} session is scheduled for ${session.date} at ${session.time}. Please review pre-care instructions.`,
      read: false,
      patientId: session.patientId,
      sessionId: session.id,
      channels: { inApp: true, email: true, sms: true },
      priority: "Medium",
    });

    // Pre-care instructions
    const therapyType = therapyTypeService.getById(session.therapyTypeId);
    if (therapyType && therapyType.preparations.length > 0) {
      notificationService.create({
        type: "Pre-Care",
        title: "Pre-Treatment Preparation",
        message: `Please follow these preparations for your upcoming session: ${therapyType.preparations
          .slice(0, 2)
          .join(", ")}`,
        read: false,
        patientId: session.patientId,
        sessionId: session.id,
        channels: { inApp: true, email: true, sms: false },
        priority: "High",
      });
    }
  },

  createPostCareReminder: (session: TherapySession): void => {
    const therapyType = therapyTypeService.getById(session.therapyTypeId);
    if (!therapyType) return;

    notificationService.create({
      type: "Post-Care",
      title: "Post-Treatment Care",
      message: `Please follow post-care instructions: ${therapyType.postCareInstructions
        .slice(0, 2)
        .join(", ")}`,
      read: false,
      patientId: session.patientId,
      sessionId: session.id,
      channels: { inApp: true, email: true, sms: false },
      priority: "High",
    });
  },
};

// Therapy Type Management
export const therapyTypeService = {
  getAll: (): TherapyType[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.THERAPY_TYPES) || "[]");
  },

  getById: (id: string): TherapyType | undefined => {
    const therapyTypes = therapyTypeService.getAll();
    return therapyTypes.find((t) => t.id === id);
  },

  getByCategory: (category: string): TherapyType[] => {
    const therapyTypes = therapyTypeService.getAll();
    return therapyTypes.filter((t) => t.category === category);
  },
};

// Practitioner Management
export const practitionerService = {
  getAll: (): Practitioner[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRACTITIONERS) || "[]");
  },

  getById: (id: string): Practitioner | undefined => {
    const practitioners = practitionerService.getAll();
    return practitioners.find((p) => p.id === id);
  },

  getAvailable: (date: string, time: string): Practitioner[] => {
    const practitioners = practitionerService.getAll();
    const sessions = sessionService.getByDateRange(date, date);
    const busyPractitioners = sessions
      .filter((s) => s.time === time)
      .map((s) => s.practitionerId);

    return practitioners.filter((p) => !busyPractitioners.includes(p.id));
  },
};

// Progress Management
export const progressService = {
  getMilestones: (patientId?: string): ProgressMilestone[] => {
    const milestones = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MILESTONES) || "[]"
    );
    return patientId
      ? milestones.filter((m: ProgressMilestone) => m.patientId === patientId)
      : milestones;
  },

  updateMilestone: (
    id: string,
    updates: Partial<ProgressMilestone>
  ): ProgressMilestone | null => {
    const milestones = progressService.getMilestones();
    const index = milestones.findIndex((m) => m.id === id);
    if (index === -1) return null;

    milestones[index] = { ...milestones[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
    return milestones[index];
  },

  updateProgressFromFeedback: (feedback: Feedback): void => {
    const milestones = progressService.getMilestones(feedback.patientId);
    const inProgressMilestones = milestones.filter(
      (m) => m.status === "In Progress"
    );

    // Update milestones based on feedback ratings
    inProgressMilestones.forEach((milestone) => {
      milestone.metrics.forEach((metric) => {
        if (feedback.rating >= 4) {
          // Good feedback improves progress
          metric.current = Math.min(
            metric.target,
            metric.current + metric.target * 0.1
          );
        }

        // Check if milestone is achieved
        const allMetricsAchieved = milestone.metrics.every(
          (m) => m.current >= m.target
        );
        if (allMetricsAchieved && milestone.status !== "Achieved") {
          milestone.status = "Achieved";
          milestone.achievedDate = new Date().toISOString().split("T")[0];

          // Create progress notification
          notificationService.create({
            type: "Progress",
            title: "Milestone Achieved!",
            message: `Congratulations! You have achieved: ${milestone.title}`,
            read: false,
            patientId: feedback.patientId,
            channels: { inApp: true, email: true, sms: false },
            priority: "High",
          });
        }
      });
    });

    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
  },

  getProgressStats: (patientId: string) => {
    const milestones = progressService.getMilestones(patientId);
    const feedback = feedbackService.getByPatient(patientId);
    const sessions = sessionService.getByPatient(patientId);

    const totalMilestones = milestones.length;
    const achievedMilestones = milestones.filter(
      (m) => m.status === "Achieved"
    ).length;
    const completedSessions = sessions.filter(
      (s) => s.status === "Completed"
    ).length;
    const averageRating = feedbackService.getAverageRating(patientId);

    return {
      milestoneProgress:
        totalMilestones > 0 ? (achievedMilestones / totalMilestones) * 100 : 0,
      completedSessions,
      totalSessions: sessions.length,
      averageRating,
      recentFeedback: feedback.slice(-5),
    };
  },
};

// Authentication (mock)
export const authService = {
  login: (
    email: string,
    password: string,
    userType: "patient" | "practitioner" | "admin"
  ) => {
    // Mock authentication
    const user = {
      id:
        userType === "patient"
          ? "p1"
          : userType === "practitioner"
          ? "pr1"
          : "admin1",
      email,
      type: userType,
      name:
        userType === "patient"
          ? "Sarah Johnson"
          : userType === "practitioner"
          ? "Dr. Meera Sharma"
          : "Admin User",
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Settings Management
export const settingsService = {
  getSettings: () => {
    const defaultSettings = {
      notifications: {
        email: true,
        sms: true,
        inApp: true,
        reminderHours: 24,
      },
      preferences: {
        theme: "light",
        language: "en",
        timezone: "UTC",
      },
    };

    const settingsStr = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsStr
      ? { ...defaultSettings, ...JSON.parse(settingsStr) }
      : defaultSettings;
  },

  updateSettings: (updates: any) => {
    const currentSettings = settingsService.getSettings();
    const newSettings = { ...currentSettings, ...updates };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    return newSettings;
  },
};

// Export STORAGE_KEYS
export { STORAGE_KEYS };
