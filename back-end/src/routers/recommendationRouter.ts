import { Router } from "express";
import { recommendationController } from "../controllers/recommendationController.js";

const recommendationRouter = Router();

if(process.env.NODE_ENV === "test") {
  recommendationRouter.post("/reset", recommendationController.reset);
  recommendationRouter.post("/seed", recommendationController.seed);
}

recommendationRouter.post("/", recommendationController.insert);
recommendationRouter.get("/", recommendationController.get);
recommendationRouter.get("/random", recommendationController.random);
recommendationRouter.get("/top/:amount", recommendationController.getTop);
recommendationRouter.get("/:id", recommendationController.getById);
recommendationRouter.post("/:id/upvote", recommendationController.upvote);
recommendationRouter.post("/:id/downvote", recommendationController.downvote);

export default recommendationRouter;
