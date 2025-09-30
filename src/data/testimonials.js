// Mock data for patient testimonials and reviews
// This data simulates real patient feedback that would typically come from a database

export const testimonials = [
  {
    id: "test1",
    patientName: "Sarah Johnson",
    patientInitials: "SJ",
    age: 35,
    location: "San Francisco, CA",
    rating: 5,
    date: "2024-09-15",
    therapistId: "t1",
    therapistName: "Dr. Meera Sharma",
    serviceId: "s2",
    serviceName: "Shirodhara",
    title: "Life-changing experience with Shirodhara",
    review:
      "After struggling with anxiety and insomnia for years, Dr. Meera's Shirodhara sessions have been absolutely transformative. The warm oil therapy not only helped me relax deeply but also improved my sleep quality dramatically. I feel more centered and peaceful than I have in years. Highly recommend!",
    tags: ["anxiety", "insomnia", "stress-relief", "mental-health"],
    helpful: 23,
    verified: true,
    beforeSymptoms: [
      "Severe anxiety",
      "Insomnia",
      "Racing thoughts",
      "Tension headaches",
    ],
    afterResults: [
      "Calm mind",
      "Better sleep",
      "Reduced stress",
      "Mental clarity",
    ],
  },
  {
    id: "test2",
    patientName: "Michael Chen",
    patientInitials: "MC",
    age: 42,
    location: "Seattle, WA",
    rating: 5,
    date: "2024-09-10",
    therapistId: "t2",
    therapistName: "Dr. Rajesh Kumar",
    serviceId: "s3",
    serviceName: "Panchakarma Detox",
    title: "Complete transformation through Panchakarma",
    review:
      "The 7-day Panchakarma program with Dr. Rajesh was the best decision I made for my health. I came in feeling sluggish and dealing with digestive issues. The comprehensive detox not only cleansed my body but also rejuvenated my mind. I have more energy now than I had 10 years ago!",
    tags: ["detox", "energy", "digestive-health", "rejuvenation"],
    helpful: 31,
    verified: true,
    beforeSymptoms: [
      "Low energy",
      "Digestive problems",
      "Mental fog",
      "Joint stiffness",
    ],
    afterResults: [
      "High energy",
      "Perfect digestion",
      "Mental clarity",
      "Flexible joints",
    ],
  },
  {
    id: "test3",
    patientName: "Dr. Priya Patel",
    patientInitials: "PP",
    age: 38,
    location: "Austin, TX",
    rating: 5,
    date: "2024-09-05",
    therapistId: "t3",
    therapistName: "Dr. Anita Reddy",
    serviceId: "s1",
    serviceName: "Abhyanga",
    title: "Perfect stress relief for busy professionals",
    review:
      "As a physician myself, I was skeptical about Ayurvedic treatments. However, Dr. Anita's Abhyanga sessions have become my weekly ritual for stress management. The full-body oil massage is incredibly therapeutic and has helped me manage the physical and mental demands of my profession much better.",
    tags: ["stress-relief", "professional", "massage", "weekly-ritual"],
    helpful: 18,
    verified: true,
    beforeSymptoms: [
      "Work stress",
      "Muscle tension",
      "Burnout",
      "Poor work-life balance",
    ],
    afterResults: [
      "Stress management",
      "Relaxed muscles",
      "Better focus",
      "Improved balance",
    ],
  },
  {
    id: "test4",
    patientName: "Jennifer Martinez",
    patientInitials: "JM",
    age: 29,
    location: "Denver, CO",
    rating: 4,
    date: "2024-08-28",
    therapistId: "t4",
    therapistName: "Dr. Priya Nair",
    serviceId: "s6",
    serviceName: "Udvartana",
    title: "Great results for weight management",
    review:
      "Dr. Priya's Udvartana treatment combined with her nutritional guidance has helped me lose 15 pounds in 3 months naturally. The herbal powder massage improves circulation and the personalized diet plan based on my constitution has been easy to follow. Very satisfied with the holistic approach!",
    tags: ["weight-loss", "nutrition", "natural", "holistic"],
    helpful: 26,
    verified: true,
    beforeSymptoms: [
      "Excess weight",
      "Slow metabolism",
      "Low energy",
      "Poor circulation",
    ],
    afterResults: [
      "Weight loss",
      "Better metabolism",
      "Increased energy",
      "Improved circulation",
    ],
  },
  {
    id: "test5",
    patientName: "Robert Thompson",
    patientInitials: "RT",
    age: 55,
    location: "Phoenix, AZ",
    rating: 5,
    date: "2024-08-20",
    therapistId: "t5",
    therapistName: "Dr. Arjun Mehta",
    serviceId: "s4",
    serviceName: "Nasya",
    title: "Incredible relief from chronic sinusitis",
    review:
      "After suffering from chronic sinusitis for over 10 years and trying countless medications, Dr. Arjun's Nasya therapy has finally given me the relief I was looking for. His traditional approach and deep knowledge of Ayurveda is remarkable. I can breathe freely again!",
    tags: ["sinusitis", "respiratory", "chronic-condition", "traditional"],
    helpful: 29,
    verified: true,
    beforeSymptoms: [
      "Chronic sinusitis",
      "Breathing difficulties",
      "Frequent infections",
      "Fatigue",
    ],
    afterResults: [
      "Clear sinuses",
      "Easy breathing",
      "No infections",
      "More energy",
    ],
  },
  {
    id: "test6",
    patientName: "Lisa Wang",
    patientInitials: "LW",
    age: 33,
    location: "New York, NY",
    rating: 5,
    date: "2024-08-15",
    therapistId: "t1",
    therapistName: "Dr. Meera Sharma",
    serviceId: "s1",
    serviceName: "Abhyanga",
    title: "Amazing experience for new mothers",
    review:
      "Post-pregnancy, I was dealing with fatigue and body aches. Dr. Meera's Abhyanga treatments have been a blessing. The warm oil massage helped restore my energy levels and the nurturing environment made me feel completely cared for. Perfect for new mothers needing self-care!",
    tags: ["post-pregnancy", "new-mother", "fatigue", "self-care"],
    helpful: 21,
    verified: true,
    beforeSymptoms: [
      "Post-pregnancy fatigue",
      "Body aches",
      "Stress",
      "Low energy",
    ],
    afterResults: [
      "Restored energy",
      "Pain relief",
      "Reduced stress",
      "Better mood",
    ],
  },
  {
    id: "test7",
    patientName: "David Kumar",
    patientInitials: "DK",
    age: 48,
    location: "Chicago, IL",
    rating: 4,
    date: "2024-08-10",
    therapistId: "t2",
    therapistName: "Dr. Rajesh Kumar",
    serviceId: "s5",
    serviceName: "Swedana",
    title: "Excellent preparation for other treatments",
    review:
      "The Swedana steam therapy was the perfect preparation for my Panchakarma program. Dr. Rajesh explained how the herbal steam opens up the channels for better detoxification. I could feel the toxins leaving my body through sweating. Great as a standalone treatment too!",
    tags: ["steam-therapy", "detox", "preparation", "toxins"],
    helpful: 15,
    verified: true,
    beforeSymptoms: [
      "Toxin buildup",
      "Stiff muscles",
      "Poor circulation",
      "Stress",
    ],
    afterResults: [
      "Clean feeling",
      "Flexible muscles",
      "Better circulation",
      "Relaxation",
    ],
  },
  {
    id: "test8",
    patientName: "Emma Rodriguez",
    patientInitials: "ER",
    age: 26,
    location: "Miami, FL",
    rating: 5,
    date: "2024-08-05",
    therapistId: "t3",
    therapistName: "Dr. Anita Reddy",
    serviceId: "s8",
    serviceName: "Akshi Tarpana",
    title: "Perfect solution for digital eye strain",
    review:
      "As a software developer spending 10+ hours daily on screens, my eyes were constantly strained and dry. Dr. Anita's Akshi Tarpana treatment has been incredible. The warm ghee therapy is so soothing and has significantly improved my eye comfort. A must-try for anyone with computer-related eye issues!",
    tags: ["eye-strain", "computer-work", "dry-eyes", "software-developer"],
    helpful: 33,
    verified: true,
    beforeSymptoms: ["Eye strain", "Dry eyes", "Headaches", "Blurred vision"],
    afterResults: [
      "Comfortable eyes",
      "Moist eyes",
      "No headaches",
      "Clear vision",
    ],
  },
];

