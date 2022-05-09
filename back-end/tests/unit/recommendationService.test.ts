import { jest } from "@jest/globals";

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
    it("should delete the recommendation given it score is less than -5", async () => {
      const recommendation = recommendationFactory();

      jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendation);
      jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({ ...recommendation, score: -6 });

      const removeSpy = jest.spyOn(recommendationRepository, "remove").mockResolvedValueOnce();

      await recommendationService.downvote(recommendation.id);

      expect(removeSpy).toBeCalledWith(recommendation.id);
    });
  });

  describe("getByIdOrFail", () => {
    it("should throw a not found error given an id from a unexistent recommendation", async () => {
      const recommendation = recommendationFactory();

      jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(undefined);
      
      expect(async () => {
        await recommendationService.getById(recommendation.id);
      }).rejects.toEqual(notFoundError());
    });
  });
});