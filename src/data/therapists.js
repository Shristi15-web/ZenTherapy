// Mock data for Ayurveda therapists and practitioners
// This data simulates therapist profiles that would typically come from a database

export const therapists = [
  {
    id: "t1",
    name: "Dr. Meera Sharma",
    title: "Senior Ayurveda Practitioner",
    specializations: [
      "Panchakarma",
      "Women's Health",
      "Stress Management",
      "Digestive Disorders",
    ],
    experience: 15,
    qualifications: [
      "BAMS (Bachelor of Ayurvedic Medicine & Surgery)",
      "MD in Ayurveda (Panchakarma)",
      "Certified Yoga Therapist",
      "Panchakarma Specialist Certification",
    ],
    languages: ["English", "Hindi", "Sanskrit"],
    image: "/placeholder.svg",
    bio: "Dr. Meera Sharma is a renowned Ayurveda practitioner with over 15 years of experience in traditional healing. She specializes in Panchakarma therapies and has helped thousands of patients achieve optimal health through personalized Ayurvedic treatments. Her compassionate approach and deep knowledge of ancient healing practices make her one of the most sought-after practitioners in the field.",
    education: [
      {
        degree: "MD in Ayurveda (Panchakarma)",
        institution: "Gujarat Ayurved University",
        year: "2012",
      },
      {
        degree: "BAMS",
        institution: "Rajiv Gandhi University of Health Sciences",
        year: "2008",
      },
    ],
    achievements: [
      "Best Ayurveda Practitioner Award 2023",
      "Published 12 research papers on Panchakarma",
      "Speaker at International Ayurveda Conference",
      "Certified in Advanced Pulse Diagnosis",
    ],
    workingHours: {
      monday: { start: "09:00", end: "17:00", available: true },
      tuesday: { start: "09:00", end: "17:00", available: true },
      wednesday: { start: "09:00", end: "17:00", available: true },
      thursday: { start: "09:00", end: "17:00", available: true },
      friday: { start: "09:00", end: "17:00", available: true },
      saturday: { start: "10:00", end: "14:00", available: true },
      sunday: { start: "", end: "", available: false },
    },
    rating: 4.9,
    reviewCount: 247,
    consultationFee: 100,
    services: ["s1", "s2", "s3", "s4"], // Service IDs from services.js
    availability: "high", // high, medium, low
  },
  {
    id: "t2",
    name: "Dr. Rajesh Kumar",
    title: "Ayurveda Physician & Detox Specialist",
    specializations: [
      "Detoxification",
      "Joint Care",
      "Respiratory Health",
      "Pain Management",
    ],
    experience: 12,
    qualifications: [
      "BAMS",
      "Panchakarma Diploma",
      "Yoga Therapy Certification",
      "Ayurvedic Nutrition Specialist",
    ],
    languages: ["English", "Hindi", "Telugu"],
    image: "/placeholder.svg",
    bio: "Dr. Rajesh Kumar brings 12 years of dedicated experience in Ayurvedic medicine with a special focus on detoxification and pain management. His holistic approach combines traditional Ayurvedic principles with modern lifestyle modifications to provide comprehensive healing solutions.",
    education: [
      {
        degree: "BAMS",
        institution: "Andhra University",
        year: "2011",
      },
      {
        degree: "Panchakarma Diploma",
        institution: "Ayurveda Mahavidyalaya",
        year: "2013",
      },
    ],
    achievements: [
      "Excellence in Panchakarma Award 2022",
      "Specialist in Chronic Pain Management",
      "Published articles on Ayurvedic Detox",
      "Workshop conductor for Joint Care",
    ],
    workingHours: {
      monday: { start: "10:00", end: "18:00", available: true },
      tuesday: { start: "10:00", end: "18:00", available: true },
      wednesday: { start: "", end: "", available: false },
      thursday: { start: "10:00", end: "18:00", available: true },
      friday: { start: "10:00", end: "18:00", available: true },
      saturday: { start: "10:00", end: "16:00", available: true },
      sunday: { start: "", end: "", available: false },
    },
    rating: 4.7,
    reviewCount: 189,
    consultationFee: 90,
    services: ["s3", "s5", "s6", "s4"],
    availability: "medium",
  },
  {
    id: "t3",
    name: "Dr. Anita Reddy",
    title: "Mental Wellness & Meditation Specialist",
    specializations: [
      "Mental Wellness",
      "Shirodhara",
      "Meditation Therapy",
      "Anxiety Treatment",
    ],
    experience: 8,
    qualifications: [
      "BAMS",
      "Psychology Diploma",
      "Mindfulness Certification",
      "Shirodhara Specialist",
    ],
    languages: ["English", "Hindi", "Tamil"],
    image: "/placeholder.svg",
    bio: "Dr. Anita Reddy is a compassionate healer specializing in mental wellness and stress-related disorders. With her unique combination of Ayurvedic medicine and modern psychology, she provides holistic solutions for anxiety, depression, and stress management.",
    education: [
      {
        degree: "BAMS",
        institution: "Tamil Nadu Dr. M.G.R. Medical University",
        year: "2015",
      },
      {
        degree: "Diploma in Psychology",
        institution: "Madras University",
        year: "2017",
      },
    ],
    achievements: [
      "Mental Health Advocate Award 2023",
      "Certified Mindfulness Instructor",
      "Research on Ayurveda & Mental Health",
      "TEDx Speaker on Holistic Wellness",
    ],
    workingHours: {
      monday: { start: "", end: "", available: false },
      tuesday: { start: "11:00", end: "19:00", available: true },
      wednesday: { start: "11:00", end: "19:00", available: true },
      thursday: { start: "11:00", end: "19:00", available: true },
      friday: { start: "11:00", end: "19:00", available: true },
      saturday: { start: "11:00", end: "17:00", available: true },
      sunday: { start: "12:00", end: "16:00", available: true },
    },
    rating: 4.8,
    reviewCount: 156,
    consultationFee: 95,
    services: ["s2", "s8", "s1"],
    availability: "high",
  },
  {
    id: "t4",
    name: "Dr. Priya Nair",
    title: "Ayurveda Consultant & Nutrition Expert",
    specializations: [
      "Ayurvedic Nutrition",
      "Weight Management",
      "Skin Care",
      "Digestive Health",
    ],
    experience: 10,
    qualifications: [
      "BAMS",
      "MSc in Ayurvedic Nutrition",
      "Certified Ayurvedic Lifestyle Counselor",
      "Pulse Diagnosis Expert",
    ],
    languages: ["English", "Hindi", "Malayalam"],
    image: "/placeholder.svg",
    bio: "Dr. Priya Nair combines traditional Ayurvedic wisdom with modern nutritional science to create personalized wellness plans. Her expertise in constitutional analysis and dietary planning has helped numerous clients achieve their health goals naturally.",
    education: [
      {
        degree: "MSc in Ayurvedic Nutrition",
        institution: "Kerala University of Health Sciences",
        year: "2016",
      },
      {
        degree: "BAMS",
        institution: "Kerala University of Health Sciences",
        year: "2013",
      },
    ],
    achievements: [
      "Ayurvedic Nutrition Pioneer Award 2022",
      "Author of 'Eating by Your Constitution'",
      "Featured in Health & Wellness Magazine",
      "Consultant for Celebrity Wellness Programs",
    ],
    workingHours: {
      monday: { start: "09:30", end: "17:30", available: true },
      tuesday: { start: "09:30", end: "17:30", available: true },
      wednesday: { start: "09:30", end: "17:30", available: true },
      thursday: { start: "09:30", end: "17:30", available: true },
      friday: { start: "09:30", end: "17:30", available: true },
      saturday: { start: "", end: "", available: false },
      sunday: { start: "", end: "", available: false },
    },
    rating: 4.9,
    reviewCount: 203,
    consultationFee: 85,
    services: ["s6", "s1", "s5"],
    availability: "medium",
  },
  {
    id: "t5",
    name: "Dr. Arjun Mehta",
    title: "Traditional Ayurveda Practitioner",
    specializations: [
      "Traditional Therapies",
      "Marma Point Therapy",
      "Herbal Medicine",
      "Constitutional Analysis",
    ],
    experience: 20,
    qualifications: [
      "BAMS",
      "MD in Ayurveda (Samhita & Siddhanta)",
      "Marma Therapy Certification",
      "Traditional Pulse Diagnosis Master",
    ],
    languages: ["English", "Hindi", "Sanskrit", "Gujarati"],
    image: "/placeholder.svg",
    bio: "Dr. Arjun Mehta is a master practitioner with 20 years of experience in traditional Ayurvedic healing. His deep understanding of classical texts and ancient techniques makes him a respected authority in authentic Ayurvedic practice.",
    education: [
      {
        degree: "MD in Ayurveda (Samhita & Siddhanta)",
        institution: "Gujarat Ayurved University",
        year: "2008",
      },
      {
        degree: "BAMS",
        institution: "Gujarat Ayurved University",
        year: "2003",
      },
    ],
    achievements: [
      "Lifetime Achievement Award in Ayurveda 2023",
      "Author of 3 books on Classical Ayurveda",
      "International Ayurveda Conference Keynote Speaker",
      "Traditional Medicine Preservation Society President",
    ],
    workingHours: {
      monday: { start: "08:00", end: "16:00", available: true },
      tuesday: { start: "08:00", end: "16:00", available: true },
      wednesday: { start: "08:00", end: "16:00", available: true },
      thursday: { start: "08:00", end: "16:00", available: true },
      friday: { start: "08:00", end: "16:00", available: true },
      saturday: { start: "08:00", end: "12:00", available: true },
      sunday: { start: "", end: "", available: false },
    },
    rating: 5.0,
    reviewCount: 324,
    consultationFee: 120,
    services: ["s1", "s2", "s3", "s4", "s7"],
    availability: "low", // Very busy due to high demand
  },
];

