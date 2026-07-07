export const profile = {
  name: "Ayomide",
  fullName: "Ayomide Olaniyi",
  travelDate: "2026-09-05",
  photos: {
    profile: "/images/after.jpg",
    before: "/images/before.jpg",
    after: "/images/after.jpg",
  },
  stats: [
    { label: "Weight", current: 90, goal: 85, unit: "kg", direction: "down" as const },
    { label: "Waist", current: 42, goal: 39, unit: "in", direction: "down" as const },
    { label: "Glute", current: 44, goal: 45, unit: "in", direction: "up" as const },
  ],
};


export const offerings = {
  options: [
    {
      title: "Healthy Fat Loss Transformation",
      icon: "🔥",
      goal: "Lose weight & excess fat before your trip",
      remark:
        "We're going to focus on helping you drop excess fat in a healthy, sustainable way — without crash diets or pushing your body into exhaustion. The goal is to help you feel lighter, more confident, and closer to the body you want before your journey.",
    },
    {
      title: "Slimmer Waist & Flat Tummy Focus",
      icon: "✨",
      goal: "Reduce belly fat & lose inches around your waist",
      remark:
        "We're going after that tummy area with the right combination of strength training, movement, and nutrition. The goal is to help you tighten your core, reduce inches around your waist, and create that flatter, more confident look you've been wanting.",
    },
    {
      title: "Face Slimming & Body Definition",
      icon: "💎",
      goal: "Reveal a sharper, more defined look",
      remark:
        "As we reduce overall body fat, we'll work toward bringing out a more defined version of you — including helping reduce facial fullness and creating a leaner, more sculpted appearance while keeping you looking healthy and energized.",
    },
    {
      title: "Glute Growth & Curves Sculpting",
      icon: "🍑",
      goal: "Build a rounder, stronger lower body",
      remark:
        "We're going to build and shape your glutes while creating the balance of a slimmer waist and stronger lower body. Through targeted workouts, we'll help your curves become more pronounced, lifted, and defined.",
    },
    {
      title: "Toned Back & Full Body Sculpting",
      icon: "💪",
      goal: "Create a lean, toned physique",
      remark:
        "We'll strengthen and sculpt your back, shoulders, and full body to create that toned look you're aiming for. A stronger back, better posture, and improved muscle definition will help bring out your shape even more.",
    },
    {
      title: "Personal Coaching & Flexible Nutrition",
      icon: "🎯",
      goal: "Transform without giving up the foods you love",
      remark:
        "I'll personally guide you throughout the process — helping you make progress without extreme restrictions. We'll create a plan that fits your lifestyle, lets you still enjoy your favourite foods, and helps you transform in a way you can actually maintain.",
    },
  ],
};


export const phases = [
  {
    numeral: "I",
    code: "PH-01",
    title: "Baseline Assessment",
    summary:
      "Every file starts with a reading. We record where you actually are before we decide where you're going.",
    items: [
      "Activity level",
      "Body composition observations",
      "Movement quality",
      "Mobility screening",
      "Goal setting",
      "Lifestyle review",
    ],
  },
  {
    numeral: "II",
    code: "PH-02",
    title: "Metabolic Activation",
    summary:
      "The engine comes first. Before we build shape, we build the capacity to carry it.",
    items: [
      "Cardiovascular capacity",
      "Energy expenditure",
      "Movement efficiency",
      "Exercise tolerance",
      "Loading readiness",
    ],
  },
  {
    numeral: "III",
    code: "PH-03",
    title: "Structural Development",
    summary:
      "This is where recomposition happens; the core, the glutes, the back, and the patterns that hold them together.",
    items: [
      "Core development",
      "Lower-body strengthening",
      "Glute enhancement",
      "Back definition",
      "Functional movement patterns",
    ],
  },
  {
    numeral: "IV",
    code: "PH-04",
    title: "Performance Optimization",
    summary:
      "Load increases, adjustments get sharper. This phase is where most of the visible change compounds.",
    items: [
      "Higher-intensity conditioning",
      "Endurance ceiling raised",
      "Strength progression",
      "Continuous individual adjustment",
    ],
  },
  {
    numeral: "V",
    code: "PH-05",
    title: "Consolidation",
    summary:
      "The seven weeks end. The habits don't. This phase locks in what carries forward on your own.",
    items: [
      "Progress maintenance",
      "Independent routine building",
      "Long-term strategy handoff",
    ],
  },
];

export const monitoring = [
  "Body measurements",
  "Progress photographs",
  "Performance improvements",
  "Cardiovascular endurance",
  "Strength progression",
  "Participant feedback",
];

export const nutrition = [
  "Balanced meal planning",
  "Protein intake recommendations",
  "Hydration strategies",
  "Portion awareness",
  "Recovery nutrition",
];

export const idealCandidate = [
  "Improve body composition",
  "Develop a stronger core",
  "Build fuller, stronger glutes",
  "Increase endurance",
  "Improve posture",
  "Build sustainable habits",
];

export const reviews = [
  {
    name: "Lester A.",
    tag: "Week 7 · Lagos",
    quote:
      "I didn't think I could stay consistent at first, but the structure made it easy to follow. My energy improved, and I actually look forward to my sessions now.",
  },
  {
    name: "Laurel A.",
    tag: "Week 7 · Abuja",
    quote:
      "This helped me get back into shape without feeling overwhelmed. My body feels tighter, my posture improved, and I finally feel confident again in my clothes.",
  },
  {
    name: "Tayena T.",
    tag: "Week 6 · Lagos",
    quote:
      "What worked for me was how progressive everything was. Each week built on the last, and I could actually feel my body responding instead of guessing.",
  },
  {
    name: "Bolu B.",
    tag: "Week 5 · Lagos",
    quote:
      "I started this as someone inconsistent with workouts, but now movement feels normal. Even walking and light jogging became part of my routine.",
  },
  {
    name: "Eniola B.",
    tag: "Week 7 · Ibadan",
    quote:
      "My glutes, core, and stamina all improved gradually. Nothing felt rushed, and that made it easier to stay committed till the end.",
  },
  {
    name: "Nancy I.",
    tag: "Week 7 · Port Harcourt",
    quote:
      "Even on low-energy days, I never fell off completely. That balance between structure and flexibility is what kept me going.",
  },
  {
    name: "Goody T.",
    tag: "Week 7 · Lagos",
    quote:
      "This wasn't just workouts - it felt like a system. My lifestyle changed naturally without forcing extreme routines.",
  },
];

export const investment = {
  low: 120000,
  high: 150000,
  note: "Because she deserves the real thing, not a generic plan off the internet - in-person sessions, adjusted week to week, right up to the day she boards that flight.",
  includes: [
    "In-person training sessions",
    "Individualized progression plan",
    "Hands-on form correction",
    "Nutritional guidance",
    "Weekly measurement check-ins",
    "Accountability & ongoing support",
    "Performance-based adjustments",
  ],
};

export const goalOptions = [
  "Body recomposition",
  "Core & posture",
  "Glute development",
  "Endurance & stamina",
  "General fitness",
];

export const contact = {
  coachName: "Olaniyi",
  whatsapp: "https://wa.me/2349037018310", // replace with real number
  phone: "+234 903 701 8310", // replace with real number
  email: "olaniyigeorge77@gmail.com", // replace with real email
  instagram: "https://instagram.com/olaniyi_george", // replace with real handle
};

export const disclaimer =
  "The Sculpt Protocol is a fitness coaching and lifestyle program. It is not a medical treatment and is not intended to diagnose, treat, cure, or prevent any disease. Participants with underlying medical conditions should consult a qualified healthcare professional before beginning the program.";