import { Router } from "express"
import { createLease, deleteLease, getAllLeases, getAllLeasesByClientId, getAllLeasesByOwnerId, getLeaseById, updateLease } from "../controllers/leaseController";
import { verifyAuth } from "../middlewares/authMiddleware";

const leaseRouter = Router()



// Get all leases
leaseRouter.get("/",verifyAuth ,getAllLeases);

// Get all leases by owner ID
leaseRouter.get("/owner/:id",verifyAuth ,getAllLeasesByOwnerId);

// Get all leases by client ID
leaseRouter.get("/client/:id",verifyAuth ,getAllLeasesByClientId);

// create a lease
leaseRouter.post("/create",verifyAuth ,createLease);

// Get lease by ID
leaseRouter.get("/:id", getLeaseById);

// Update lease by ID
leaseRouter.put("/:id",verifyAuth ,updateLease);
// delete a lease by id 
leaseRouter.delete("/:id",verifyAuth ,deleteLease);







export default leaseRouter