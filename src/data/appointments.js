// Mock data for appointments and booking system
// This data simulates booking functionality that would typically use a real database

import { therapists } from "./therapists.js";
import { therapyServices } from "./services.js";

export const mockAppointments = [
  {
    id: "apt1",
    patientId: "user1",
    patientName: "Sarah Johnson",
    therapistId: "t1",
    therapistName: "Dr. Meera Sharma",
    serviceId: "s2",
    serviceName: "Shirodhara",
    date: "2024-10-05",
    time: "14:00",
    duration: 45,
    status: "confirmed", // confirmed, pending, completed, cancelled
    price: 150,
    notes: "First-time patient, anxiety and stress management",
    bookingDate: "2024-09-25",
    reminderSent: false,
    paymentStatus: "paid", // paid, pending, refunded
    room: "Room B",
  },
  {
    id: "apt2",
    patientId: "user1",
    patientName: "Sarah Johnson",
    therapistId: "t1",
    therapistName: "Dr. Meera Sharma",
    serviceId: "s1",
    serviceName: "Abhyanga",
    date: "2024-10-12",
    time: "15:30",
    duration: 60,
    status: "confirmed",
    price: 120,
    notes: "Follow-up session",
    bookingDate: "2024-09-26",
    reminderSent: false,
    paymentStatus: "paid",
    room: "Room A",
  },
  {
    id: "apt3",
    patientId: "user1",
    patientName: "Sarah Johnson",
    therapistId: "t2",
    therapistName: "Dr. Rajesh Kumar",
    serviceId: "s5",
    serviceName: "Swedana",
    date: "2024-09-28",
    time: "10:00",
    duration: 30,
    status: "completed",
    price: 90,
    notes: "Preparation for detox program",
    bookingDate: "2024-09-20",
    reminderSent: true,
    paymentStatus: "paid",
    room: "Steam Room",
  },
];

