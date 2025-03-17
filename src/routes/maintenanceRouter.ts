import { Router } from "express";
import { createMaintenanceRequest, deleteMaintenanceRequest, getAllMaintenanceRequests, getMaintenanceRequestById, updateMaintenanceRequest } from "../controllers/maintenanceController";
import { verifyAuth } from "../middlewares/authMiddleware";

const maintenanceRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Maintenance
 *     description: Operations related to maintenance requests
 */

/**
 * @swagger
 * /maintenance:
 *   get:
 *     tags: [Maintenance]
 *     summary: Get all maintenance requests
 *     description: Retrieve a list of all maintenance requests.
 *     responses:
 *       200:
 *         description: A list of all maintenance requests
 */
maintenanceRouter.get("/", getAllMaintenanceRequests);

/**
 * @swagger
 * /maintenance/owner/{ownerId}:
 *   get:
 *     tags: [Maintenance]
 *     summary: Get maintenance requests by owner ID
 *     description: Retrieve all maintenance requests for a specific owner.
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         description: The owner's ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of maintenance requests for the specified owner
 */
maintenanceRouter.get("/owner/:ownerId", getAllMaintenanceRequests);

/**
 * @swagger
 * /maintenance/create:
 *   post:
 *     tags: [Maintenance]
 *     summary: Create a new maintenance request
 *     description: Create a new maintenance request after authenticating.
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       201:
 *         description: Maintenance request created successfully
 *       400:
 *         description: Invalid maintenance request data
 *       401:
 *         description: Unauthorized (invalid or missing token)
 */
maintenanceRouter.post("/create", verifyAuth, createMaintenanceRequest);

/**
 * @swagger
 * /maintenance/{id}:
 *   get:
 *     tags: [Maintenance]
 *     summary: Get a maintenance request by ID
 *     description: Retrieve a maintenance request by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the maintenance request
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested maintenance request
 *       404:
 *         description: Maintenance request not found
 */
maintenanceRouter.get("/:id", getMaintenanceRequestById);

/**
 * @swagger
 * /maintenance/{id}:
 *   put:
 *     tags: [Maintenance]
 *     summary: Update a maintenance request by ID
 *     description: Update an existing maintenance request by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the maintenance request to update
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       200:
 *         description: The updated maintenance request
 *       400:
 *         description: Invalid maintenance request data
 *       404:
 *         description: Maintenance request not found
 */
maintenanceRouter.put("/:id", verifyAuth, updateMaintenanceRequest);

/**
 * @swagger
 * /maintenance/{id}:
 *   delete:
 *     tags: [Maintenance]
 *     summary: Delete a maintenance request by ID
 *     description: Delete a maintenance request by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the maintenance request to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       200:
 *         description: Maintenance request deleted successfully
 *       404:
 *         description: Maintenance request not found
 */
maintenanceRouter.delete("/:id", verifyAuth, deleteMaintenanceRequest);

export default maintenanceRouter;
