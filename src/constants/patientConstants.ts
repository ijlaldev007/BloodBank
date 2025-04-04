export const bloodGroups = ["A", "B", "AB", "O"] as const;
export const rhOptions = ["Positive", "Negative"] as const;
export const pakistaniCities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Hyderabad",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Bahawalpur",
] as const;

export type BloodGroup = typeof bloodGroups[number];
export type RhFactor = typeof rhOptions[number];
export type PakistaniCity = typeof pakistaniCities[number];