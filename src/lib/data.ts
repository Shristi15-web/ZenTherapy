// Data structures and mock data for Panchakarma Management System

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: string[];
  currentCondition: string;
  constitution: "Vata" | "Pitta" | "Kapha" | "Mixed";
  enrollmentDate: string;
  status: "Active" | "Completed" | "Paused";
  avatar?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface TherapyType {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  preparations: string[];
  postCareInstructions: string[];
  category: "Purification" | "Rejuvenation" | "Specialized";
  contraindications: string[];
  benefits: string[];
}

export interface TherapySession {
  id: string;
  patientId: string;
  therapyTypeId: string;
  practitionerId: string;
  date: string;
  time: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  notes: string;
  preSessionChecklist: {
    item: string;
    completed: boolean;
  }[];
  postSessionNotes: string;
  duration: number;
  room: string;
}

export interface Practitioner {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  qualification: string[];
  avatar?: string;
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
}

export interface Feedback {
  id: string;
  sessionId: string;
  patientId: string;
  rating: number; // 1-5
  symptoms: {
    before: string[];
    after: string[];
  };
  comfort: number; // 1-5
  effectiveness: number; // 1-5
  sideEffects: string[];
  comments: string;
  recommendations: string[];
  timestamp: string;
  mood: "Excellent" | "Good" | "Fair" | "Poor";
  energyLevel: number; // 1-10
  sleepQuality: number; // 1-10
  digestion: number; // 1-10
}

export interface Notification {
  id: string;
  type: "Reminder" | "Pre-Care" | "Post-Care" | "Progress" | "Alert";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  patientId?: string;
  sessionId?: string;
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
  };
  priority: "Low" | "Medium" | "High" | "Urgent";
}

export interface ProgressMilestone {
  id: string;
  patientId: string;
  title: string;
  description: string;
  targetDate: string;
  achievedDate?: string;
  status: "Pending" | "In Progress" | "Achieved" | "Overdue";
  category: "Physical" | "Mental" | "Emotional" | "Spiritual";
  metrics: {
    name: string;
    target: number;
    current: number;
    unit: string;
  }[];
}

// Mock Data
export const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0123",
    dateOfBirth: "1985-03-15",
    address: "123 Wellness St, Harmony City, HC 12345",
    medicalHistory: ["Hypertension", "Anxiety", "Digestive issues"],
    currentCondition: "Chronic stress and digestive disorders",
    constitution: "Vata",
    enrollmentDate: "2024-09-01",
    status: "Active",
    avatar: "👩‍🦰",
    emergencyContact: {
      name: "John Johnson",
      phone: "+1-555-0124",
      relationship: "Spouse",
    },
  },
  {
    id: "p2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1-555-0125",
    dateOfBirth: "1978-07-22",
    address: "456 Serenity Ave, Peace Valley, PV 67890",
    medicalHistory: ["Arthritis", "Insomnia"],
    currentCondition: "Joint pain and sleep disorders",
    constitution: "Pitta",
    enrollmentDate: "2024-08-15",
    status: "Active",
    avatar: "👨‍💼",
    emergencyContact: {
      name: "Lisa Chen",
      phone: "+1-555-0126",
      relationship: "Wife",
    },
  },
  {
    id: "p3",
    name: "Dr. Priya Patel",
    email: "priya.patel@email.com",
    phone: "+1-555-0127",
    dateOfBirth: "1982-11-08",
    address: "789 Tranquil Lane, Calm Heights, CH 13579",
    medicalHistory: ["Migraines", "Work-related stress"],
    currentCondition: "Stress management and preventive care",
    constitution: "Kapha",
    enrollmentDate: "2024-09-10",
    status: "Active",
    avatar: "👩‍⚕️",
    emergencyContact: {
      name: "Raj Patel",
      phone: "+1-555-0128",
      relationship: "Brother",
    },
  },
];

