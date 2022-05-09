import { jest } from "@jest/globals";
import { PrismaPromise, Recommendation } from "@prisma/client";

import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { notFoundError } from "../../src/utils/errorUtils.js";

import recommendationFactory from "./factories/recommendationFactory";

describe("Recommendation Service Unit Tests", () => {
  describe("insert", () => {
    it("should throw a conflict error given an existent recommendation", async () => {
      const recommendation = recommendationFactory();

      jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce(recommendation);
      
      expect(async () => {
        await recommendationService.insert(recommendation);
      }).rejects.toEqual({
        message: "Recommendations names must be unique",
        type: "conflict",
      });
    });
  });
  
  describe("downvote", () => {
    it("should delete the recommendation given its score is less than -5", async () => {
      const recommendation = recommendationFactory();

      jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendation);
      jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({ ...recommendation, score: -6 });

      const removeSpy = jest.spyOn(recommendationRepository, "remove").mockResolvedValueOnce();

      await recommendationService.downvote(recommendation.id);

      expect(removeSpy).toBeCalledWith(recommendation.id);
    });
  });

  describe("getRandom", () => {
    const recommendations = [
      { ...recommendationFactory(), score: 9 },
      { ...recommendationFactory(), score: 9 },
      { ...recommendationFactory(), score: 20 },
      { ...recommendationFactory(), score: 20 },
    ];

    jest.spyOn(recommendationRepository, "findAll").mockImplementation(
      ({ score, scoreFilter }): PrismaPromise<Recommendation[]> => {
        if (scoreFilter === "gt") {
          return new Promise(resolve => {
            resolve(recommendations.filter(r => r.score > score));
          }) as PrismaPromise<Recommendation[]>; 
        }
        return new Promise(resolve => {
          resolve(recommendations.filter(r => r.score < score));
        }) as PrismaPromise<Recommendation[]>; 
      }
    );

    it("should throw a not found error given it has no recommendation", async () => {
      jest.spyOn(recommendationRepository, "findAll")
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      
      expect(async () => {
        await recommendationService.getRandom();
      }).rejects.toEqual(notFoundError());
    });

    it("should return recommendation with score greater than 10 given random is smaller than 0.7 ", async () => {      
      jest.spyOn(Math, "random").mockReturnValue(0.6);
      
      const randomRecommendation = await recommendationService.getRandom();

      expect(randomRecommendation.score).toBeGreaterThan(10);
    });
    
    it("should return recommendation with score smaller than 10 given random is greater than 0.7 ", async () => {      
      jest.spyOn(Math, "random").mockReturnValue(0.9);
      
      const randomRecommendation = await recommendationService.getRandom();

      expect(randomRecommendation.score).toBeLessThanOrEqual(10);
    });
  });

  describe("getByIdOrFail", () => {
    it("should throw a not found error given an id from an unexistent recommendation", async () => {
      const recommendation = recommendationFactory();

      jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(undefined);
      
      expect(async () => {
        await recommendationService.getById(recommendation.id);
      }).rejects.toEqual(notFoundError());
    });
  });
});