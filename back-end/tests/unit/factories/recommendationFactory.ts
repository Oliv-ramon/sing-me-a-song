import faker from "@faker-js/faker";

export default function recommendationFactory() {
  return {
    id: Number(faker.random.numeric),
    name: faker.lorem.words(2),
    youtubeLink: "https://www.youtube.com/watch?v=wEWF2xh5E8s",
    score: 0
  };
}