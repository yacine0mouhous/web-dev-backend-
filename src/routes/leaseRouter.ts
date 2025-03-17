import { Router } from "express";
import { createLease, deleteLease, getAllLeases, getAllLeasesByClientId, getAllLeasesByOwnerId, getLeaseById, updateLease } from "../controllers/leaseController";
import { verifyAuth } from "../middlewares/authMiddleware";

const leaseRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Leases
 *     description: Operations related to lease management
 */

/**
 * @swagger
 * /leases:
 *   get:
 *     tags: [Leases]
 *     summary: Get all leases
 *     description: Retrieve a list of all leases.
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       200:
 *         description: A list of all leases
 */
leaseRouter.get("/", verifyAuth, getAllLeases);

/**
 * @swagger
 * /leases/owner/{id}:
 *   get:
 *     tags: [Leases]
 *     summary: Get all leases by owner ID
 *     description: Retrieve a list of leases associated with a specific owner.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the owner
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       200:
 *         description: A list of leases associated with the owner
 */
leaseRouter.get("/owner/:id", verifyAuth, getAllLeasesByOwnerId);

/**
 * @swagger
 * /leases/client/{id}:
 *   get:
 *     tags: [Leases]
 *     summary: Get all leases by client ID
 *     description: Retrieve a list of leases associated with a specific client.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the client
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       200:
 *         description: A list of leases associated with the client
 */
leaseRouter.get("/client/:id", verifyAuth, getAllLeasesByClientId);

/**
 * @swagger
 * /leases/create:
 *   post:
 *     tags: [Leases]
 *     summary: Create a new lease
 *     description: Create a new lease after authenticating.
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       201:
 *         description: Lease created successfully
 *       400:
 *         description: Invalid lease data
 *       401:
 *         description: Unauthorized (invalid or missing token)
 */
leaseRouter.post("/create", verifyAuth, createLease);

/**
 * @swagger
 * /leases/{id}:
 *   get:
 *     tags: [Leases]
 *     summary: Get lease by ID
 *     description: Retrieve a lease by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the lease
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested lease
 *       404:
 *         description: Lease not found
 */
leaseRouter.get("/:id", getLeaseById);

/**
 * @swagger
 * /leases/{id}:
 *   put:
 *     tags: [Leases]
 *     summary: Update lease by ID
 *     description: Update the details of an existing lease.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the lease to update
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       200:
 *         description: The updated lease
 *       400:
 *         description: Invalid lease data
 *       404:
 *         description: Lease not found
 */
leaseRouter.put("/:id", verifyAuth, updateLease);

/**
 * @swagger
 * /leases/{id}:
 *   delete:
 *     tags: [Leases]
 *     summary: Delete lease by ID
 *     description: Delete a lease by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the lease to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       200:
 *         description: Lease deleted successfully
 *       404:
 *         description: Lease not found
 */
leaseRouter.delete("/:id", verifyAuth, deleteLease);

export default leaseRouter;
