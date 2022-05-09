import supertest from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/database.js";
import createManyRecommendationsFactory from "./factories/createManyRecommendationsFactory.js";
import createRecommendationFactory from "./factories/createRecommendationFactory.js";
import recommendationFactory from "./factories/recommendationFactory.js";

describe("Recommendations Integration Tests", () => {
  afterAll(async () => await truncateRecommendations());
  beforeEach(async () => await disconnect());

  describe("POST /recommendations", () => {  
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
    it("should return 200 and incremment recommendation score by one given a valid recommendation id", async () => {
      const recommendation = recommendationFactory();
      const { id, score } = await createRecommendationFactory(recommendation);
  
      const { status } = await supertest(app).post(`/recommendations/${id}/upvote`);
  
      const { score: updatedScore } = await prisma.recommendation.findUnique({
        where: {
          id
        }
      });
  
      expect(status).toEqual(200);
      expect(updatedScore).toEqual(score + 1);
    });
  });
  
  describe("POST /recommendations/:id/downvote", () => {
    it("should return 200 and decrement recommendation score by one given a valid recommendation id", async () => {
      const recommendation = recommendationFactory();
      const { id, score } = await createRecommendationFactory(recommendation);
  
      const { status } = await supertest(app).post(`/recommendations/${id}/downvote`);
  
      const { score: updatedScore } = await prisma.recommendation.findUnique({
        where: {
          id
        }
      });
  
      expect(status).toEqual(200);
      expect(updatedScore).toEqual(score - 1);
    });
  });

  describe("GET /recommendations", () => {
    it("should return 200 and the recommendations list", async () => {
      await createManyRecommendationsFactory(10);

      const { status, body: recommendations } = await supertest(app).get(`/recommendations`);
  
      expect(status).toEqual(200);
      expect(recommendations.length).toEqual(10);
    });
  });

  describe("GET /recommendations/:id", () => {
    it("should return 200 and the recommendation, given an id from an existent recommendation", async () => {
      const recommendation = recommendationFactory();
      const { id } = await createRecommendationFactory(recommendation);

      const { status, body } = await supertest(app).get(`/recommendations/${id}`);
      
      expect(status).toEqual(200);
      expect(body.name).not.toEqual(undefined);
    });
  });
  
  describe("GET /recommendations/random", () => {
    it("should return 200 and the recommendation, given an id from an existent recommendation", async () => {
      const recommendation = recommendationFactory();
      await createRecommendationFactory(recommendation);

      const { status, body } = await supertest(app).get(`/recommendations/random`);
      
      expect(status).toEqual(200);
      expect(body.name).not.toEqual(undefined);
    });
  });

  describe("GET /recommendations/top/:amount", () => {
    it("should return 200 and the 3 best ranked recommendations, given /:amount = 3", async () => {
      const top1 = {
        ...recommendationFactory(),
        score: 160
      };
      const top2 = {
        ...recommendationFactory(),
        score: 150
      };
      const top3 = {
        ...recommendationFactory(),
        score: 140
      };

      await prisma.recommendation.createMany({
        data: [top1, top2, top3]
      });

      const { status, body: recommendations } = await supertest(app)
        .get(`/recommendations/top/${3}`);
      
      expect(status).toEqual(200);
      expect(recommendations[0].score).toEqual(top1.score);
      expect(recommendations[1].score).toEqual(top2.score);
      expect(recommendations[2].score).toEqual(top3.score);
    });
  });
});

async function truncateRecommendations() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}

async function disconnect(){
  await prisma.$disconnect();
}