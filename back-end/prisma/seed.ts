import faker from "@faker-js/faker";
import { prisma } from "../src/database.js";

async function main() {
  await prisma.recommendation.createMany({
    data: [
      { 
        name: faker.lorem.words(2),
        youtubeLink: "https://www.youtube.com/watch?v=9sTQ0QdkN3Q"
      },
      { 
        name: faker.lorem.words(2),
        youtubeLink: "https://www.youtube.com/watch?v=9sTQ0QdkN3Q"
      },
      { 
        name: faker.lorem.words(2),
        youtubeLink: "https://www.youtube.com/watch?v=9sTQ0QdkN3Q"
      },
      { 
        name: faker.lorem.words(2),
        youtubeLink: "https://www.youtube.com/watch?v=9sTQ0QdkN3Q"
      },
      { 
        name: faker.lorem.words(2),
        youtubeLink: "https://www.youtube.com/watch?v=9sTQ0QdkN3Q"
      },
      { 
        name: faker.lorem.words(2),
        youtubeLink: "https://www.youtube.com/watch?v=9sTQ0QdkN3Q"
      },
      { 
        name: faker.lorem.words(2),
        youtubeLink: "https://www.youtube.com/watch?v=9sTQ0QdkN3Q"
      },
      { 
        name: faker.lorem.words(2),
        youtubeLink: "https://www.youtube.com/watch?v=9sTQ0QdkN3Q"
      },
      { 
        name: faker.lorem.words(2),
        youtubeLink: "https://www.youtube.com/watch?v=9sTQ0QdkN3Q"
      },
      { 
        name: faker.lorem.words(2),
        youtubeLink: "https://www.youtube.com/watch?v=9sTQ0QdkN3Q"
      },
    ],
  });
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});