export const mockTherapyTypes: TherapyType[] = [
  {
    id: "t1",
    name: "Abhyanga",
    description: "Full-body therapeutic oil massage with warm herbal oils",
    duration: 60,
    preparations: [
      "Light meal 2 hours before",
      "Comfortable loose clothing",
      "Remove jewelry and accessories",
      "Empty bladder before session",
    ],
    postCareInstructions: [
      "Rest for 30 minutes after treatment",
      "Warm shower after 2 hours",
      "Drink warm water",
      "Avoid cold foods and drinks",
      "Light vegetarian meal recommended",
    ],
    category: "Rejuvenation",
    contraindications: [
      "Fever",
      "Acute illness",
      "Open wounds",
      "Recent surgery",
    ],
    benefits: [
      "Improved circulation",
      "Stress relief",
      "Better sleep",
      "Skin nourishment",
    ],
  },
  {
    id: "t2",
    name: "Shirodhara",
    description: "Continuous stream of warm oil poured over the forehead",
    duration: 45,
    preparations: [
      "No heavy meals 3 hours before",
      "Inform about any head injuries",
      "Remove contact lenses",
      "Tie hair back securely",
    ],
    postCareInstructions: [
      "Rest in quiet environment for 1 hour",
      "No hair washing for 24 hours",
      "Avoid loud noises and bright lights",
      "Gentle head massage with remaining oil",
    ],
    category: "Specialized",
    contraindications: [
      "Head injuries",
      "Severe hypertension",
      "Pregnancy",
      "Menstruation",
    ],
    benefits: [
      "Mental clarity",
      "Stress reduction",
      "Better sleep",
      "Nervous system balance",
    ],
  },
  {
    id: "t3",
    name: "Panchakarma Detox",
    description: "Comprehensive 7-day detoxification program",
    duration: 120,
    preparations: [
      "Pre-detox diet for 3 days",
      "Avoid alcohol and caffeine",
      "Light exercise only",
      "Early sleep schedule",
      "Mental preparation and meditation",
    ],
    postCareInstructions: [
      "Gradual reintroduction of foods",
      "Continue light activities for 1 week",
      "Maintain meditation practice",
      "Follow prescribed herbal supplements",
      "Regular follow-up sessions",
    ],
    category: "Purification",
    contraindications: [
      "Severe chronic illness",
      "Pregnancy",
      "Recent surgery",
      "Age below 16 or above 70",
    ],
    benefits: [
      "Complete detoxification",
      "Renewed energy",
      "Mental clarity",
      "Improved digestion",
    ],
  },
  {
    id: "t4",
    name: "Nasya",
    description: "Nasal administration of medicated oils or herbs",
    duration: 30,
    preparations: [
      "Clean nasal passages",
      "No cold foods before treatment",
      "Inform about nasal allergies",
      "Remove nasal jewelry",
    ],
    postCareInstructions: [
      "Avoid cold air for 2 hours",
      "No swimming or diving",
      "Gentle breathing exercises",
      "Warm beverages recommended",
    ],
    category: "Purification",
    contraindications: [
      "Nasal infections",
      "Severe allergies",
      "Recent nasal surgery",
    ],
    benefits: [
      "Respiratory health",
      "Mental clarity",
      "Sinus relief",
      "Hormonal balance",
    ],
  },
];

