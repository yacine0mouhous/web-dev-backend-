import { Router } from "express"
import { createMaintenanceRequest, deleteMaintenanceRequest, getAllMaintenanceRequests, getMaintenanceRequestById, updateMaintenanceRequest } from "../controllers/maintenanceController";
import { verifyAuth } from "../middlewares/authMiddleware";

const maintenanceRouter = Router()




// Get all maintenanceRequests
maintenanceRouter.get("/" ,getAllMaintenanceRequests);

// Get all maintenanceRequests
maintenanceRouter.get("/owner/:ownerId" ,getAllMaintenanceRequests);

// create a maintenanceRequest
maintenanceRouter.post("/create",verifyAuth ,createMaintenanceRequest);

// Get maintenanceRequest by ID
maintenanceRouter.get("/:id", getMaintenanceRequestById);

// Update maintenanceRequest by ID
maintenanceRouter.put("/:id",verifyAuth ,updateMaintenanceRequest);
// Delete maintenanceRequest by ID
maintenanceRouter.delete("/:id",verifyAuth ,deleteMaintenanceRequest);





export default maintenanceRouter