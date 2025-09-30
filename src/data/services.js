// Mock data for Ayurveda therapy services
// This data simulates a real service catalog that would typically come from a database

export const therapyServices = [
  {
    id: "s1",
    name: "Abhyanga - Full Body Oil Massage",
    category: "Massage",
    price: 120,
    duration: 60,
    image: "/placeholder.svg",
    shortDescription: "Therapeutic full-body massage with warm herbal oils",
    description:
      "Abhyanga is a traditional Ayurvedic full-body massage using warm herbal oils specifically chosen for your body type (dosha). This deeply relaxing treatment improves circulation, nourishes the skin, and helps eliminate toxins from the body. The rhythmic massage strokes calm the nervous system and promote overall well-being.",
    benefits: [
      "Improves blood circulation",
      "Nourishes and moisturizes skin",
      "Reduces stress and anxiety",
      "Promotes better sleep",
      "Enhances flexibility",
      "Boosts immune system",
    ],
    category: "Rejuvenation",
    tags: ["massage", "relaxation", "detox", "stress-relief"],
  },
  {
    id: "s2",
    name: "Shirodhara - Head Oil Therapy",
    category: "Specialized",
    price: 150,
    duration: 45,
    image: "/placeholder.svg",
    shortDescription: "Continuous stream of warm oil poured over the forehead",
    description:
      "Shirodhara is one of the most divine and relaxing therapies in Ayurveda. A continuous stream of warm, medicated oil is gently poured over the forehead (third eye chakra) for 30-45 minutes. This treatment is particularly effective for stress, anxiety, insomnia, and mental fatigue.",
    benefits: [
      "Calms the nervous system",
      "Improves mental clarity",
      "Reduces anxiety and stress",
      "Promotes deep sleep",
      "Balances emotions",
      "Enhances concentration",
    ],
    category: "Mental Wellness",
    tags: ["mental-health", "stress-relief", "meditation", "relaxation"],
  },
  {
    id: "s3",
    name: "Panchakarma Detox Program",
    category: "Detox",
    price: 800,
    duration: 420, // 7 hours over multiple sessions
    image: "/placeholder.svg",
    shortDescription:
      "Comprehensive 7-day detoxification and rejuvenation program",
    description:
      "Panchakarma is the ultimate Ayurvedic detoxification and rejuvenation program. This 7-day intensive treatment includes a series of therapies designed to eliminate toxins, restore balance, and rejuvenate the body and mind. Includes consultation, customized diet plan, and follow-up care.",
    benefits: [
      "Complete body detoxification",
      "Improved digestive health",
      "Enhanced energy levels",
      "Better mental clarity",
      "Strengthened immune system",
      "Hormonal balance",
    ],
    category: "Purification",
    tags: ["detox", "cleanse", "rejuvenation", "intensive"],
  },
  {
    id: "s4",
    name: "Nasya - Nasal Therapy",
    category: "Specialized",
    price: 80,
    duration: 30,
    image: "/placeholder.svg",
    shortDescription: "Therapeutic nasal administration of medicated oils",
    description:
      "Nasya is a specialized Ayurvedic therapy involving the administration of medicated oils, ghee, or herbal preparations through the nasal passages. This treatment is particularly effective for respiratory issues, sinus problems, and mental clarity.",
    benefits: [
      "Clears respiratory passages",
      "Improves breathing",
      "Reduces sinus congestion",
      "Enhances mental clarity",
      "Balances hormones",
      "Strengthens sensory organs",
    ],
    category: "Respiratory",
    tags: ["respiratory", "sinus", "mental-clarity", "hormonal"],
  },
  {
    id: "s5",
    name: "Swedana - Herbal Steam Therapy",
    category: "Detox",
    price: 90,
    duration: 30,
    image: "/placeholder.svg",
    shortDescription: "Therapeutic steam bath with medicinal herbs",
    description:
      "Swedana is a specialized steam therapy using medicinal herbs and essential oils. The therapeutic steam opens pores, promotes sweating, and helps eliminate toxins from the body. Often used as a preparatory treatment for other therapies.",
    benefits: [
      "Opens skin pores",
      "Eliminates toxins through sweat",
      "Improves circulation",
      "Reduces muscle stiffness",
      "Enhances flexibility",
      "Prepares body for other treatments",
    ],
    category: "Preparation",
    tags: ["steam", "detox", "circulation", "flexibility"],
  },
  {
    id: "s6",
    name: "Udvartana - Herbal Powder Massage",
    category: "Massage",
    price: 110,
    duration: 45,
    image: "/placeholder.svg",
    shortDescription: "Dry herbal powder massage for weight management",
    description:
      "Udvartana is a unique Ayurvedic massage using herbal powders instead of oils. This dry massage technique is particularly effective for weight management, cellulite reduction, and improving skin texture. The upward strokes stimulate lymphatic drainage.",
    benefits: [
      "Supports weight management",
      "Reduces cellulite",
      "Improves skin texture",
      "Enhances lymphatic drainage",
      "Increases metabolism",
      "Tones muscle tissue",
    ],
    category: "Wellness",
    tags: ["weight-management", "skin-care", "lymphatic", "toning"],
  },
  {
    id: "s7",
    name: "Karna Purana - Ear Therapy",
    category: "Specialized",
    price: 70,
    duration: 25,
    image: "/placeholder.svg",
    shortDescription: "Therapeutic ear treatment with warm medicated oils",
    description:
      "Karna Purana involves filling the ears with warm, medicated oils for therapeutic purposes. This treatment is excellent for ear-related issues, hearing problems, and can also help with jaw tension and headaches.",
    benefits: [
      "Improves hearing",
      "Reduces ear infections",
      "Relieves jaw tension",
      "Helps with tinnitus",
      "Reduces headaches",
      "Calms the nervous system",
    ],
    category: "Sensory",
    tags: ["hearing", "jaw-relief", "headache", "nervous-system"],
  },
  {
    id: "s8",
    name: "Akshi Tarpana - Eye Rejuvenation",
    category: "Specialized",
    price: 130,
    duration: 40,
    image: "/placeholder.svg",
    shortDescription: "Specialized eye treatment with medicated ghee",
    description:
      "Akshi Tarpana is a specialized Ayurvedic treatment for the eyes involving bathing the eyes in warm, medicated ghee. This therapy is excellent for eye strain, dry eyes, and maintaining healthy vision, especially beneficial for those who spend long hours at computers.",
    benefits: [
      "Relieves eye strain",
      "Improves vision clarity",
      "Reduces dry eyes",
      "Prevents eye diseases",
      "Relaxes eye muscles",
      "Enhances overall eye health",
    ],
    category: "Sensory",
    tags: ["eye-care", "vision", "computer-strain", "dry-eyes"],
  },
];

