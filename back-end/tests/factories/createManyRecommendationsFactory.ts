import { prisma } from "../../src/database";
import recommendationFactory from "./recommendationFactory";

export default async function createManyRecommendationsFactory(amount: number) {
  for (let i = 0; i < amount; i++) {
    await prisma.recommendation.create({
      data: recommendationFactory()
    });
  }
}