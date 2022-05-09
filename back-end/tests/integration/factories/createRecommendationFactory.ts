import { prisma } from "../../../src/database";
import { CreateRecommendationData } from "../../../src/services/recommendationsService";

export default async function createRecommendationFactory(recommendation: CreateRecommendationData) {
  return prisma.recommendation.create({
    data: recommendation
  });
}