// Review statistics
export const reviewStats = {
  totalReviews: testimonials.length,
  averageRating: (
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
  ).toFixed(1),
  ratingDistribution: {
    5: testimonials.filter((t) => t.rating === 5).length,
    4: testimonials.filter((t) => t.rating === 4).length,
    3: testimonials.filter((t) => t.rating === 3).length,
    2: testimonials.filter((t) => t.rating === 2).length,
    1: testimonials.filter((t) => t.rating === 1).length,
  },
  verifiedReviews: testimonials.filter((t) => t.verified).length,
  recentReviews: testimonials.filter((t) => {
    const reviewDate = new Date(t.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return reviewDate >= thirtyDaysAgo;
  }).length,
};

// Common symptoms and results for reference
export const commonSymptoms = [
  "Stress",
  "Anxiety",
  "Insomnia",
  "Fatigue",
  "Digestive issues",
  "Joint pain",
  "Headaches",
  "Muscle tension",
  "Poor circulation",
  "Skin problems",
  "Weight issues",
  "Mental fog",
  "Low energy",
];

export const commonResults = [
  "Stress relief",
  "Better sleep",
  "Increased energy",
  "Improved digestion",
  "Pain relief",
  "Mental clarity",
  "Relaxation",
  "Better circulation",
  "Healthy skin",
  "Weight management",
  "Emotional balance",
  "Overall wellness",
];

/**
 * Helper function to get testimonials by therapist
 * @param {string} therapistId - The ID of the therapist
 * @returns {array} - Array of testimonials for the therapist
 */
export const getTestimonialsByTherapist = (therapistId) => {
  return testimonials.filter(
    (testimonial) => testimonial.therapistId === therapistId
  );
};

/**
 * Helper function to get testimonials by service
 * @param {string} serviceId - The ID of the service
 * @returns {array} - Array of testimonials for the service
 */
export const getTestimonialsByService = (serviceId) => {
  return testimonials.filter(
    (testimonial) => testimonial.serviceId === serviceId
  );
};

/**
 * Helper function to get recent testimonials
 * @param {number} limit - Maximum number of testimonials to return
 * @returns {array} - Array of recent testimonials
 */
export const getRecentTestimonials = (limit = 5) => {
  return testimonials
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

/**
 * Helper function to get high-rated testimonials
 * @param {number} minRating - Minimum rating filter
 * @param {number} limit - Maximum number of testimonials to return
 * @returns {array} - Array of high-rated testimonials
 */
export const getHighRatedTestimonials = (minRating = 4, limit = 10) => {
  return testimonials
    .filter((testimonial) => testimonial.rating >= minRating)
    .sort((a, b) => b.rating - a.rating || b.helpful - a.helpful)
    .slice(0, limit);
};
