export const City = {
  Paris: {
    name: 'Paris',
    location: { latitude: 48.85661, longitude: 2.351499 },
  },
  Cologne: {
    name: 'Cologne',
    location: { latitude: 50.938361, longitude: 6.959974 },
  },
  Brussels: {
    name: 'Brussels',
    location: { latitude: 50.846557, longitude: 4.351697 },
  },
  Amsterdam: {
    name: 'Amsterdam',
    location: { latitude: 52.370216, longitude: 4.895168 },
  },
  Hamburg: {
    name: 'Hamburg',
    location: { latitude: 53.550341, longitude: 10.000654 },
  },
  Dusseldorf: {
    name: 'Dusseldorf',
    location: { latitude: 51.225402, longitude: 6.776314 },
  },
} as const;

export type CityData = (typeof City)[keyof typeof City];

export type CityKey = keyof typeof City;
