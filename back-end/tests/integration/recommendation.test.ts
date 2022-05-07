import supertest from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/database.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService";
import recommendationFactory from "../factories/recommendationFactory.js";

describe("POST /recommendations", () => {
  afterAll(async () => await truncateRecommendations());
  beforeEach(async () => await disconnect());

  it("should return 201 and persist the recommendation given a valid recommendation", async () => {
    const recommendation = recommendationFactory();

    const { status } = await supertest(app).post("/recommendations").send(recommendation);

    const recommendationCreated = await prisma.recommendation.findUnique({
      where: {
        name: recommendation.name
      }
    });

    expect(status).toEqual(201);
    expect(recommendationCreated).not.toEqual(null);
  });

  it("should return 422 given a invalid recommendation", async () => {

    const { status } = await supertest(app).post("/recommendations").send({});
    
    expect(status).toEqual(422);
  });
});

describe("POST /recommendations/:id/upvote", () => {
  afterAll(async () => await truncateRecommendations());
  beforeEach(async () => await disconnect());

  it("should return 200 and incremment recommendation score by one given a valid recommendation id", async () => {
    const recommendation = recommendationFactory();

    const { id, score } = await prisma.recommendation.create({
      data: recommendation
    });

    const { status } = await supertest(app).post(`/recommendations/${id}/upvote`).send(recommendation);

    const { score: updatedScore } = await prisma.recommendation.findUnique({
      where: {
        id
      }
    });

    expect(status).toEqual(200);
    expect(updatedScore).toEqual(score + 1);
  });
});



async function truncateRecommendations() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}

async function disconnect(){
  await prisma.$disconnect();
}