export const mockPractitioners: Practitioner[] = [
  {
    id: "pr1",
    name: "Dr. Meera Sharma",
    email: "meera.sharma@zentherapy.com",
    phone: "+1-555-0200",
    specialization: ["Panchakarma", "Women's Health", "Stress Management"],
    experience: 15,
    qualification: ["BAMS", "MD Ayurveda", "Panchakarma Specialist"],
    avatar: "👩‍⚕️",
    workingHours: {
      start: "09:00",
      end: "17:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
  {
    id: "pr2",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@zentherapy.com",
    phone: "+1-555-0201",
    specialization: ["Detoxification", "Joint Care", "Respiratory Health"],
    experience: 12,
    qualification: ["BAMS", "Panchakarma Diploma", "Yoga Therapy"],
    avatar: "👨‍⚕️",
    workingHours: {
      start: "10:00",
      end: "18:00",
      days: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
    },
  },
  {
    id: "pr3",
    name: "Dr. Anita Reddy",
    email: "anita.reddy@zentherapy.com",
    phone: "+1-555-0202",
    specialization: ["Mental Wellness", "Shirodhara", "Meditation Therapy"],
    experience: 8,
    qualification: ["BAMS", "Psychology Diploma", "Mindfulness Certification"],
    avatar: "👩‍🔬",
    workingHours: {
      start: "11:00",
      end: "19:00",
      days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
  },
];

// Helper function to generate mock sessions
export const generateMockSessions = (): TherapySession[] => {
  const sessions: TherapySession[] = [];
  const today = new Date();

  for (let i = 0; i < 15; i++) {
    const sessionDate = new Date(today);
    sessionDate.setDate(
      today.getDate() +
        (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 30)
    );

    const session: TherapySession = {
      id: `s${i + 1}`,
      patientId:
        mockPatients[Math.floor(Math.random() * mockPatients.length)].id,
      therapyTypeId:
        mockTherapyTypes[Math.floor(Math.random() * mockTherapyTypes.length)]
          .id,
      practitionerId:
        mockPractitioners[Math.floor(Math.random() * mockPractitioners.length)]
          .id,
      date: sessionDate.toISOString().split("T")[0],
      time: ["09:00", "10:30", "14:00", "15:30", "17:00"][
        Math.floor(Math.random() * 5)
      ],
      status: ["Scheduled", "Completed", "In Progress"][
        Math.floor(Math.random() * 3)
      ] as any,
      notes: "Regular session as per treatment plan",
      preSessionChecklist: [
        { item: "Patient preparation completed", completed: true },
        { item: "Room setup verified", completed: true },
        {
          item: "Oils warmed to proper temperature",
          completed: Math.random() > 0.3,
        },
      ],
      postSessionNotes:
        Math.random() > 0.5
          ? "Session completed successfully. Patient responded well."
          : "",
      duration:
        mockTherapyTypes[Math.floor(Math.random() * mockTherapyTypes.length)]
          .duration,
      room: ["Room A", "Room B", "Room C", "VIP Suite"][
        Math.floor(Math.random() * 4)
      ],
    };

    sessions.push(session);
  }

  return sessions;
};

// Helper function to generate mock feedback
export const generateMockFeedback = (
  sessions: TherapySession[]
): Feedback[] => {
  return sessions
    .filter((session) => session.status === "Completed")
    .map((session, index) => ({
      id: `f${index + 1}`,
      sessionId: session.id,
      patientId: session.patientId,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 rating
      symptoms: {
        before: ["Stress", "Tension", "Fatigue"],
        after: ["Relaxed", "Energized", "Peaceful"],
      },
      comfort: Math.floor(Math.random() * 2) + 4,
      effectiveness: Math.floor(Math.random() * 2) + 4,
      sideEffects: Math.random() > 0.8 ? ["Mild drowsiness"] : [],
      comments: [
        "Excellent session, feeling much better!",
        "Very relaxing and therapeutic.",
        "Great improvement in my condition.",
        "Professional and caring service.",
      ][Math.floor(Math.random() * 4)],
      recommendations: [
        "Continue current treatment",
        "Increase session frequency",
      ],
      timestamp: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      mood: ["Excellent", "Good", "Fair"][Math.floor(Math.random() * 3)] as any,
      energyLevel: Math.floor(Math.random() * 3) + 7, // 7-10
      sleepQuality: Math.floor(Math.random() * 3) + 7,
      digestion: Math.floor(Math.random() * 3) + 7,
    }));
};

// Helper function to generate mock notifications
export const generateMockNotifications = (): Notification[] => {
  const notifications: Notification[] = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const notificationTime = new Date(
      now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000
    );

    const notification: Notification = {
      id: `n${i + 1}`,
      type: ["Reminder", "Pre-Care", "Post-Care", "Progress", "Alert"][
        Math.floor(Math.random() * 5)
      ] as any,
      title: [
        "Session Reminder",
        "Pre-Treatment Preparation",
        "Post-Treatment Care",
        "Progress Update",
        "Important Alert",
      ][Math.floor(Math.random() * 5)],
      message: [
        "Your Abhyanga session is scheduled for tomorrow at 2:00 PM",
        "Please follow pre-treatment guidelines for your upcoming session",
        "Remember to rest and follow post-care instructions",
        "Congratulations! You've completed 50% of your treatment plan",
        "Please update your emergency contact information",
      ][Math.floor(Math.random() * 5)],
      timestamp: notificationTime.toISOString(),
      read: Math.random() > 0.4,
      patientId:
        Math.random() > 0.3
          ? mockPatients[Math.floor(Math.random() * mockPatients.length)].id
          : undefined,
      channels: {
        inApp: true,
        email: Math.random() > 0.3,
        sms: Math.random() > 0.5,
      },
      priority: ["Low", "Medium", "High", "Urgent"][
        Math.floor(Math.random() * 4)
      ] as any,
    };

    notifications.push(notification);
  }

  return notifications;
};

// Helper function to generate mock milestones
export const generateMockMilestones = (): ProgressMilestone[] => {
  const milestones: ProgressMilestone[] = [];

  mockPatients.forEach((patient, patientIndex) => {
    for (let i = 0; i < 5; i++) {
      const milestone: ProgressMilestone = {
        id: `m${patientIndex + 1}-${i + 1}`,
        patientId: patient.id,
        title: [
          "Complete Initial Assessment",
          "Achieve 50% Stress Reduction",
          "Improve Sleep Quality",
          "Complete Detox Phase",
          "Maintain Wellness Routine",
        ][i],
        description: [
          "Complete comprehensive health assessment and create personalized treatment plan",
          "Reduce stress levels by 50% through targeted therapy sessions",
          "Achieve 7+ hours of quality sleep consistently",
          "Successfully complete the purification phase of treatment",
          "Establish sustainable daily wellness practices",
        ][i],
        targetDate: new Date(Date.now() + (i + 1) * 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        achievedDate:
          i < 2
            ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            : undefined,
        status:
          i < 2 ? "Achieved" : i === 2 ? "In Progress" : ("Pending" as any),
        category: ["Physical", "Mental", "Physical", "Physical", "Spiritual"][
          i
        ] as any,
        metrics: [
          [
            {
              name: "Assessment Completion",
              target: 100,
              current: i < 1 ? 100 : 75,
              unit: "%",
            },
            {
              name: "Health Score",
              target: 85,
              current: i < 1 ? 85 : 72,
              unit: "points",
            },
          ],
          [
            {
              name: "Stress Level",
              target: 3,
              current: i < 2 ? 3 : 6,
              unit: "/10",
            },
            {
              name: "Anxiety Score",
              target: 2,
              current: i < 2 ? 2 : 5,
              unit: "/10",
            },
          ],
          [
            { name: "Sleep Hours", target: 8, current: 6.5, unit: "hours" },
            { name: "Sleep Quality", target: 8, current: 7, unit: "/10" },
          ],
          [
            {
              name: "Detox Sessions",
              target: 7,
              current: i < 4 ? 7 : 3,
              unit: "sessions",
            },
            {
              name: "Toxin Level",
              target: 2,
              current: i < 4 ? 2 : 6,
              unit: "/10",
            },
          ],
          [
            {
              name: "Daily Practice",
              target: 90,
              current: i < 5 ? 90 : 45,
              unit: "%",
            },
            {
              name: "Wellness Score",
              target: 9,
              current: i < 5 ? 9 : 6,
              unit: "/10",
            },
          ],
        ][i],
      };

      milestones.push(milestone);
    }
  });

  return milestones;
};