// Generate available time slots for each therapist
export const generateTimeSlots = (therapistId, date) => {
  const therapist = therapists.find((t) => t.id === therapistId);
  if (!therapist) return [];

  const dayName = new Date(date).toLocaleLowerCase().split(" ")[0];
  const daySchedule = therapist.workingHours[dayName];

  if (!daySchedule || !daySchedule.available) return [];

  const slots = [];
  const startTime = daySchedule.start;
  const endTime = daySchedule.end;

  // Generate 30-minute slots
  let currentTime = startTime;
  while (currentTime < endTime) {
    const [hours, minutes] = currentTime.split(":").map(Number);
    const nextSlot = new Date();
    nextSlot.setHours(hours, minutes + 60, 0, 0); // 1-hour slots

    if (
      nextSlot.getHours() < parseInt(endTime.split(":")[0]) ||
      (nextSlot.getHours() === parseInt(endTime.split(":")[0]) &&
        nextSlot.getMinutes() <= parseInt(endTime.split(":")[1]))
    ) {
      const isBooked = Math.random() < 0.3; // 30% chance slot is already booked

      slots.push({
        time: currentTime,
        available: !isBooked,
        price: therapist.consultationFee,
      });

      currentTime = `${String(nextSlot.getHours()).padStart(2, "0")}:${String(
        nextSlot.getMinutes()
      ).padStart(2, "0")}`;
    } else {
      break;
    }
  }

  return slots;
};

/**
 * Helper function to get therapist by ID
 * @param {string} therapistId - The ID of the therapist
 * @returns {object|null} - The therapist object or null if not found
 */
export const getTherapistById = (therapistId) => {
  return therapists.find((therapist) => therapist.id === therapistId) || null;
};

/**
 * Helper function to filter therapists by specialization
 * @param {string} specialization - The specialization to filter by
 * @returns {array} - Array of filtered therapists
 */
export const getTherapistsBySpecialization = (specialization) => {
  return therapists.filter((therapist) =>
    therapist.specializations.some((spec) =>
      spec.toLowerCase().includes(specialization.toLowerCase())
    )
  );
};

/**
 * Helper function to get available therapists for a service
 * @param {string} serviceId - The service ID
 * @returns {array} - Array of therapists who provide this service
 */
export const getTherapistsForService = (serviceId) => {
  return therapists.filter((therapist) =>
    therapist.services.includes(serviceId)
  );
};
