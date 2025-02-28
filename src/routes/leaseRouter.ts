import { Router } from "express"
import { createLease, getLeaseById, updateLease } from "../controllers/leaseController";
import { verifyAuth } from "../middlewares/authMiddleware";

const leaseRouter = Router()



// Get all leases
leaseRouter.get("/" ,getLeaseById);

// create a lease
leaseRouter.post("/create",verifyAuth ,createLease);

// Get lease by ID
leaseRouter.get("/:id", getLeaseById);

// Update lease by ID
leaseRouter.put("/:id",verifyAuth ,updateLease);







export default leaseRouter