// Service categories for filtering
export const serviceCategories = [
  { id: "all", name: "All Services", count: therapyServices.length },
  {
    id: "massage",
    name: "Massage Therapy",
    count: therapyServices.filter((s) => s.category === "Massage").length,
  },
  {
    id: "detox",
    name: "Detoxification",
    count: therapyServices.filter((s) => s.category === "Detox").length,
  },
  {
    id: "specialized",
    name: "Specialized Therapy",
    count: therapyServices.filter((s) => s.category === "Specialized").length,
  },
  {
    id: "rejuvenation",
    name: "Rejuvenation",
    count: therapyServices.filter((s) => s.tags?.includes("rejuvenation"))
      .length,
  },
  {
    id: "herbal",
    name: "Herbal Treatment",
    count: therapyServices.filter(
      (s) => s.tags?.includes("herbal") || s.description.includes("herbal")
    ).length,
  },
];

// Popular service packages
export const servicePackages = [
  {
    id: "pkg1",
    name: "Stress Relief Package",
    description:
      "Perfect for modern professionals dealing with stress and anxiety",
    services: ["s1", "s2"], // Abhyanga + Shirodhara
    originalPrice: 270,
    packagePrice: 230,
    savings: 40,
    duration: 105,
    sessions: 2,
    image: "/placeholder.svg",
  },
  {
    id: "pkg2",
    name: "Complete Wellness Package",
    description: "Comprehensive treatment for overall health and rejuvenation",
    services: ["s1", "s2", "s5"], // Abhyanga + Shirodhara + Swedana
    originalPrice: 360,
    packagePrice: 300,
    savings: 60,
    duration: 135,
    sessions: 3,
    image: "/placeholder.svg",
  },
  {
    id: "pkg3",
    name: "Detox & Rejuvenation",
    description: "Deep cleansing and rejuvenation for body and mind",
    services: ["s3", "s1", "s6"], // Panchakarma + Abhyanga + Udvartana
    originalPrice: 1030,
    packagePrice: 850,
    savings: 180,
    duration: 505,
    sessions: 3,
    image: "/placeholder.svg",
  },
];

/**
 * Helper function to get service by ID
 * @param {string} serviceId - The ID of the service
 * @returns {object|null} - The service object or null if not found
 */
export const getServiceById = (serviceId) => {
  return therapyServices.find((service) => service.id === serviceId) || null;
};

/**
 * Helper function to filter services by category
 * @param {string} category - The category to filter by
 * @returns {array} - Array of filtered services
 */
export const getServicesByCategory = (category) => {
  if (category === "all") return therapyServices;
  return therapyServices.filter(
    (service) =>
      service.category.toLowerCase() === category.toLowerCase() ||
      service.tags?.includes(category.toLowerCase())
  );
};

/**
 * Helper function to search services
 * @param {string} searchTerm - The search term
 * @returns {array} - Array of matching services
 */
export const searchServices = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return therapyServices.filter(
    (service) =>
      service.name.toLowerCase().includes(term) ||
      service.description.toLowerCase().includes(term) ||
      service.benefits.some((benefit) =>
        benefit.toLowerCase().includes(term)
      ) ||
      service.tags?.some((tag) => tag.toLowerCase().includes(term))
  );
};