// Available time slots for booking
export const generateAvailableSlots = (therapistId, date) => {
  const therapist = therapists.find((t) => t.id === therapistId);
  if (!therapist) return [];

  const dayName = new Date(date).toLocaleDateString("en-US", {
    weekday: "lowercase",
  });
  const daySchedule = therapist.workingHours[dayName];

  if (!daySchedule || !daySchedule.available) return [];

  const slots = [];
  const [startHour, startMin] = daySchedule.start.split(":").map(Number);
  const [endHour, endMin] = daySchedule.end.split(":").map(Number);

  // Check for existing appointments on this date
  const existingAppointments = mockAppointments.filter(
    (apt) =>
      apt.therapistId === therapistId &&
      apt.date === date &&
      apt.status !== "cancelled"
  );

  // Generate hourly slots
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 60) {
      // 1-hour slots
      if (hour === endHour - 1 && minute + 60 > endMin) break;

      const timeSlot = `${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;

      // Check if slot is already booked
      const isBooked = existingAppointments.some(
        (apt) => apt.time === timeSlot
      );

      if (!isBooked) {
        slots.push({
          time: timeSlot,
          available: true,
          therapistId: therapistId,
          date: date,
        });
      }
    }
  }

  return slots;
};

// Booking service functions
export const bookingService = {
  /**
   * Create a new appointment
   * @param {object} appointmentData - Appointment details
   * @returns {Promise} - Booking result
   */
  createAppointment: async (appointmentData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validate required fields
    const required = ["patientId", "therapistId", "serviceId", "date", "time"];
    for (const field of required) {
      if (!appointmentData[field]) {
        return { success: false, error: `${field} is required` };
      }
    }

    // Check if slot is still available
    const existingAppointment = mockAppointments.find(
      (apt) =>
        apt.therapistId === appointmentData.therapistId &&
        apt.date === appointmentData.date &&
        apt.time === appointmentData.time &&
        apt.status !== "cancelled"
    );

    if (existingAppointment) {
      return { success: false, error: "Time slot is no longer available" };
    }

    // Get service and therapist details
    const service = therapyServices.find(
      (s) => s.id === appointmentData.serviceId
    );
    const therapist = therapists.find(
      (t) => t.id === appointmentData.therapistId
    );

    // Create new appointment
    const newAppointment = {
      id: `apt${mockAppointments.length + 1}`,
      patientName: appointmentData.patientName || "Patient",
      therapistName: therapist?.name || "Therapist",
      serviceName: service?.name || "Service",
      duration: service?.duration || 60,
      price: service?.price || 100,
      status: "confirmed",
      bookingDate: new Date().toISOString().split("T")[0],
      reminderSent: false,
      paymentStatus: "paid",
      room: `Room ${String.fromCharCode(65 + Math.floor(Math.random() * 3))}`, // Random room A, B, or C
      notes: appointmentData.notes || "",
      ...appointmentData,
    };

    // Add to mock appointments
    mockAppointments.push(newAppointment);

    // Store in localStorage
    const storedAppointments = JSON.parse(
      localStorage.getItem("zen_appointments") || "[]"
    );
    storedAppointments.push(newAppointment);
    localStorage.setItem(
      "zen_appointments",
      JSON.stringify(storedAppointments)
    );

    return { success: true, appointment: newAppointment };
  },

  /**
   * Get appointments for a user
   * @param {string} patientId - Patient ID
   * @returns {array} - User's appointments
   */
  getUserAppointments: (patientId) => {
    // Combine mock data with localStorage data
    const storedAppointments = JSON.parse(
      localStorage.getItem("zen_appointments") || "[]"
    );
    const allAppointments = [...mockAppointments, ...storedAppointments];

    return allAppointments
      .filter((apt) => apt.patientId === patientId)
      .sort(
        (a, b) =>
          new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
      );
  },

  /**
   * Cancel an appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} - Cancellation result
   */
  cancelAppointment: async (appointmentId) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find and update appointment
    const appointmentIndex = mockAppointments.findIndex(
      (apt) => apt.id === appointmentId
    );
    if (appointmentIndex !== -1) {
      mockAppointments[appointmentIndex].status = "cancelled";

      // Update localStorage
      const storedAppointments = JSON.parse(
        localStorage.getItem("zen_appointments") || "[]"
      );
      const storedIndex = storedAppointments.findIndex(
        (apt) => apt.id === appointmentId
      );
      if (storedIndex !== -1) {
        storedAppointments[storedIndex].status = "cancelled";
        localStorage.setItem(
          "zen_appointments",
          JSON.stringify(storedAppointments)
        );
      }

      return { success: true };
    }

    return { success: false, error: "Appointment not found" };
  },

  /**
   * Reschedule an appointment
   * @param {string} appointmentId - Appointment ID
   * @param {string} newDate - New date
   * @param {string} newTime - New time
   * @returns {Promise} - Reschedule result
   */
  rescheduleAppointment: async (appointmentId, newDate, newTime) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const appointmentIndex = mockAppointments.findIndex(
      (apt) => apt.id === appointmentId
    );
    if (appointmentIndex !== -1) {
      // Check if new slot is available
      const existingAppointment = mockAppointments.find(
        (apt) =>
          apt.therapistId === mockAppointments[appointmentIndex].therapistId &&
          apt.date === newDate &&
          apt.time === newTime &&
          apt.status !== "cancelled" &&
          apt.id !== appointmentId
      );

      if (existingAppointment) {
        return { success: false, error: "New time slot is not available" };
      }

      // Update appointment
      mockAppointments[appointmentIndex].date = newDate;
      mockAppointments[appointmentIndex].time = newTime;

      return { success: true, appointment: mockAppointments[appointmentIndex] };
    }

    return { success: false, error: "Appointment not found" };
  },

  /**
   * Get all appointments (for admin view)
   * @returns {array} - All appointments
   */
  getAllAppointments: () => {
    const storedAppointments = JSON.parse(
      localStorage.getItem("zen_appointments") || "[]"
    );
    return [...mockAppointments, ...storedAppointments].sort(
      (a, b) =>
        new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
    );
  },
};

// Mock payment processing
export const paymentService = {
  /**
   * Process payment for appointment
   * @param {object} paymentData - Payment details
   * @returns {Promise} - Payment result
   */
  processPayment: async (paymentData) => {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate payment success (90% success rate)
    const success = Math.random() > 0.1;

    if (success) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}`,
        amount: paymentData.amount,
        currency: "USD",
        status: "completed",
      };
    } else {
      return {
        success: false,
        error: "Payment failed. Please try again.",
      };
    }
  },
};

// Generate mock notifications for appointments
export const generateAppointmentNotifications = () => {
  const notifications = [];
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Find appointments for tomorrow
  const tomorrowAppointments = mockAppointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    return (
      aptDate.toDateString() === tomorrow.toDateString() &&
      apt.status === "confirmed"
    );
  });

  tomorrowAppointments.forEach((apt) => {
    notifications.push({
      id: `notif_${apt.id}`,
      type: "appointment_reminder",
      title: "Appointment Reminder",
      message: `Your ${apt.serviceName} session with ${apt.therapistName} is scheduled for tomorrow at ${apt.time}`,
      timestamp: new Date().toISOString(),
      read: false,
      appointmentId: apt.id,
      priority: "medium",
    });
  });

  return notifications;
};
