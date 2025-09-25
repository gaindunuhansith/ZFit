import { Router } from "express";
import {
    getAllMembershipsHandler,
    getMembershipByIdHandler,
    getMembershipsByCategoryHandler,
    createMembershipHandler,
    updateMembershipHandler,
    deleteMembershipHandler,
    getMembershipCategoriesHandler
} from "../controllers/membership.controller.js";

const membershipRouter = Router();


membershipRouter.get("/", getAllMembershipsHandler);
membershipRouter.get("/categories", getMembershipCategoriesHandler);
membershipRouter.get("/category/:category", getMembershipsByCategoryHandler);
membershipRouter.get("/:id", getMembershipByIdHandler);

membershipRouter.post("/", createMembershipHandler);


membershipRouter.put("/:id", updateMembershipHandler);

membershipRouter.delete("/:id", deleteMembershipHandler);

export default membershipRouter;